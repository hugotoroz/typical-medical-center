import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../components/sidebar/sidebar.jsx';
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import {
    FiEdit,
    FiChevronDown,
    FiTrash,
    FiShare,
    FiPlusSquare,
  } from "react-icons/fi";
import { API_URL } from '../../../config.js'; //VARIABLE DE ENTORNO
import './doctorsPage.css';

const DoctorsPage = () => {
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
      
          // Verificar si response.data es un array antes de intentar mapear
          if (Array.isArray(data)) {
            // Si es un array, entonces filtramos los datos
            const filteredData = data.map((appointment) => ({
              especialidad: appointment.nombre_especialidad,  // Especialidad
              fecha: new Date(appointment.fecha).toLocaleDateString(),  // Fecha en formato de cadena
              horario: `${appointment.hora_inicio} - ${appointment.hora_fin}`,  // Hora inicio y fin combinadas
              estado: appointment.estado,  // Estado de la cita
              pacienteId: appointment.id_paciente
            }));
            setData(filteredData); // Actualizar el estado con los datos filtrados
          } else {
            // Si no es un array, se muestra un error
            setError('The response data is not an array');
            console.error('Error: response data is not an array');
          }
        } catch (error) {
          setError('Error fetching data'); // Manejar error si la API falla
          console.error('Error fetching data:', error);
        }
      };

return (
    <>
    <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
        <Sidebar />

        <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
          <h2 className="text-2xl font-semibold mb-6">Citas medicas</h2>
          <div className="container mx-auto  flex-grow px-4">
            
          {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si existe */}
            <div className="flex justify-center"></div>
            <div className="overflow-x-auto">
              <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Especialidad</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Fecha Cita</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Horario</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Estado</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.especialidad}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.fecha}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.horario}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.estado}</td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm">
                        <div className="flex items-center justify-center">
                            <motion.div animate={openId === index ? "open" : "closed"} className="absolute">
                            <button
                              onClick={() => setOpenId(openId === index ? null : index)} // Alternate Id
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors z-10"
                            >
                              <span className="font-medium text-sm">Post actions</span>
                              <motion.span variants={iconVariants}>
                                <FiChevronDown />
                              </motion.span>
                            </button>

                            <motion.ul
                              initial={wrapperVariants.closed}
                              variants={wrapperVariants}
                              style={{ originY: "top", translateX: "-50%" }}
                              className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden z-20"
                            >
                              {appointment.pacienteId ? (
                                  <Option setOpen={setOpenId} Icon={FiPlusSquare} text="Diagnosticar" idPaciente={appointment.pacienteId} />
                              ) : null}
                              <Option setOpen={setOpenId} Icon={FiShare} text="Modificar" />
                              <Option setOpen={setOpenId} Icon={FiTrash} text="Eliminar cita" />
                            </motion.ul>
                          </motion.div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

    </div>
    
    </>
);
};

const Option = ({ text, Icon, setOpen, idPaciente }) => {
  const navigate = useNavigate();

  const handleOptionClick = async (action) => { 
      if (action === "Diagnosticar") {
        navigate(`/diagnosticar/${idPaciente}`);
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

export default DoctorsPage;

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
  

