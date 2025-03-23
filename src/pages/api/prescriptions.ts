import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/data/mongo";

// Safely convert Python-style string → JSON-compatible object
function normalizePrescriptions(raw: any): {
  medication_name: string;
  dosage: string;
  frequency: string;
  renewal_date?: string;
}[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw;
  }

  if (typeof raw === "string") {
    try {
      const cleaned = raw
        .replace(/datetime\.date\((\d+), (\d+), (\d+)\)/g, '"$1-$2-$3"') // convert datetime.date to ISO string
        .replace(/'/g, '"'); // convert single quotes to double quotes

      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Failed to parse prescription string:", raw, err);
      return [];
    }
  }

  return [];
}

// Fallback expiration date if not provided
function generateExpirationDate(): string {
  const daysFromNow = Math.floor(Math.random() * 30 + 1);
  const future = new Date();
  future.setDate(future.getDate() + daysFromNow);
  return future.toISOString().split("T")[0];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("bisonbytes");
    const patients = await db.collection("patients").find({}).toArray();

    const prescriptions = patients.flatMap((patient) => {
      const entries = normalizePrescriptions(patient.prescriptions);

      return entries.map((rx) => ({
        patient: patient.name,
        medicine: rx.medication_name,
        dosage: rx.dosage,
        frequency: rx.frequency,
        expirationDate: rx.renewal_date || generateExpirationDate(),
        reminded: false,
      }));
    });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("❌ Error loading prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
}
