import { useState } from 'react'
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
import Profile from '../../pages/profile/profile';

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
          <Route path="/register" element={<Register />} />
          <Route path="/adminManagment" element={<AdminManagment />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/DoctorsPage" element={<DoctorsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
