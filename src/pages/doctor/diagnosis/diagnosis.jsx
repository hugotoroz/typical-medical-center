import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import {
    FiEdit,
    FiChevronDown,
    FiTrash,
    FiShare,
    FiPlusSquare,
  } from "react-icons/fi";
import { API_URL } from '../../../../config.js'; //VARIABLE DE ENTORNO
import './diagnosis.css';

const Diagnosis = () => {
    const [openId, setOpenId] = useState(null); // State to store user ID open
    const [data, setData] = useState([]); // Estado para almacenar los datos obtenidos de la API
    const [error, setError] = useState(null); // Estado para manejar errores

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchData();
      }, []);

      const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/appointments/doctor`, {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los headers
                }
            });
          
            // Log de la respuesta para inspección
            console.log('API response:', response.data);
    
            const data = response.data.data;
    
            if (Array.isArray(data) && data.length > 0) {
                // Si es un array con datos, filtramos y mapeamos
                const filteredData = data.map((appointment) => ({
                    especialidad: appointment.nombre_especialidad,  // Especialidad
                    fecha: new Date(appointment.fecha).toLocaleDateString(),  // Fecha en formato de cadena
                    horario: `${appointment.hora_inicio} - ${appointment.hora_fin}`,  // Hora inicio y fin combinadas
                    estado: appointment.estado,  // Estado de la cita
                    pacienteId: appointment.id_paciente
                }));
                setData(filteredData); // Actualizar el estado con los datos filtrados
            } else {
                setData([]); // Asegúrate de limpiar cualquier dato previo
                setError('No hay citas médicas actuales.');
                console.warn('No hay citas médicas actuales.');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Manejar específicamente el error 404
                setData([]);
                setError('No hay citas médicas actuales.'); // Mensaje para cuando no haya citas
            } else {
                setError('Error buscando la data'); // Manejar otros errores
                console.error('Error fetching data:', error);
            }
        }
    };
    
    

return (
    <>
    <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
        <Sidebar />

        <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
          <h2 className="text-2xl font-semibold mb-6">Diagnostico</h2>
          

        </div>

    </div>
    
    </>
);
};

const Option = ({ text, Icon, setOpen, idPaciente }) => {
  const navigate = useNavigate();

  const handleOptionClick = async (action) => { 
      if (action === "Diagnosticar") {
        navigate(`/diagnosis/${idPaciente}`);
      }
    };

    return (
      <motion.li
        variants={itemVariants}
        //onClick={() => setOpen(null)} // Close the menu when clicking an option
        onClick={() => handleOptionClick(text)}
        className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
      >
        <motion.span variants={actionIconVariants}>
          <Icon />
        </motion.span>
        <span>{text}</span>
      </motion.li>
    );
  };

export default Diagnosis;

// Variants for animations
const wrapperVariants = {
    open: {
      scaleY: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    closed: {
      scaleY: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
      },
    },
  };
  
  const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };
  
  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
      },
    },
    closed: {
      opacity: 0,
      y: -15,
      transition: {
        when: "afterChildren",
      },
    },
  };
  
  const actionIconVariants = {
    open: { scale: 1, y: 0 },
    closed: { scale: 0, y: -7 },
  };
  

