import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/data/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("bisonbytes"); // match what you see in Compass
    const appointments = await db.collection("appointments").find({}).toArray();

    const mapped = appointments.map((apt) => ({
      patient: apt.patient_id,
      doctor: apt.doctor_id,
      date: apt.appointment_date,
      time: apt.appointment_time,
      type: apt.appointment_type,
      reminded: apt.reminder_sent,
    }));

    res.status(200).json(mapped);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
