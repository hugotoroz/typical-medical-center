import { useState } from 'react'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '../../pages/index/index';
import Login from '../../pages/login/login';
import Contact from '../../pages/contact/contact';
import AdminManagment from '../../pages/adminManagment/adminManagment';
import './App.css'
import Register from '../../pages/register/register';
import '@fortawesome/fontawesome-free/css/all.min.css'; ////font-awesome icons
import Schedule from '../../pages/scheduleAppointments/schedule';
import DoctorsPage from '../../pages/doctorsPage/doctorsPage';
import NewDoctor from '../../pages/newDoctor/newDoctor';
import ProtectedRoute from '../../protected/ProtectedRoute.js'; 
import logo from '../../images/logo/logo.jpeg';

////Configures routes and renders the application with routing.

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Cambiar el título de la pestaña
    document.title = "Typical Medical Center";

    // Cambiar el favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = logo; // logo es la URL importada
    } else {
      // Crear el favicon si no existe
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = logo;
      document.head.appendChild(newFavicon);
    }
}, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminManagment" element={<ProtectedRoute><AdminManagment /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/doctorsPage" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
          <Route path="/newDoctor" element={<ProtectedRoute><NewDoctor /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
