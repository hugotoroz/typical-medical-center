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
import { format } from 'date-fns';
import ClearButton from '../../../components/button/clearFilter.jsx'

const Schedule = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState();
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSpecialties();
    fetchDoctors();
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

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(`${API_URL}/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchAppointments = async (filters = {}) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters based on the provided object
      if (filters.speciality) queryParams.append('speciality', filters.speciality);
      if (filters.doctor) queryParams.append('doctor', filters.doctor);
      if (filters.date) {
        // Ensure date is in the correct format (YYYY-MM-DD)
        const formattedDate = new Date(filters.date).toISOString().split('T')[0];
        queryParams.append('date', formattedDate);
      }
  
      // Construct the URL with optional query parameters
      const url = `${API_URL}/appointments/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log("Appointments filtered:", response.data);
      setAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching filtered appointments:", error);
      setAppointments([]);
    }finally {
      setIsLoading(false);
    }
  };

  const handleSpecialtyChange = async (e) => {
    const newSpecialty = e.target.value;
    setSelectedSpecialty(newSpecialty);
    await fetchAppointments({
      speciality: newSpecialty || undefined,
      doctor: selectedDoctor || undefined,
      date: selectedDate || undefined
    });
  };

  const handleDoctorChange = async (e) => {
    const newDoctor = e.target.value;
    setSelectedDoctor(newDoctor);
    await fetchAppointments({
      speciality: selectedSpecialty || undefined,
      doctor: newDoctor || undefined,
      date: selectedDate || undefined
    });
  };
  
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    await fetchAppointments({
      speciality: selectedSpecialty || undefined,
      doctor: selectedDoctor || undefined,
      date: newDate || undefined
    });
  };

  const handleAppointmentBooking = async (availabilityId) => {
    try {
      const token = localStorage.getItem('token');
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


  const handleClearFilters = (e) => {
    e.preventDefault();
    setSelectedSpecialty('');
    setSelectedDoctor('');
    setSelectedDate('');
    setAppointments([]);
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
        <form action="" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-3 gap-6 mb-10">
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
          <div className="mb-10">
            <label htmlFor="doctor-select" className="block text-sm font-medium text-gray-700">
              Selecciona Doctor
            </label>
            <select
              id="doctor-select"
              value={selectedDoctor}
              onChange={handleDoctorChange}
              className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
            >
              <option value="">Selecciona un doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-10">
          <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">
            Selecciona Fecha
          </label>
          <input
            type="date"
            id="date-select"
            value={selectedDate}
            onChange={handleDateChange}
            className="block w-full text-sm h-[50px] px-4 text-slate-900 bg-white rounded-[8px] border border-violet-200 focus:outline focus:outline-2 focus:outline-primary focus:ring-0"
          />
        </div>
        
        </div>
        <ClearButton type="button" onClick={handleClearFilters} text="Limpiar Filtros" />
      </form>




        </div>

  <div className="container mx-auto flex-grow px-4 mt-10 mb-10 relative">
  {isLoading ? (
    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
    </div>
  ) : null}

  <div className="overflow-x-auto">
    <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Especialidad</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Fecha Cita</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Horario de inicio</th>
          <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Nombre doctor</th>
          <th className="px-4 py-2 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Reservar</th>
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
                {new Date(appointment.fecha).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                {appointment.hora_inicio.slice(0, 5)}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                {appointment.nombre_doctor}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-sm text-center">
                <button 
                  onClick={() => confirmAppointmentBooking(appointment.id_disponibilidad)} 
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Reservar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-4 py-3 border-b border-gray-200 text-sm text-center">
              No hay citas disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      </div>



      <Footer />
      

    </>
  );
};



export default Schedule;
