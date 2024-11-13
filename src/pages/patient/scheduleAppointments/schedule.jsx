import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar.jsx';
import Footer from '../../../components/footer/footer.jsx';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import Imagen from "../../../images/appointment/medicine.jpg";
import { API_URL } from '../../../../config.js';
import Swal from 'sweetalert2';
import './schedule.css'; // Importamos los estilos CSS

const Schedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState();
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {

      const response = await axios.get(`${API_URL}/doctors/specialities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchAppointments = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/search?speciality=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleAppointmentBooking = async (availabilityId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${API_URL}/appointments/patient/create`, {
        availabilityId: availabilityId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: 'Cita agendada exitosamente',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/');
      });
      console.log('Appointment booked:', response.data);
    } catch (error) {
      console.error('Error booking appointment:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al agendar la cita',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = specialties.filter((specialty) =>
        specialty.nom.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    } else {
      setFilteredSpecialties(specialties);
    }
  };

  const handleSpecialtySelect = (specialty) => {
    setSearchTerm(specialty.nom);
    setSelectedSpecialty(specialty.id);
    setFilteredSpecialties([]);
    fetchAppointments(specialty.id);
  };

  const handleFocus = () => {
    setFilteredSpecialties(specialties);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setFilteredSpecialties([]);
    }, 100);
  };

  const handleSpecialtyChange = (event) => {
    const specialtyId = event.target.value;
    setSelectedSpecialty(specialtyId);
    if (specialtyId) {
      fetchAppointments(specialtyId);
    } else {
      setAppointments([]);
    }
  };

  const confirmAppointmentBooking = (availabilityId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas confirmar esta cita?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleAppointmentBooking(availabilityId);
      }
    });
  };

  return (
    <>
      <Navbar />

      <p>Reserva tu hora</p>


      <div className="min-h-[80vh] flex flex-col items-center justify-center mt-20">
        <h1 className="text-center mb-6 tamanoTitulo"><FaCalendarAlt className='inline-block mr-2' /> Reserva tu hora</h1>
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <div className="flex flex-wrap gap-5 items-center w-full max-md:max-w-full mb-10">
            <div className="flex flex-wrap flex-1 shrink gap-5 items-center self-stretch my-auto basis-0 min-w-[240px] max-md:max-w-full">
              <div className="flex relative flex-col justify-center self-stretch bg-gray-100 h-[70px] min-h-[70px] rounded-[16px] overflow-hidden w-[70px]">
                <div className="w-[100px] h-[100px] aspect-auto flex items-center justify-center">
                  <svg
                    fill="none"
                    viewBox="0 0 100 100"
                  >
                    <image
                      href={Imagen}
                      height="100"
                      width="100"
                    />

                  </svg>
                </div>
              </div>
            </div>
          </div>
          <form action="">
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="mb-10">
                <label htmlFor="specialty-select" className="block text-sm font-medium text-gray-700">
                  Selecciona Especialidad
                </label>
                <select
                  id="specialty-select"
                  value={selectedSpecialty}
                  onChange={handleSpecialtyChange}
                  className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
                >
                  <option value="">Selecciona una especialidad</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:flex sm:flex-row-reverse flex gap-4">
              <button
                className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-violet-500 hover:bg-violet-600 focus:bg-violet-700 border-violet-500-violet- text-white focus:ring-4 focus:ring-violet-200 hover:ring-4 hover:ring-violet-100 transition-all duration-300"
                type="button"
              >
                <div className="flex gap-2 items-center">Reservar Hora</div>
              </button>
              <button
                className="w-fit rounded-lg text-sm px-5 py-2 focus:outline-none h-[50px] border bg-transparent border-primary text-primary focus:ring-4 focus:ring-gray-100"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </form>




        </div>

        <div className="container mx-auto flex-grow px-4 mt-10">
          {console.log("Datos de citas:", appointments)}
          <div className="flex justify-center"></div>
          <div className="overflow-x-auto">
            <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Especialidad</th>
                  <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Fecha Cita</th>
                  <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Horario de inicio</th>
                  <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Nombre doctor</th>
                  <th className="px-4 py-2 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                        {appointment.nombre_especialidad}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                      {format(new Date(appointment.fecha), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                        {appointment.hora_inicio}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                        {appointment.nombre_doctor}
                      </td>
                      <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                        <button onClick={() => confirmAppointmentBooking(appointment.id_disponibilidad)} className="bg-blue-500 text-white px-2 py-1 rounded">Reservar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 border-b border-gray-200 text-sm text-center">No hay citas disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>



      <Footer />
      <Chatbot />

    </>
  );
};



export default Schedule;
