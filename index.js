
import Fastify from "fastify";
import WebSocket from "ws";
import fs from "fs";
import dotenv from "dotenv";
import fastifyFormBody from "@fastify/formbody";
import fastifyWs from "@fastify/websocket";
import fetch from "node-fetch";
import { SYSTEM_MESSAGE } from "./prompt.js"; // Import the prompt

dotenv.config();

// Environment variables
const { OPENAI_API_KEY } = process.env;
if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

// You can change VOICE to any available voice on the Realtime API
const VOICE = "alloy";

// Ports & Webhook URLs
const PORT = process.env.PORT || 5050;
const TRANSCRIPT_WEBHOOK_URL =
  "https://hook.us2.make.com/687gq9j3gdqa5mmgpdthy5jread9vjji"; // Where you send transcripts
const BOOKING_WEBHOOK_URL =
  "https://hook.us2.make.com/v6imkg67f7j9p7z1itx483df06lt64yp";

// Keep track of ongoing call sessions
const sessions = new Map();

// Log these event types for debugging
const LOG_EVENT_TYPES = [
  "response.content.done",
  "rate_limits.updated",
  "response.done",
  "input_audio_buffer.committed",
  "input_audio_buffer.speech_stopped",
  "input_audio_buffer.speech_started",
  "session.created",
  "response.text.done",
  "conversation.item.input_audio_transcription.completed",
];

// Main route just to confirm server is up
fastify.get("/", async (request, reply) => {
  reply.send({ message: "ClinicFlow AI (inbound Twilio) is running!" });
});

// Twilio inbound call route
fastify.all("/incoming-call", async (request, reply) => {
  console.log("Incoming call");

  // TwiML that connects immediately to the media stream
  // and says a quick greeting (optional).
  const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say>Hello, thanks for calling Howard Student Health Center. How can I help you today?</Say>
            <Connect>
                <Stream url="wss://${request.headers.host}/media-stream" />
            </Connect>
        </Response>`;

  reply.type("text/xml").send(twimlResponse);
});

// WebSocket for Twilio media stream
fastify.register(async (fastify) => {
  fastify.get("/media-stream", { websocket: true }, (connection, req) => {
    console.log("Client connected to /media-stream");

    // Use Twilio's CallSid as the unique sessionId
    const sessionId =
      req.headers["x-twilio-call-sid"] || `session_${Date.now()}`;
    let session = sessions.get(sessionId) || {
      transcript: "",
      streamSid: null,
    };
    sessions.set(sessionId, session);

    // Connect to OpenAI Realtime WebSocket
    const openAiWs = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17",
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      },
    );

    // Once connected to OpenAI, configure the session
    openAiWs.on("open", () => {
      console.log("Connected to GPT Realtime API");

      // Send the session update with your voice, instructions, tools, etc.
      setTimeout(() => sendSessionUpdate(), 250);
    });

    // Prepare the session update
    const sendSessionUpdate = () => {
      const sessionUpdate = {
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad" },
          input_audio_noise_reduction: { type: "near_field" },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          voice: VOICE,
          instructions: SYSTEM_MESSAGE,
          modalities: ["text", "audio"],
          temperature: 0.8,
          input_audio_transcription: {
            model: "whisper-1",
          },
          // Tools for function calls
          tools: [
            {
              type: "function",
              name: "end_call",
              description: "End the call with a friendly closing message.",
              parameters: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    default:
                      "Thank you for calling Howard Student Health Center. Goodbye!",
                  },
                },
                required: ["message"],
              },
            },
            {
              type: "function",
              name: "book_service",
              description:
                "Collect patient name, reason for visit, and preferred time, then confirm booking or add to waitlist.",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  reason: { type: "string" },
                  booking_time: { type: "string" },
                },
                required: ["name", "reason", "booking_time"],
              },
            },
          ],
          tool_choice: "auto",
        },
      };

      console.log("Sending session update:", JSON.stringify(sessionUpdate));
      openAiWs.send(JSON.stringify(sessionUpdate));
    };

    // Listen for messages from GPT
    openAiWs.on("message", async (data) => {
      try {
        const response = JSON.parse(data);

        // Log specific event types
        if (LOG_EVENT_TYPES.includes(response.type)) {
          console.log(`OpenAI Event: ${response.type}`, response);
        }

        // If user transcription is complete
        if (
          response.type ===
          "conversation.item.input_audio_transcription.completed"
        ) {
          const userMessage = response.transcript.trim();
          session.transcript += `User: ${userMessage}\n`;
          console.log(`User (${sessionId}): ${userMessage}`);
        }

        // If agent's final message in this turn is ready
        if (response.type === "response.done") {
          const agentMessage =
            response.response.output[0]?.content?.find(
              (content) => content.transcript,
            )?.transcript || "Agent message not found";

          session.transcript += `Agent: ${agentMessage}\n`;
          console.log(`Agent (${sessionId}): ${agentMessage}`);
        }

        // If session update is ack'd
        if (response.type === "session.updated") {
          console.log("Session updated successfully:", response);
        }

        // If GPT is sending audio data to speak
        if (response.type === "response.audio.delta" && response.delta) {
          const audioDelta = {
            event: "media",
            streamSid: session.streamSid,
            media: {
              // Twilio expects base64-encoded ulaw
              payload: Buffer.from(response.delta, "base64").toString("base64"),
            },
          };
          connection.send(JSON.stringify(audioDelta));
        }

        // Handle function calls
        if (response.type === "response.function_call_arguments.done") {
          const functionName = response.name;
          const args = JSON.parse(response.arguments);

          console.log("Function called:", functionName, args);

          if (functionName === "book_service") {
            // name, reason, booking_time
            const { name, reason, booking_time } = args;
            console.log(
              `Booking requested. Name=${name}, Reason=${reason}, Time=${booking_time}`,
            );

            // Send to BOOKING_WEBHOOK_URL
            try {
              const bookingResponse = await sendBookingWebhook({
                name,
                reason,
                booking_time,
              });
              // bookingResponse: e.g. { status: "Success", message: "Appointment booked" }

              // Then pass result back to GPT
              const functionOutputEvent = {
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  role: "system",
                  output: JSON.stringify(bookingResponse),
                },
              };
              openAiWs.send(JSON.stringify(functionOutputEvent));

              // Instruct GPT to speak the result
              const instructions = `The booking result: ${bookingResponse.message || "Unknown."}`;
              openAiWs.send(
                JSON.stringify({
                  type: "response.create",
                  response: {
                    modalities: ["text", "audio"],
                    instructions,
                  },
                }),
              );
            } catch (error) {
              console.error("Error sending booking to webhook:", error);
              sendGPTError(
                openAiWs,
                "I'm sorry, I couldn't book the appointment right now.",
              );
            }
          } else if (functionName === "end_call") {
            // Summarily end the call (within the AI flow).
            const goodbyeMessage =
              args.message || "Thank you for calling, goodbye!";
            console.log(
              "end_call function invoked with message:",
              goodbyeMessage,
            );

            // Send a function_call_output item to GPT
            const functionOutputEvent = {
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                role: "system",
                output: goodbyeMessage,
              },
            };
            openAiWs.send(JSON.stringify(functionOutputEvent));

            // Ask GPT to speak the goodbye text
            openAiWs.send(
              JSON.stringify({
                type: "response.create",
                response: {
                  modalities: ["text", "audio"],
                  instructions: `Say: "${goodbyeMessage}"`,
                },
              }),
            );

            // After a delay, we can hang up the call or just let Twilio side handle it.
            setTimeout(() => {
              console.log("Ending call session (placeholder).");
              // If you want to forcibly end the call in Twilio, you need Twilio credentials + call SID
              // Or just let the user hang up.
            }, 5000);
          }
        }
      } catch (error) {
        console.error(
          "Error processing GPT Realtime message:",
          error,
          "Raw:",
          data,
        );
      }
    });

    // Twilio -> GPT audio bridging
    connection.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);
        switch (data.event) {
          case "start":
            session.streamSid = data.start.streamSid;
            console.log("Incoming stream started:", session.streamSid);
            break;
          case "media":
            if (openAiWs.readyState === WebSocket.OPEN) {
              const audioAppend = {
                type: "input_audio_buffer.append",
                audio: data.media.payload,
              };
              openAiWs.send(JSON.stringify(audioAppend));
            }
            break;
          default:
            console.log("Received non-media event:", data.event);
        }
      } catch (error) {
        console.error("Error parsing Twilio message:", error, "Raw:", msg);
      }
    });

    // On close, finalize transcript
    connection.on("close", async () => {
      if (openAiWs.readyState === WebSocket.OPEN) {
        openAiWs.close();
      }
      console.log(`Client disconnected: ${sessionId}`);
      console.log("Full Transcript:\n", session.transcript);

      // Send transcript to Make.com or another endpoint if you want
      await processTranscriptAndSend(session.transcript, sessionId);

      sessions.delete(sessionId);
    });

    // GPT Realtime WebSocket error
    openAiWs.on("error", (error) => {
      console.error("OpenAI Realtime error:", error);
    });
  });
});

// Start server
fastify.listen({ port: PORT }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${PORT}`);
});

// Send transcript to some webhook if desired
async function processTranscriptAndSend(transcript, sessionId = null) {
  console.log(
    `Sending transcript for session ${sessionId} to ${TRANSCRIPT_WEBHOOK_URL}...`,
  );
  try {
    await fetch(TRANSCRIPT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, transcript }),
    });
    console.log("Transcript webhook successful.");
  } catch (error) {
    console.error("Error sending transcript webhook:", error);
  }
}

// Called when GPT calls book_service
async function sendBookingWebhook(bookingData) {
  console.log(
    "Sending booking data to Make.com:",
    JSON.stringify(bookingData, null, 2),
  );
  try {
    const response = await fetch(BOOKING_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error(`Booking webhook failed: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Booking webhook response:", data);
    return data; // Expect { status: "...", message: "..." }
  } catch (error) {
    console.error("Error in sendBookingWebhook:", error);
    throw error;
  }
}

// Helper to tell GPT an error occurred
function sendGPTError(openAiWs, errMsg) {
  openAiWs.send(
    JSON.stringify({
      type: "response.create",
      response: {
        modalities: ["text", "audio"],
        instructions: errMsg,
      },
    }),
  );
}
