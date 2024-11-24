import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../../../config.js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar.jsx';
import { User, Mail, Phone, Calendar, CreditCard, FileText } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import pdf_image from '../../../images/doctor/pdf_image.png';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const [isLoading, setIsLoading] = useState(false);

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
            
            // Verificamos si existe el mensaje de error específico
            const errorMessage = error.response?.data?.message || error.message;
            
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: errorMessage === 'Error: El email ya está registrado' 
                    ? 'El email ingresado ya está registrado en el sistema'
                    : 'Hubo un error al actualizar los datos. Inténtalo de nuevo más tarde.',
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
            .get(`${API_URL}/patients/myDocuments/search`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                console.log("Documentos del paciente: ", response.data);
                setHistorial(response.data);
            })
            
        } else {
          console.log("No se encontró un ID actual del paciente.");
        }
      }, []); // Solo se ejecuta al montar el componente


      const handleOpenModal = (doc) => {
        setSelectedDoc(doc);
        setIsModalOpen(true);
      };

      const cerrarModal = () => {
        setSelectedDoc(null);
        setIsModalOpen(false);
      };

    ////////////filtros documentos

    // Estados para los selects
    const [documentTypes, setDocumentTypes] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    
    // Estados para los valores seleccionados
    const [selectedType, setSelectedType] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Función para cargar los tipos de documento
    const fetchDocumentTypes = async () => {
        try {
            const response = await axios.get(`${API_URL}/documents/types`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            console.log(response.data.data)
            setDocumentTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching document types:', error);
        }
    };

    // Función para cargar las especialidades
    const fetchSpecialties = async () => {
        try {
            const response = await axios.get(`${API_URL}/doctors/specialities`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });
            setSpecialties(response.data);
        } catch (error) {
            console.error('Error fetching specialties:', error);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchDocumentTypes();
        fetchSpecialties();
    }, []);

    const fetchHistorial = async (filters = {}) => {
        setIsLoading(true); // Activar spinner
        try {
            const token = sessionStorage.getItem("token");
            if (!token) return;

            const queryParams = new URLSearchParams();
            if (filters.specialityId) queryParams.append('specialityId', filters.specialityId);
            if (filters.documentTypeId) queryParams.append('documentTypeId', filters.documentTypeId);
            if (filters.date) queryParams.append('date', filters.date);

            const url = `${API_URL}/patients/myDocuments/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Documentos filtrados: ", response.data);
            setHistorial(response.data);
        } catch (error) {
            console.error("Error fetching filtered documents:", error);
            setHistorial([]);
        } finally {
            setIsLoading(false); // Desactivar spinner
        }
    };

    // Modificar los manejadores de filtros para incluir el estado de carga
    const handleTypeChange = async (e) => {
        const newType = e.target.value;
        setSelectedType(newType);
        await fetchHistorial({
            documentTypeId: newType || undefined,
            specialityId: selectedSpecialty || undefined,
            date: selectedDate || undefined
        });
    };

    const handleSpecialtyChange = async (e) => {
        const newSpecialty = e.target.value;
        setSelectedSpecialty(newSpecialty);
        await fetchHistorial({
            documentTypeId: selectedType || undefined,
            specialityId: newSpecialty || undefined,
            date: selectedDate || undefined
        });
    };

    const handleDateChange = async (date) => {
        if (date === null) {
            setSelectedDate(null);
            console.log("Fecha borrada");
            await fetchHistorial({
                documentTypeId: selectedType || undefined,
                specialityId: selectedSpecialty || undefined,
                date: null
            });
        } else {
            const newDate = format(date, "yyyy-MM-dd");
            setSelectedDate(newDate);
            console.log(newDate);
            await fetchHistorial({
                documentTypeId: selectedType || undefined,
                specialityId: selectedSpecialty || undefined,
                date: newDate || undefined
            });
        }
    };

    ///////////////////////////////

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
                        <ProfileSection 
                            icon={Calendar} 
                            label="Fecha de Nacimiento" 
                            value={new Date(dateBirth).toLocaleDateString('es-CL', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric' 
                            })} 
                            />
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
                                    <td className="p-2 border">{appointment.hora_inicio.slice(0, 5)}</td>
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
                <div className="flex flex-col items-center mb-8">
                    <h2 className="text-2xl font-bold mb-6">Mis Documentos</h2>
                    <div className="flex gap-4">
                    <select
                            value={selectedType}
                            onChange={handleTypeChange}
                            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Todos los documentos</option>
                            {documentTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.nom}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedSpecialty}
                            onChange={handleSpecialtyChange}
                            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Todas las especialidades</option>
                            {specialties.map((specialty) => (
                                <option key={specialty.id} value={specialty.id}>
                                    {specialty.nom}
                                </option>
                            ))}
                        </select>

                        <DatePicker
                            selected={selectedDate ? new Date(selectedDate + 'T00:00:00') : null} // Forzamos la fecha a la zona horaria local
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            placeholderText="Selecciona una fecha"
                            isClearable
                            locale={es}
                        />


                    </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {historial.map((doc) => (
                            <div
                                key={doc.id_cita}
                                onClick={() => handleOpenModal(doc)}
                                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <FileText className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {doc.nombre_especialidad}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(doc.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {isModalOpen && selectedDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full transform transition-all">
                            {/* Header */}
                            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Detalles de la Consulta
                                </h2>
                                <button 
                                    onClick={cerrarModal}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-600 font-medium mb-1">Doctor</p>
                                        <p className="text-gray-800 font-semibold">{selectedDoc.nombre_doctor}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-600 font-medium mb-1">Especialidad</p>
                                        <p className="text-gray-800 font-semibold">{selectedDoc.nombre_especialidad}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-600 font-medium mb-1">Fecha</p>
                                        <p className="text-gray-800 font-semibold">
                                            {new Date(selectedDoc.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                                        </p>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos Adjuntos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedDoc.documents.map((document, index) => (
                                            <a
                                                key={index}
                                                href={document.src}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                            >
                                                <img 
                                                    src={pdf_image} 
                                                    alt="PDF" 
                                                    className="w-10 h-10 object-contain mr-3"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                        {document.tipo_documento || `Documento ${index + 1}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Clic para ver
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
                                <button
                                    onClick={cerrarModal}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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