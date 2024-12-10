import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar } from '../../../components/sidebar/sidebar.jsx';
import { Mail, Phone, Calendar, CreditCard } from "lucide-react";
import Swal from 'sweetalert2';
import { API_URL } from '../../../../config.js';
import './doctorProfile.css';

const DoctorProfile = () => {
    // Estados originales
    const [rut, setRut] = useState('');
    const [userName, setUserName] = useState('');
    const [patSurName, setPatSurName] = useState('');
    const [matSurName, setMatSurName] = useState('');
    const [dateBirth, setDateBirth] = useState('');

    // Estados para edición
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalCellphone, setOriginalCellphone] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedCellphone, setEditedCellphone] = useState('');

    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserName(decodedToken.fullName);
            setRut(decodedToken.rut);
            setPatSurName(decodedToken.patSurName);
            setMatSurName(decodedToken.matSurName);
            setDateBirth(decodedToken.dateBirth);

            // Guardar los datos originales
            setOriginalEmail(decodedToken.email);
            setOriginalCellphone(decodedToken.cellphone);

            // Inicializar los datos editados con los originales
            setEditedEmail(decodedToken.email);
            setEditedCellphone(decodedToken.cellphone);
        }
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
      };

    const handleSave = async (e) => {
        e.preventDefault();

        // Verificar si hay cambios
        if (editedEmail === originalEmail && editedCellphone === originalCellphone) {
            Swal.fire({
                icon: 'info',
                title: 'Sin cambios',
                text: 'No se detectaron modificaciones en los datos.'
            });
            //setShowModal(false);
            return;
        }

        try {
            if (!editedEmail || editedEmail.trim() === '') {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'El campo Correo Electrónico es obligatorio.',
                });
                //setIsSubmitting(false);
                return; // Evitamos que el formulario se envíe si hay error
              } else if (!validateEmail(editedEmail)) {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'El Correo Electrónico no es válido.',
                });
                //setIsSubmitting(false);
                return; // Evitamos que el formulario se envíe si hay error
              }

            // Validación del Número de Celular
            if (!editedCellphone || String(editedCellphone).trim() === '') {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo Número de Celular es obligatorio.',
                });
                //setShowModal(false);
                return; // Evitamos que el formulario se envíe si hay error
            } else if (!/^9\d{8}$/.test(editedCellphone)) {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El Número de Celular debe comenzar con 9 y tener exactamente 9 dígitos.',
                });
                //setShowModal(false);
                return;
            }

            const response = await axios.put(
                `${API_URL}/user/update`,
                { 
                    email: editedEmail, 
                    cellphone: editedCellphone 
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.data.status === "success") {
                // Actualizar token en localStorage
                localStorage.setItem("token", response.data.data.token);

                // Decodificar nuevo token para actualizar datos
                const decodedToken = jwtDecode(response.data.data.token);

                // Actualizar datos originales
                setOriginalEmail(decodedToken.email);
                setOriginalCellphone(decodedToken.cellphone);

                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario actualizado exitosamente!',
                    showConfirmButton: true
                });

                setShowModal(false);
            }
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            
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

    const handleCancel = () => {
        // Restaurar los datos editados a los originales
        setEditedEmail(originalEmail);
        setEditedCellphone(originalCellphone);
        setShowModal(false);
    };

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

    return (
        <>
        <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
        <Sidebar />
        <div className="max-w-7xl mx-auto p-4 mt-20">
                <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-full">
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
                                <p className="text-gray-500 text-left">Perfil de Doctor</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <ProfileSection icon={CreditCard} label="RUT" value={rut} />
                            <ProfileSection icon={Mail} label="Correo Electrónico" value={originalEmail} />
                            <ProfileSection icon={Phone} label="Teléfono" value={originalCellphone} />
                            <ProfileSection 
                                icon={Calendar} 
                                label="Fecha de Nacimiento" 
                                value={new Date(dateBirth).toLocaleDateString('es-ES', { 
                                    day: '2-digit', 
                                    month: '2-digit', 
                                    year: 'numeric', 
                                    timeZone: 'UTC' 
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
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="text"
                                        value={editedEmail}
                                        onChange={(e) => setEditedEmail(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                    Formato de correo: correo@ejemplo.com
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Numero de Celular
                                    </label>
                                    <input
                                        type="tel"
                                        value={editedCellphone}
                                        onChange={(e) => setEditedCellphone(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                    Formato de Numero: 912345678
                                    </p>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
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
        </div>
        </>
    );
};

export default DoctorProfile;