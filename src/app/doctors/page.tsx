"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Search, CheckSquare, Square } from "lucide-react";

const timeSlots = [
  "8:00 - 10:00 AM",
  "10:00 - 12:00 AM",
  "12:00 - 2:00 PM",
  "2:00 - 4:00 PM",
  "4:00 - 6:00 PM",
];

type Doctor = {
  name: string;
  specialty: string;
  schedule: {
    [key: string]: {
      date: string;
      slots: boolean[];
    };
  };
};

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      console.log("🧠 Doctors fetched:", data);
      if (Array.isArray(data)) {
        setDoctors(data);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#025940]">Doctors</h1>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              style={{ color: "#026873" }}
            />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026873] focus:ring-opacity-50"
              style={{ borderColor: "#026873", minWidth: "250px" }}
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredDoctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-start"
              style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
            >
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#024059]">
                  {doctor.name}
                </h3>
                <p className="text-gray-600 mt-1">{doctor.specialty}</p>
              </div>
              <div className="flex gap-4">
                {Object.entries(doctor.schedule).map(([dayKey, dayData]) => (
                  <div
                    key={dayKey}
                    className="bg-gray-50 p-4 rounded-lg min-w-[150px]"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {
                        [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][new Date(dayData.date).getDay()]
                      }
                      <br />
                      {new Date(dayData.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="space-y-2">
                      {dayData.slots.map((isBooked, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-2"
                        >
                          {isBooked ? (
                            <CheckSquare className="w-4 h-4 text-[#04BF8A]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-xs text-gray-600">
                            {timeSlots[slotIndex]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
