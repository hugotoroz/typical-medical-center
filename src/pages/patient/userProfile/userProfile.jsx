import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config.js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar.jsx';
import { User, Mail, Phone, Calendar, CreditCard, FileText } from "lucide-react";
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
    const [historial, setHistorial] = useState([]);

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

    // Datos de ejemplo para documentos
    const patientDocuments = [
        {
            id: 1,
            fileName: 'Radiografía Dental.pdf',
            date: '2024-03-15',
            url: 'https://ejemplo.com/documentos/radiografia.pdf'
        },
        {
            id: 2,
            fileName: 'Resultados Laboratorio.pdf',
            date: '2024-03-10',
            url: 'https://ejemplo.com/documentos/laboratorio.pdf'
        },
        {
            id: 3,
            fileName: 'Receta Médica.pdf',
            date: '2024-03-05',
            url: 'https://ejemplo.com/documentos/receta.pdf'
        },
        {
            id: 4,
            fileName: 'Informe Médico.pdf',
            date: '2024-02-28',
            url: 'https://ejemplo.com/documentos/informe.pdf'
        }
    ];

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
        }
    }, []);

    /////documentos del paciente

    useEffect(() => {
        // Obtén el idCita desde el localStorage
        
        const token = sessionStorage.getItem("token");
        
        console.log(token);

        const decodedToken = jwtDecode(token);

        console.log(decodedToken.id);

        const idPaciente = decodedToken.id;

        console.log(idPaciente);

        if (idPaciente) {

          // Haz la petición al backend
          axios
            .get(`${API_URL}/patients/${idPaciente}/observations`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log(response.data);
                setHistorial(response.data);
            })
            
        } else {
          console.log("No se encontró un ID actual del paciente.");
        }
      }, []); // Solo se ejecuta al montar el componente

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
                    <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
                        <thead className="bg-gray-50">
                            <tr>
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

    const renderDocuments = () => (
        <div className="p-4 mt-20">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Mis Documentos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patientDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => window.open(doc.url, '_blank')}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <FileText className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {doc.fileName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(doc.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

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
                        className={`p-3 rounded-lg mb-4 transition-colors ${
                            activeTab === 'appointments' ? 'bg-blue-500' : 'hover:bg-gray-700'
                        }`}
                    >
                        <Calendar size={24} />
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`p-3 rounded-lg transition-colors ${
                            activeTab === 'documents' ? 'bg-blue-500' : 'hover:bg-gray-700'
                        }`}
                    >
                        <FileText size={24} />
                    </button>
                </div>

                <div className="flex-1 bg-gray-50">
                    {activeTab === 'profile' ? renderProfile() : 
                     activeTab === 'appointments' ? renderAppointments() : 
                     renderDocuments()}
                </div>
            </div>
        </>
    );
};

export default UserProfile;