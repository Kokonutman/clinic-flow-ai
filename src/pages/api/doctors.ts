import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/data/mongo";

// Generate a random array of booleans representing 5 time slots per day
function generateRandomSlots(): boolean[] {
  return Array.from({ length: 5 }, () => Math.random() < 0.5);
}

// Generate 6-day randomized schedule starting today
function generateRandomSchedule(): Record<
  string,
  { date: string; slots: boolean[] }
> {
  const today = new Date();
  const schedule: Record<string, { date: string; slots: boolean[] }> = {};

  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];

    schedule[`day${i + 1}`] = {
      date: dateString,
      slots: generateRandomSlots(),
    };
  }

  return schedule;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("bisonbytes");
    const doctors = await db.collection("doctors").find({}).toArray();

    const parsed = doctors.map((doc) => ({
      name: doc.name,
      specialty: doc.specialization,
      schedule: generateRandomSchedule(),
    }));

    res.status(200).json(parsed);
  } catch (error) {
    console.error("❌ Error in /api/doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
}
