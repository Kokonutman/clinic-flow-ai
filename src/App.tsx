import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import Symptoms from './pages/Symptoms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/symptoms" element={<Symptoms />} />
      </Routes>
    </Router>
  );
}

export default App;
