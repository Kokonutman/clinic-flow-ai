"use client";

import Layout from "@/components/Layout";
import { appointments } from "@/lib/data/appointments";
import { prescriptions } from "@/lib/data/prescriptions";
import { symptoms } from "@/lib/data/symptoms";
import { logs } from "@/lib/data/logs";
import { doctors } from "@/lib/data/doctors";
import { Calendar, Clock, AlertTriangle, Bell, Users } from "lucide-react";

export default function Dashboard() {
  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter and sort upcoming appointments
  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);

  const todayAppointments = appointments.filter(
    (apt) => apt.date === today.toISOString().split("T")[0]
  );
  const criticalSymptoms = symptoms.filter((s) => s.risk === "High");
  const mediumSymptoms = symptoms.filter((s) => s.risk === "Medium");
  const lowSymptoms = symptoms.filter((s) => s.risk === "Low");
  const availableDoctors = doctors
    .filter((d) => d.schedule.day1.slots.some((slot) => !slot))
    .slice(0, 6);

  // Calculate earliest expiration date from prescriptions
  const earliestExpiration = prescriptions
    .filter((p) => !p.reminded)
    .reduce((earliest, current) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expDate = new Date(current.expirationDate);
      const days = Math.ceil(
        (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return Math.min(earliest, days);
    }, Infinity);

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-[#025940]">Dashboard</h1>

        {/* Top Row */}
        <div className="grid grid-cols-12 gap-4">
          {/* Appointments Card */}
          <div
            className="col-span-4 bg-white rounded-xl p-6 shadow-sm h-[470px]"
            style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-12 h-12 text-[#04BF8A]" />
              <div>
                <h3 className="text-lg font-medium text-[#024059]">
                  Total Appointments
                </h3>
                <p className="text-3xl font-bold text-[#04BF8A]">
                  {todayAppointments.length}
                </p>
                <p className="text-sm text-gray-600">Today</p>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-3">
              Upcoming appointments
            </p>
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-[#024059]">{apt.patient}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(apt.date).toLocaleDateString()} at {apt.time} -{" "}
                    {apt.type}
                  </p>
                  <p className="text-sm text-gray-600">{apt.doctor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-8 space-y-4">
            {/* Critical Symptoms and Pending Renewals */}
            <div className="grid grid-cols-2 gap-4">
              {/* Critical Symptoms Card */}
              <div
                className="bg-white rounded-xl px-6 pt-6 pb-8 shadow-sm h-[180px]"
                style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
              >
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-12 h-12 text-red-500" />
                  <div>
                    <h3 className="text-lg font-medium text-[#024059]">
                      Critical Symptoms
                    </h3>
                    <p className="text-3xl font-bold text-red-500">
                      {criticalSymptoms.length}
                    </p>
                    <p className="text-sm text-gray-600">High Risk Cases</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Other cases include:
                    </p>
                    <p className="text-xs text-gray-500">
                      {mediumSymptoms.length} medium and {lowSymptoms.length}{" "}
                      low risk cases
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Renewals Card */}
              <div
                className="bg-white rounded-xl px-6 pt-6 pb-8 shadow-sm h-[180px]"
                style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
              >
                <div className="flex items-center gap-4">
                  <Bell className="w-12 h-12 text-yellow-500" />
                  <div>
                    <h3 className="text-lg font-medium text-[#024059]">
                      Pending Renewals
                    </h3>
                    <p className="text-3xl font-bold text-yellow-500">
                      {prescriptions.filter((p) => !p.reminded).length}
                    </p>
                    <p className="text-sm text-gray-600">Need Attention</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Prescriptions expiring soon
                    </p>
                    <p className="text-xs text-gray-500">
                      Earliest expiration:{" "}
                      {earliestExpiration === Infinity
                        ? "None"
                        : `${earliestExpiration} days`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Availability Card */}
            <div
              className="bg-white rounded-xl p-6 shadow-sm h-[270px]"
              style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-12 h-12 text-[#04BF8A]" />
                <div>
                  <h3 className="text-lg font-medium text-[#024059]">
                    Available Doctors
                  </h3>
                  <p className="text-3xl font-bold text-[#04BF8A]">
                    {availableDoctors.length}
                  </p>
                  <p className="text-sm text-gray-600">Today</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Available Today
                </h3>
                <div className="grid grid-cols-2 gap-x-4">
                  {availableDoctors.map((doctor, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-[#04BF8A] mb-2 ${
                        index >= 3 ? "col-start-2" : "col-start-1"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      <span>
                        {doctor.name}, {doctor.specialty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Card */}
        <div
          className="bg-white rounded-xl p-6 shadow-sm w-full"
          style={{ boxShadow: "0 0 20px rgba(3, 166, 74, 0.15)" }}
        >
          <h2 className="text-lg font-medium text-[#024059] mb-4">
            Recent Activities
          </h2>
          <ul className="list-disc list-inside space-y-3">
            {logs.slice(0, 3).map((log, index) => (
              <li key={index} className="text-gray-600">
                {log.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}
