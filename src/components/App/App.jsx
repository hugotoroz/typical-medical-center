import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '../../pages/general/index/index';
import Login from '../../pages/general/login/login';
import AboutUs from '../../pages/general/aboutUs/aboutUs';
import Specialities from '../../pages/general/specialities/specialities';
import AdminManagment from '../../pages/admin/adminManagment/adminManagment';
import './App.css'
import Register from '../../pages/patient/register/register';
import '@fortawesome/fontawesome-free/css/all.min.css'; ////font-awesome icons
import Schedule from '../../pages/patient/scheduleAppointments/schedule';
import DoctorsPage from '../../pages/doctor/doctorsPage/doctorsPage';
import NewDoctor from '../../pages/admin/newDoctor/newDoctor';
import ProtectedRoute from '../../protected/ProtectedRoute.js';
import Diagnosis from '../../pages/doctor/diagnosis/diagnosis';
import UserProfile from '../../pages/patient/userProfile/userProfile';
import DoctorSchedule from '../../pages/doctor/doctorSchedule/doctorSchedule.jsx';
import DoctorProfile from '../../pages/doctor/doctorProfile/doctorProfile.jsx';

// Configures routes and renders the application with routing.

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Index />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/specialities" element={<Specialities />} />
          <Route path="patient/register" element={<Register />} />
          <Route path="admin/adminManagment" element={<ProtectedRoute allowedRoles={[1]}><AdminManagment /></ProtectedRoute>} />
          <Route path="patient/schedule" element={<ProtectedRoute allowedRoles={[3]}><Schedule /></ProtectedRoute>} />
          <Route path="doctor/doctorsPage" element={<ProtectedRoute allowedRoles={[2]}><DoctorsPage /></ProtectedRoute>} />
          <Route path="admin/newDoctor" element={<ProtectedRoute allowedRoles={[1]}><NewDoctor /></ProtectedRoute>} />
          <Route path="patient/userProfile" element={<ProtectedRoute allowedRoles={[3]}><UserProfile /></ProtectedRoute>} />
          <Route path="doctor/diagnosis" element={<ProtectedRoute allowedRoles={[2]}><Diagnosis /></ProtectedRoute>} />
          <Route path="doctor/doctorSchedule" element={<ProtectedRoute allowedRoles={[2]}><DoctorSchedule /></ProtectedRoute>} />
          <Route path="doctor/doctorProfile" element={<ProtectedRoute allowedRoles={[2]}><DoctorProfile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
