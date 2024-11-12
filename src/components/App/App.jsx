import { useState } from 'react'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '../../pages/general/index/index';
import Login from '../../pages/general/login/login';
import Contact from '../../pages/general/contact/contact';
import AdminManagment from '../../pages/admin/adminManagment/adminManagment';
import './App.css'
import Register from '../../pages/patient/register/register';
import '@fortawesome/fontawesome-free/css/all.min.css'; ////font-awesome icons
import Schedule from '../../pages/patient/scheduleAppointments/schedule';
import DoctorsPage from '../../pages/doctor/doctorsPage/doctorsPage';
import NewDoctor from '../../pages/admin/newDoctor/newDoctor';
import ProtectedRoute from '../../protected/ProtectedRoute.js';
import Diagnosis from '../../pages/doctor/diagnosis/diagnosis';
// Logo moved to index.html 
// import logo from '../../images/logo/logo.jpeg';

////Configures routes and renders the application with routing.

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="patient/register" element={<Register />} />
          <Route path="admin/adminManagment" element={<ProtectedRoute><AdminManagment /></ProtectedRoute>} />
          <Route path="patient/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="doctor/doctorsPage" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
          <Route path="admin/newDoctor" element={<ProtectedRoute><NewDoctor /></ProtectedRoute>} />
          <Route path="doctor/diagnosis" element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
