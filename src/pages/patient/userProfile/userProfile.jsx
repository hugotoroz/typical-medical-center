import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config.js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar.jsx';
import { User, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const UserProfile = () => {
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

    const [userDetails, setUserDetails] = useState({
      name: '',
      father_lastname: '',
      mother_lastname: '',
      date_of_birth: '',
      age: '',
      gender: '',
      nationality: '',
      marital_status: ''
    });

    const ProfileSection = ({ icon: Icon, label, value }) => (
        <div className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="bg-blue-100 p-2 rounded-full">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-base font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );

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

    const handleCloseModal = () => {
      setShowModal(false);
    };

    // Función para manejar el envío del formulario
      const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSave(e);
        handleCloseModal();
      };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${API_URL}/user/update`,
                { email, cellphone },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.status === "success") {
                sessionStorage.setItem("token", response.data.data.token);
                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario actualizado exitosamente!',
                    showConfirmButton: true
                });
                setShowModal(false);
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            Swal.fire({
                icon: 'error',
                title: 'Hubo un error al actualizar los datos.',
                text: error.message || 'Inténtalo de nuevo más tarde.',
            });
        }
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

            //fetchUserData();
        }
    }, []);

    const renderProfile = () => (
        <div className="max-w-7xl mx-auto p-4 mt-20">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 pb-4 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {userName?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {userName} {patSurName} {matSurName}
                            </h2>
                            <p className="text-gray-500">Perfil de Usuario</p>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <ProfileSection icon={CreditCard} label="RUT" value={rut} />
                        <ProfileSection icon={Mail} label="Correo Electrónico" value={email} />
                        <ProfileSection icon={Phone} label="Teléfono" value={cellphone} />
                        <ProfileSection icon={Calendar} label="Fecha de Nacimiento" value={userDetails.date_of_birth} />
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
                        >
                            Editar Información
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Editar Perfil</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    value={cellphone}
                                    onChange={(e) => setCellphone(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

    const renderAppointments = () => (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4 mt-20">Citas Médicas</h2>
            {appointments.length === 0 ? (
                <p>No hay citas médicas registradas.</p>
            ) : (
                <div className="overflow-x-auto mx-12">
                    <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg ">
                        <thead className="bg-gray-50">
                            <tr >
                                <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Nombre Doctor</th>
                                <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Fecha</th>
                                <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Especialidad</th>
                                <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Estado</th>
                                <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Hora inicio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td className="p-2 border">{appointment.nombre_doctor}</td>
                                    <td className="p-2 border">{new Date(appointment.fecha).toLocaleDateString()}</td>
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
    );

    {/*const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');
      const userRut = "21255252-6"; // Asegúrate de que tienes el RUT en el estado

      console.log(userRut);
    
        const response = await axios.post(`${API_URL}/user/data`, {
          rut: userRut,  // Rut enviado en el cuerpo de la solicitud
        }, {
          headers: {
            'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido es JSON
          }
        });

        console.log(response);
    
        if (response.data && response.data.status === 'success') {
          const { name, father_lastname, mother_lastname, date_of_birth, age, gender, nationality, marital_status } = response.data.data;
          setUserDetails({
            name,
            father_lastname,
            mother_lastname,
            date_of_birth,
            age,
            gender,
            nationality,
            marital_status
          });
        } else {
          console.error('Error al obtener los detalles del usuario', response.data);
        }
     
    };*/}

    return (
        <>
            <Navbar />
            <div className="flex h-screen">
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

                <div className="flex-1 bg-gray-50">
                    {activeTab === 'profile' ? renderProfile() : renderAppointments()}
                </div>
            </div>
        </>
    );
};

export default UserProfile;