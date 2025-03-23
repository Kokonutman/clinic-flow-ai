import React from 'react';
import Layout from '../components/Layout';
import { logs } from '../data/logs';

export default function Logs() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#025940]">Logs</h1>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto"
             style={{ boxShadow: '0 0 20px rgba(3, 166, 74, 0.15)' }}>
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[70%]" />
            </colgroup>
            <thead>
              <tr className="text-left text-gray-600 border-b border-gray-200">
                <th className="pb-4 font-medium text-[#024059]">Date</th>
                <th className="pb-4 font-medium text-[#024059]">Time</th>
                <th className="pb-4 font-medium text-[#024059]">Message</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => {
                const [date, time] = log.timestamp.split(' ');
                return (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100"
                    style={{ backgroundColor: index % 2 === 0 ? '#F2FBFF' : 'transparent' }}
                  >
                    <td className="py-4 text-gray-900 font-medium">{date}</td>
                    <td className="py-4 text-gray-900 font-medium">{time}</td>
                    <td className="py-4 text-gray-900">{log.message}</td>
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