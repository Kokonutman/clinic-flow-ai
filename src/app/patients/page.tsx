"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Search } from "lucide-react";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch("/api/patients");
      const data = await res.json();
      console.log("🧬 Fetched patients:", data);
      setPatients(data);
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#025940]">Patients</h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "#026873" }}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026873] focus:ring-opacity-50"
              style={{ borderColor: "#026873", minWidth: "250px" }}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredPatients.map((patient, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm flex items-start"
              style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
            >
              <div className="w-64 flex-shrink-0">
                <h3 className="text-xl font-semibold text-[#024059]">
                  {patient.name}
                </h3>
                <div className="flex flex-col gap-1 mt-2 text-gray-600">
                  <p>{patient.phone}</p>
                  <p>{patient.email}</p>
                  <p>DOB: {new Date(patient.dob).toLocaleDateString()}</p>
                  <p>Insurance: {patient.insurance}</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                {/* Appointment Box */}
                <div className="bg-gray-50 p-6 rounded-lg h-full">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Appointments
                  </p>
                  {patient.appointment ? (
                    <div className="text-sm text-gray-600">
                      <p>
                        {new Date(
                          patient.appointment.date
                        ).toLocaleDateString()}{" "}
                        • {patient.appointment.time}
                      </p>
                      <p>{patient.appointment.type}</p>
                      <p>{patient.appointment.doctor}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          Last visited:{" "}
                          {patient.lastVisit
                            ? new Date(patient.lastVisit).toLocaleDateString()
                            : "None"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">None</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          Last visited:{" "}
                          {patient.lastVisit
                            ? new Date(patient.lastVisit).toLocaleDateString()
                            : "None"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Prescription Box */}
                <div className="bg-gray-50 p-6 rounded-lg h-full">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Prescriptions
                  </p>
                  {patient.prescription ? (
                    <div className="text-sm text-gray-600">
                      <p>{patient.prescription.medication_name}</p>
                      <p>{patient.prescription.dosage}</p>
                      <p>{patient.prescription.frequency}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">None</p>
                  )}
                </div>

                {/* Medical History Box */}
                <div className="bg-gray-50 p-6 rounded-lg h-full">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    History
                  </p>
                  {patient.medicalHistory ? (
                    <p className="text-sm text-gray-600">
                      {patient.medicalHistory}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">None</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
