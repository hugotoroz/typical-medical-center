import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
import { User, Mail, Phone, Calendar, CreditCard, FileText } from "lucide-react";
import { motion } from "framer-motion";
import OnClickButton from '../../../components/button/onClickButton.jsx';
import LogOutButton from '../../../components/button/logOutButton.jsx';
import Swal from 'sweetalert2';
import {
    FiEdit,
    FiChevronDown,
    FiTrash,
    FiShare,
    FiPlusSquare,
  } from "react-icons/fi";
import { API_URL } from '../../../../config.js'; //VARIABLE DE ENTORNO
import './doctorProfile.css';

const DoctorProfile = () => {

    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [patSurName, setPatSurName] = useState('');
    const [matSurName, setMatSurName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [cellphone, setCellphone] = useState('');

    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        console.log("tokeeen: ",token);
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
                        <ProfileSection icon={Mail} label="Correo Electrónico" value={email} />
                        <ProfileSection icon={Phone} label="Teléfono" value={cellphone} />
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
    </div>
    </>
  );
};



export default DoctorProfile;



