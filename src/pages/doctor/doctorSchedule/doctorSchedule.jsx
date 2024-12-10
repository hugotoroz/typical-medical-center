import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
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
import './doctorSchedule.css';

const Schedule = () => {

  const [specialitiesTypes, setSpecialitiesTypes] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [scheduleSlots, setScheduleSlots] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '17:00',
    speciality: '',
    weekdays: true,
    saturdays: true,
    sundays: true
  });

  const specialties = [
    { id: 1, name: 'General Medicine' },
    { id: 2, name: 'Pediatrics' },
    { id: 3, name: 'Cardiology' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submission logic here
  };

  /////buscar items del select

  useEffect(() => {
      const fetchSpecialitiesTypes = async () => {
          try {
              console.log("entra");
              // Aquí llamamos a la API
              const response = await axios.get(`${API_URL}/doctors/Myspecialities`, {
                  headers: {
                      Authorization: `Bearer ${token}` // Enviar el token en los headers
                  }
              });

              // Log de la respuesta para inspección
              console.log('API response:', response.data);

              // Asumiendo que el formato de la respuesta es como el JSON original
              const data = response.data;

              // Actualizamos el estado con los datos obtenidos
              setSpecialitiesTypes(data); // Suponiendo que la respuesta tenga el mismo formato
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      // Llamamos a la función fetchDocumentTypes
      fetchSpecialitiesTypes();
  }, []); // El efecto se ejecuta solo una vez cuando el componente se monta

  const generarHorario = async () => {
    console.log('Botón clickeado');// Asegúrate de que esto se imprima en la consola

    console.log("sdadasd", formData);

    if(formData.speciality == ""){
      Swal.fire({
        title: 'Error',
        text: 'Debe de seleccionar la especialidad del horario',
        icon: 'error', // Icono de éxito
        confirmButtonText: 'Aceptar',
      });
      
    }else{
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${API_URL}/appointments/doctor/generate`, 
          formData, // Aquí pasamos el objeto completo
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        console.log('Respuesta de la API:', response.data.data);
  
        setScheduleSlots(response.data.data);
        setIsModalOpen(true);
        // Maneja la respuesta según sea necesario
      } catch (error) {
        console.error('Error al enviar los datos:', error.response || error.message);
        // Maneja el error según sea necesario
      } finally {
        setIsLoading(false);  // Set loading to false after API call
      }
    }

  };

  const crearHorario = async () => {
    console.log(scheduleSlots);
    console.log(formData.speciality);
    try {
      // Realiza la solicitud POST con los datos de los horarios y la especialidad
      const response = await axios.post(
        `${API_URL}/appointments/doctor/create`,
        {
          appointments: scheduleSlots, // Los slots de los horarios
          speciality: formData.speciality, // El ID de la especialidad seleccionada
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // El token de autorización
          },
        }
      );
  
      // Mostrar un mensaje de éxito con SweetAlert2
      Swal.fire({
        title: '¡Éxito!',
        text: 'El horario ha sido creado correctamente.',
        icon: 'success', // Icono de éxito
        confirmButtonText: 'Aceptar',
      });
      
      // Aquí puedes agregar cualquier lógica adicional, como resetear el formulario o cerrar el modal
      setIsModalOpen(false); // Cierra el modal si lo deseas
  
    } catch (error) {
      console.error("Error al crear horario:", error);
  
      // Mostrar un mensaje de error si la solicitud falla
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un problema al crear el horario. Inténtalo de nuevo.',
        icon: 'error', // Icono de error
        confirmButtonText: 'Aceptar',
      });
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            HORARIO MEDICO
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Hora Termino
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Especialidad
              </label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="" disabled>
                    Seleccione la especialidad
                </option>
                {specialitiesTypes.map((espType) => (
                    <option key={espType.id} value={espType.id} data-name={espType.nom}>
                        {espType.nom}
                    </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {[
                { name: 'weekdays', label: 'Disponible en dias de semana' },
                { name: 'saturdays', label: 'Disponible en Sabados' },
                { name: 'sundays', label: 'Disponible en Domingos' }
              ].map(({ name, label }) => (
                <div key={name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>
            <OnClickButton
              text={isLoading ? "Generando..." : "Generar Horario"}
              func={generarHorario}
              disabled={isLoading}
            />
          </form>
        </div>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div
      className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden"
      style={{ maxHeight: '80vh' }}
    >
      {/* Contenido del Modal */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 4rem)' }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Horario Generado</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-teal-50">
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Hora Inicio</th>
                <th className="border p-3 text-left text-sm font-semibold text-gray-700">Hora termino</th>
              </tr>
            </thead>
            <tbody>
            {Object.entries(scheduleSlots).length === 0 ? (
              // Si no hay slots, mostrar un mensaje
              <tr>
                <td colSpan="3" className="border p-3 text-sm text-center text-gray-600">
                  No hay citas generadas.
                </td>
              </tr>
            ) : (
              // Si hay slots, mostrar la lista de citas
              Object.entries(scheduleSlots).map(([key, slot]) => (
                <tr key={key} className="hover:bg-teal-100 transition-colors">
                  <td className="border p-3 text-sm text-gray-600">
                    {new Date(slot.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                  </td>
                  <td className="border p-3 text-sm text-gray-600">{slot.starttime}</td>
                  <td className="border p-3 text-sm text-gray-600">{slot.endtime}</td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Fijo */}
      <div className="p-4 bg-gray-100 border-t space-x-4">
        <LogOutButton text="Cancelar horario" onClick={() => setIsModalOpen(false)}></LogOutButton>
        {Object.entries(scheduleSlots).length > 0 && (
          <OnClickButton text="Aceptar horario" func={crearHorario}></OnClickButton>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

const Option = ({ text, Icon, setOpen, idCita, idPaciente }) => {
  const navigate = useNavigate();

  const handleOptionClick = async (action) => { 
      if (action === "Diagnosticar" && idCita && idPaciente) {
        localStorage.setItem("idCita", idCita);
        localStorage.setItem("idPaciente", idPaciente);
        navigate(`/doctor/diagnosis`);
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

export default Schedule;

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
  

