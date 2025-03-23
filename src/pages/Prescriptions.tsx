import React, { useState } from 'react';
import Layout from '../components/Layout';
import { prescriptions as initialPrescriptions } from '../data/prescriptions';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const handleReminder = (index: number) => {
    setPrescriptions(prevPrescriptions => 
      prevPrescriptions.map((prescription, i) => 
        i === index ? { ...prescription, reminded: true } : prescription
      )
    );
  };

  // Function to calculate days until expiration
  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sort prescriptions by expiration date
  const sortedPrescriptions = [...prescriptions].sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#025940]">Prescriptions</h1>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto"
             style={{ boxShadow: '0 0 20px rgba(3, 166, 74, 0.15)' }}>
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[25%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="pb-4 font-medium text-[#024059]">Patient</th>
                <th className="pb-4 font-medium text-[#024059]">Prescription</th>
                <th className="pb-4 font-medium text-[#024059]">Expiration</th>
                <th className="pb-4 font-medium text-[#024059]">Dosage</th>
                <th className="pb-4 font-medium text-center text-[#024059]">Reminder</th>
              </tr>
            </thead>
            <tbody>
              {sortedPrescriptions.map((prescription, index) => {
                const daysUntil = getDaysUntilExpiration(prescription.expirationDate);
                const expiringTomorrow = daysUntil === 1;

                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">{prescription.patient}</td>
                    <td className="py-4 text-gray-900">{prescription.medicine}</td>
                    <td className="py-4 text-gray-900">
                      {new Date(prescription.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-900">{prescription.dosage}</td>
                    <td className="py-4 h-[60px] text-center">
                      {expiringTomorrow ? (
                        prescription.reminded ? (
                          <span className="inline-block px-4 py-2 text-gray-500">Already Reminded</span>
                        ) : (
                          <button
                            onClick={() => handleReminder(index)}
                            className="px-4 py-2 bg-[#04BF8A] text-white rounded-lg hover:bg-[#03A64A] transition-colors"
                          >
                            Send Reminder
                          </button>
                        )
                      ) : (
                        <span className="inline-block px-4 py-2 text-gray-500">{daysUntil} days to go</span>
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