import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config.js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar.jsx';
import Footer from '../../../components/footer/footer.jsx';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import { jwtDecode } from "jwt-decode";
import { User, Calendar } from 'lucide-react';

const  UserProfile = () => {
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [patSurName, setPatSurName] = useState('');
    const [matSurName, setMatSurName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
  
  
    const [cellphone, setCellphone] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');

    const fetchAppointments = async () => {
        try {
          const response = await axios.get(`${API_URL}/appointments/patient`, {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
          });
          if (response.data && response.data.data) {
            setAppointments(response.data.data);
          } else {
            console.error('Unexpected API response format:', response.data);
            setAppointments([]);
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
          setAppointments([]);
        }
      };
    
      useEffect(() => {
        fetchAppointments();
      }, []);
    
      const handleSave = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.put(
            "https://tmcenter.cl/api/user/update",
            { email, cellphone },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          );
    
          if (response.data.status === "success") {
            // Guardar el nuevo token
            sessionStorage.setItem("token", response.data.data.token);
            alert("¡Usuario actualizado exitosamente!");
            setShowModal(false); // Cerrar el modal
          }
        } catch (error) {
          console.error("Error al actualizar el usuario:", error);
          alert("Hubo un error al actualizar los datos.");
        }
      };
    
      
    
      const handleCloseModal = () => {
        setShowModal(false);
      };
    
      // Función para manejar el envío del formulario
      const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSave(e);
        handleCloseModal();
      };
    
      useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserName(decodedToken.fullName);
          setRut(decodedToken.rut);
          setEmail(decodedToken.email);
          setPassword(decodedToken.password);
          setPatSurName(decodedToken.patSurName);
          setMatSurName(decodedToken.matSurName);
          setDateBirth(decodedToken.dateBirth);
          setCellphone(decodedToken.cellphone);
        }
      }, []);
    

    const renderContent = () => {
      if (activeTab === 'profile') {
        return (
            <>
          <div className="p-4 mt-20">
            <h2 className="text-xl font-bold mb-4">Perfil de Usuario</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Información Personal</h3>
                <p className="text-gray-600">{rut}</p>
                <p className="text-gray-600">{email}</p>
                <p className="text-gray-600">{userName}</p>
                <p className="text-gray-600">{patSurName}</p>
                <p className="text-gray-600">{matSurName}</p>
                <p className="text-gray-600">{dateBirth}</p>
                <p className="text-gray-600">{cellphone}</p>
              </div>
              <div className="flex items-center justify-center">
            <button onClick={() => setShowModal(true)} className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500">Editar Información</button>
          </div>
            </div>
          </div>

          {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Actualizar datos
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="email"
              />
              <input
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)}
                placeholder="Telefono"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="number"
              />
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                type="submit"
              >
                Guardar
              </button>
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
          </>
        );
      }
  
      return (
        <>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 mt-20">Citas Médicas</h2>
          {appointments.length === 0 ? (
            <p>The patient has not had any medical appointments yet.</p>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border">Nombre Doctor</th>
                  <th className="p-2 text-left border">Fecha</th>
                  <th className="p-2 text-left border">Especialidad</th>
                  <th className="p-2 text-left border">Estado</th>
                  <th className="p-2 text-left border">Hora inicio</th>
                </tr>
              </thead>
              <tbody>
              {appointments.map((appointment,index) => (
                    <tr key={index}>
                      <td className="p-2 border">{appointment.nombre_doctor}</td>
                      <td className="p-2 border">{appointment.fecha}</td>
                      <td className="p-2 border">{appointment.nombre_especialidad}</td>
                      <td className="p-2 border">{appointment.estado}</td>
                      <td className="p-2 border">{appointment.hora_inicio}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
        </>
      );
    };
  
    return (
        <>
        <Navbar />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-4 mt-20">
          <button
            onClick={() => setActiveTab('profile')}
            className={`p-3 rounded-lg mb-4 transition-colors ${
              activeTab === 'profile' ? 'bg-blue-500' : 'hover:bg-gray-700'
            }`}
          >
            <User size={24} />
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`p-3 rounded-lg transition-colors ${
              activeTab === 'appointments' ? 'bg-blue-500' : 'hover:bg-gray-700'
            }`}
          >
            <Calendar size={24} />
          </button>
        </div>
  
        {/* Content Area */}
        <div className="flex-1 bg-white">
          {renderContent()}
        </div>
        
      </div>
      </>
    );
}

export default UserProfile;
