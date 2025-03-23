import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/data/mongo";

// Utility: safely parse JSON
function safeParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("bisonbytes");
    const patients = await db.collection("patients").find({}).toArray();

    const formatted = patients.map((p) => {
      const prescriptions = safeParse<
        { medication_name: string; dosage: string; frequency: string }[]
      >(p.prescriptions, []);
      const history = safeParse<
        { entry_type: string; details: string; date: string }[]
      >(p.medical_history, []);

      return {
        name: p.name,
        phone: p.phone_number,
        email: p.email,
        dob: p.date_of_birth,
        insurance: p.insurance_provider,
        appointment: p.last_appointment_date
          ? {
              date: p.last_appointment_date,
              time: "10:00 AM", // placeholder
              type: "Follow-up", // placeholder
              doctor: "Dr. Placeholder", // replace if needed
            }
          : null,
        lastVisit: p.last_appointment_date,
        prescription: prescriptions[0] || null,
        medicalHistory: history[0]?.details || null,
      };
    });

    res.status(200).json(formatted);
  } catch (e) {
    console.error("❌ Error fetching patients:", e);
    res.status(500).json({ error: "Failed to load patients" });
  }
}
