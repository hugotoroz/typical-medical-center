import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { format, parse } from "date-fns";
import {
    FiEdit,
    FiChevronDown,
    FiTrash,
    FiShare,
    FiPlusSquare,
  } from "react-icons/fi";
import { API_URL } from '../../../../config.js'; //VARIABLE DE ENTORNO
import './doctorsPage.css';

const DoctorsPage = () => {
    const [openId, setOpenId] = useState(null); // State to store user ID open
    const [data, setData] = useState([]); // Estado para almacenar los datos obtenidos de la API
    const [error, setError] = useState(null); // Estado para manejar errores
    const [isLoading, setIsLoading] = useState(true); // Estado para el spinner de carga

    // Nuevos estados para los selects
    const [specialties, setSpecialties] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);

    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchData();
        fetchStatusOptions();
        fetchSpecialties();
      }, []);

      const fetchData = async (filters = {}) => {

        //console.log(selectedTime);

        setIsLoading(true);
        try {

            console.log(filters.time);
            console.log(filters.statusId, "sdasdad");
            console.log(filters.time, "sdasdad");

            const queryParams = new URLSearchParams();
            if (filters.specialityId) queryParams.append('specialityId', filters.specialityId);
            if (filters.date) queryParams.append('date', filters.date);
            if (filters.time) queryParams.append('time', filters.time);
            if (filters.statusId) queryParams.append('statusId', filters.statusId);

            const url = `${API_URL}/appointments/doctor${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
          
            // Log de la respuesta para inspección
            console.log('API response:', response.data);
    
            const data = response.data.data;
    
            if (Array.isArray(data) && data.length > 0) {
                // Si es un array con datos, filtramos y mapeamos
                const filteredData = data.map((appointment) => ({
                    especialidad: appointment.nombre_especialidad,  // Especialidad
                    fecha: new Date(appointment.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' }),  // Fecha en formato de cadena
                    horario: `${appointment.hora_inicio} - ${appointment.hora_fin}`,  // Hora inicio y fin combinadas
                    estado: appointment.estado,  // Estado de la cita
                    pacienteId: appointment.id_paciente,
                    citaID: appointment.id_cita
                }));
                setError('');
                setData(filteredData); // Actualizar el estado con los datos filtrados
                setIsLoading(false); // Finaliza la carga
            } else {
                setData([]); // Asegúrate de limpiar cualquier dato previo
                setError('No hay citas médicas actuales.');
                console.warn('No hay citas médicas actuales.');
                setIsLoading(false); // Finaliza la carga
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Manejar específicamente el error 404
                setData([]);
                setError('No hay citas médicas actuales.'); // Mensaje para cuando no haya citas
                setIsLoading(false); // Finaliza la carga
            } else {
                setError('Error buscando la data'); // Manejar otros errores
                console.error('Error fetching data:', error);
                setIsLoading(false); // Finaliza la carga
            }
        }
    };

    ///////////////////fetchs

  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get(`${API_URL}/appointments/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data.data);
      setStatusOptions(response.data.data); // Asegúrate de que esto es un array de objetos.
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const fetchSpecialties = async () => {
    try {
        const response = await axios.get(`${API_URL}/doctors/specialities`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        setSpecialties(response.data);
    } catch (error) {
        console.error('Error fetching specialties:', error);
    }
};

///////////////////////////////////////

/////////////////////////////handles

const handleStatusChange = async (e) => {
  const newStatus = e.target.value;
  console.log(newStatus);
  setSelectedStatus(newStatus);
  await fetchData({
      statusId: newStatus || undefined,
      specialityId: selectedSpecialty || undefined,
      date: selectedDate || undefined,
      time: selectedTime || undefined,
  });
};

const handleSpecialtyChange = async (e) => {
  const newSpecialty = e.target.value;
  console.log(newSpecialty);
  setSelectedSpecialty(newSpecialty);
  await fetchData({
      statusId: selectedStatus || undefined,
      specialityId: newSpecialty || undefined,
      date: selectedDate || undefined,
      time: selectedTime || undefined,
  });
};

const handleDateChange = async (date) => {
  console.log(date);
  if (date === null) {
      setSelectedDate(null);
      console.log("Fecha borrada");
      await fetchData({
          statusId: selectedStatus || undefined,
          specialityId: selectedSpecialty || undefined,
          date: null,
          time: selectedTime || undefined,
      });
  } else {
      const newDate = format(date, "yyyy-MM-dd");
      setSelectedDate(newDate);
      console.log(newDate);
      await fetchData({
          statusId: selectedStatus || undefined,
          specialityId: selectedSpecialty || undefined,
          date: newDate || undefined,
          time: selectedTime || undefined,
      });
  }
};

const handleTimeChange = async (time) => {
  if (time === null) {
      setSelectedTime(null);
      console.log("Fecha borrada");
      await fetchData({
          statusId: selectedStatus || undefined,
          specialityId: selectedSpecialty || undefined,
          date: selectedDate || undefined,
          time: null
      });
  } else {
      const hours = time.getHours(); // Obtiene la hora
      const minutes = time.getMinutes(); // Obtiene los minutos

      // Formatea la hora a "HH:mm:ss" y ajusta medianoche
      const formattedTime = `${hours === 0 ? 12 : hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:00`;
      setSelectedTime(formattedTime);
      console.log(formattedTime);
      await fetchData({
          statusId: selectedStatus || undefined,
          specialityId: selectedSpecialty || undefined,
          date: selectedDate || undefined,
          time: formattedTime || undefined,
      });
  }
};

///////////////////////////////////////////


return (
    <>
    <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
        <Sidebar />

        <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
          <h2 className="text-2xl font-semibold mb-6">Citas medicas</h2>
          <div className="container mx-auto  flex-grow px-4">
            
          {error && <div className="flex items-center p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-300" role="alert">
              <svg
                className="w-5 h-5 mr-2 text-red-800"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 8A8 8 0 11 2 8a8 8 0 0116 0zM9 4a1 1 0 012 0v4a1 1 0 01-2 0V4zm1 8a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>} {/* Mostrar error si existe */}
            
            {isLoading ? (
              // Muestra solo el spinner mientras se cargan los datos
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
              <div className="flex flex-col items-center mb-8">
                    <div className="flex gap-4">

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

                        <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Todos los estados</option>
                          {statusOptions.map(option => (
                            <option key={option.id} value={option.id}>
                              {option.nombre}
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

                        <DatePicker
                              selected={
                                  selectedTime
                                      ? parse(selectedTime, "HH:mm:ss", new Date("1970-01-01"))
                                      : null
                              } // Convierte el estado al objeto Date
                              onChange={handleTimeChange}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={10} // Intervalos de 10 minutos
                              timeCaption="Hora"
                              dateFormat="HH:mm" // Formato visible en el input
                              className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              placeholderText="Selecciona una hora"
                              isClearable
                              timeFormat="HH:mm" // Asegura formato de 24 horas en la lista desplegable
                          />

                    </div>
                </div>
              <div className="overflow-x-auto">
                <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Especialidad</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Fecha Cita</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Horario</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Estado</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((appointment, index) => (
                      <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.especialidad}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.fecha}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">{appointment.horario}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                          {appointment.estado ? appointment.estado : 'No ha sido tomada'}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm">
                          <div className="flex items-center justify-center">
                            
                                {appointment.pacienteId && (appointment.estado !== "Completada" && appointment.estado !== "Cancelada por Doctor" && appointment.estado !== "Cancelada por Paciente") && appointment.citaID ? (
                                  <>
                                  <motion.div animate={openId === index ? "open" : "closed"} className="absolute">
                                  <button
                                    onClick={() => setOpenId(openId === index ? null : index)} // Alternate Id
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors z-10"
                                  >
                                    <span className="font-medium text-sm">Opciones</span>
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
                                        <Option
                                          setOpen={setOpenId}
                                          Icon={FiPlusSquare}
                                          text="Diagnosticar"
                                          idCita={appointment.citaID}
                                          idPaciente={appointment.pacienteId} // Pasar idPaciente
                                        />
                                        <Option setOpen={setOpenId} Icon={FiTrash} text="Eliminar cita" appointmentId={appointment.citaID} fetchData={fetchData} />
                                        </motion.ul>
                                  </motion.div>
                                  </>
                                  
                                ) : null}
                              
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </>
            )}
          </div>

        </div>

    </div>
    
    </>
);
};

const Option = ({ text, Icon, setOpen, idCita, idPaciente , appointmentId, fetchData}) => {
  const navigate = useNavigate();

  const handleOptionClick = async (action) => { 
      if (action === "Diagnosticar" && idCita && idPaciente) {
        localStorage.setItem("idCita", idCita);
        localStorage.setItem("idPaciente", idPaciente);
        navigate(`/doctor/diagnosis`);
      }else if (action === "Eliminar cita") {
        Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Está seguro de cancelar esta cita?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cancelar',
          cancelButtonText: 'Cancelar',
        }).then(async (result) => { // Cambia esta función anónima a async
          if (result.isConfirmed) {
            setOpen(null);
            try {
              const token = localStorage.getItem('token');
              // Envía el RUT al backend para desactivar el doctor
              await axios.put(`${API_URL}/doctors/cancelAppointment`, 
                { appointmentId }, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
              fetchData();
              Swal.fire('Cancelada!', 'La cita ha sido cancelada con exito.', 'success');
            } catch (error) {
              Swal.fire('Error', 'Hubo un problema al cancelar la cita.', 'error');
              console.error('Error cancelando la cita:', error);
            }
          }
        });
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
  

