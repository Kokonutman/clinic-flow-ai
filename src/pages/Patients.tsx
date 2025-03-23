import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Search } from 'lucide-react';
import { doctors } from '../data/doctors';

const patients = [
  {
    name: 'John Smith',
    phone: '(202) 555-0123',
    email: 'john.smith@example.com',
    dob: '1995-06-15',
    insurance: 'Blue Cross Blue Shield',
    appointment: {
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Check-up',
      doctor: 'Dr. Sarah Johnson'
    },
    lastVisit: '2024-02-15',
    prescription: {
      medicine: 'Amoxicillin',
      dosage: '500mg twice daily',
      renewalDate: '2024-04-15'
    },
    medicalHistory: 'Treated for seasonal allergies (03/01/2024)'
  },
  {
    name: 'Sarah Williams',
    phone: '(202) 555-0124',
    email: 'sarah.w@example.com',
    dob: '1988-09-23',
    insurance: 'Aetna',
    appointment: null,
    lastVisit: '2024-01-20',
    prescription: null,
    medicalHistory: 'Annual physical examination (02/15/2024)'
  },
];

// Add detailed information to all existing patients
const patientsWithDetails = patients.map((patient, index) => ({
  name: patient.name,
  phone: `(202) 555-${String(index + 1000).slice(-4)}`,
  email: `patient${index}@example.com`,
  dob: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  insurance: ['Blue Cross', 'Aetna', 'United HC', 'Cigna'][Math.floor(Math.random() * 4)],
  appointment: Math.random() < 0.3 ? {
    date: '2024-03-20',
    time: '10:00 AM',
    type: ['Check-up', 'Follow-up', 'Consultation'][Math.floor(Math.random() * 3)],
    doctor: doctors[Math.floor(Math.random() * doctors.length)].name
  } : null,
  lastVisit: Math.random() < 0.8 ? new Date(Date.now() - Math.random() * 7776000000).toISOString().split('T')[0] : null,
  prescription: Math.random() < 0.4 ? {
    medicine: ['Amoxicillin', 'Lisinopril', 'Metformin'][Math.floor(Math.random() * 3)],
    dosage: ['500mg twice daily', '10mg once daily', '1000mg with meals'][Math.floor(Math.random() * 3)],
    renewalDate: Math.random() < 0.5 ? '2024-04-15' : null
  } : null,
  medicalHistory: Math.random() < 0.7 ? 
    ['Annual physical examination', 'Treated for seasonal allergies', 'Routine vaccination'][Math.floor(Math.random() * 3)] +
    ` (${new Date(Date.now() - Math.random() * 7776000000).toLocaleDateString()})` : null
}));

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patientsWithDetails.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[#025940]">Patients</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#026873' }} />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#026873] focus:ring-opacity-50"
              style={{ borderColor: '#026873', minWidth: '250px' }}
            />
          </div>
        </div>
        
        <div className="grid gap-4">
          {filteredPatients.map((patient, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm flex items-start"
              style={{ boxShadow: '0 0 20px rgba(3, 166, 74, 0.15)' }}
            >
              <div className="w-64 flex-shrink-0">
                <h3 className="text-xl font-semibold text-[#024059]">{patient.name}</h3>
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
                  <p className="text-sm font-medium text-gray-700 mb-3">Appointments</p>
                  {patient.appointment ? (
                    <div className="text-sm text-gray-600">
                      <p>{new Date(patient.appointment.date).toLocaleDateString()} • {patient.appointment.time}</p>
                      <p>{patient.appointment.type}</p>
                      <p>{patient.appointment.doctor}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Last visited: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'None'}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">None</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Last visited: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'None'}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Prescription Box */}
                <div className="bg-gray-50 p-6 rounded-lg h-full">
                  <p className="text-sm font-medium text-gray-700 mb-3">Prescriptions</p>
                  {patient.prescription ? (
                    <div className="text-sm text-gray-600">
                      <p>{patient.prescription.medicine}</p>
                      <p>{patient.prescription.dosage}</p>
                      {patient.prescription.renewalDate && (
                        <p>Renewal: {new Date(patient.prescription.renewalDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">None</p>
                  )}
                </div>

                {/* Medical History Box */}
                <div className="bg-gray-50 p-6 rounded-lg h-full">
                  <p className="text-sm font-medium text-gray-700 mb-3">History</p>
                  {patient.medicalHistory ? (
                    <p className="text-sm text-gray-600">{patient.medicalHistory}</p>
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