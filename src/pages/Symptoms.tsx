import React from 'react';
import Layout from '../components/Layout';
import { symptoms } from '../data/symptoms';

function RiskIndicator({ risk }: { risk: string }) {
  const colors = {
    Low: {
      bg: 'bg-green-400',
      text: 'text-green-900'
    },
    Medium: {
      bg: 'bg-yellow-400',
      text: 'text-yellow-900'
    },
    High: {
      bg: 'bg-red-400',
      text: 'text-red-900'
    }
  };

  const { bg, text } = colors[risk as keyof typeof colors];

  return (
    <div className={`${bg} w-16 h-6 rounded-full flex items-center justify-center`}>
      <span className={`text-xs font-medium ${text}`}>{risk}</span>
    </div>
  );
}

export default function Symptoms() {
  // Sort symptoms by reported date, most recent first
  const sortedSymptoms = [...symptoms].sort((a, b) => 
    new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );

  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#025940]">Symptoms</h1>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto"
             style={{ boxShadow: '0 0 20px rgba(3, 166, 74, 0.15)' }}>
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[25%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="pb-4 font-medium text-[#024059]">Patient</th>
                <th className="pb-4 font-medium text-[#024059]">Date</th>
                <th className="pb-4 font-medium text-[#024059]">Time</th>
                <th className="pb-4 font-medium text-[#024059]">Symptoms</th>
                <th className="pb-4 font-medium text-[#024059]">Risk</th>
                <th className="pb-4 font-medium text-[#024059]">Response</th>
              </tr>
            </thead>
            <tbody>
              {sortedSymptoms.map((symptom, index) => {
                const reportedDate = new Date(symptom.reportedAt);
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">{symptom.patient}</td>
                    <td className="py-4 text-gray-900">
                      {reportedDate.toLocaleDateString()}
                    </td>
                    <td className="py-4 text-gray-900">
                      {reportedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 text-gray-900">{symptom.symptoms}</td>
                    <td className="py-4">
                      <RiskIndicator risk={symptom.risk} />
                    </td>
                    <td className="py-4 text-gray-900">{symptom.response}</td>
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