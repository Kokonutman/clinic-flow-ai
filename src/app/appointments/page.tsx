"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";

export default function Appointments() {
  type Appointment = {
    patient: string;
    doctor: string;
    date: string;
    time: string;
    type: string;
    reminded: boolean;
  };

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/appointments");
      const data = await res.json();

      const updated: Appointment[] = data.map((apt: any) => ({
        patient: apt.patient,
        doctor: apt.doctor,
        date: apt.date,
        time: apt.time,
        type: apt.type,
        reminded:
          getDaysUntilAppointment(apt.date) === 1 ? apt.reminded : false,
      }));

      setAppointments(updated);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/appointments");
      const data = await res.json();

      const updated = data.map((apt: any) => ({
        ...apt,
        reminded:
          getDaysUntilAppointment(apt.date) === 1 ? apt.reminded : false,
      }));

      setAppointments(updated);
    };

    fetchData();
  }, []);

  const handleReminder = (index: number) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment, i) =>
        i === index ? { ...appointment, reminded: true } : appointment
      )
    );
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  function getDaysUntilAppointment(date: string) {
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#025940]">
            Appointments
          </h1>
        </div>
        <div
          className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto"
          style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
        >
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="pb-4 font-medium text-[#024059]">Patient</th>
                <th className="pb-4 font-medium text-[#024059]">Date</th>
                <th className="pb-4 font-medium text-[#024059]">Time</th>
                <th className="pb-4 font-medium text-[#024059]">Type</th>
                <th className="pb-4 font-medium text-[#024059]">Doctor</th>
                <th className="pb-4 font-medium text-center text-[#024059]">
                  Reminder
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment, index) => {
                const daysUntil = getDaysUntilAppointment(appointment.date);
                const isTomorrow = daysUntil === 1;

                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">
                      {appointment.patient}
                    </td>
                    <td className="py-4 text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-900">{appointment.time}</td>
                    <td className="py-4 text-gray-900">{appointment.type}</td>
                    <td className="py-4 text-gray-900">{appointment.doctor}</td>
                    <td className="py-4 h-[60px] text-center">
                      {isTomorrow ? (
                        appointment.reminded ? (
                          <span className="inline-block px-4 py-2 text-gray-500">
                            Already Reminded
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReminder(index)}
                            className="px-4 py-2 bg-[#04BF8A] text-white rounded-lg hover:bg-[#03A64A] transition-colors"
                          >
                            Send Reminder
                          </button>
                        )
                      ) : (
                        <span className="inline-block px-4 py-2 text-gray-500">
                          {daysUntil} days to go
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
