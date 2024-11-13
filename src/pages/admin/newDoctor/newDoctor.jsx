import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
import { API_URL } from '../../../../config.js';
import Swal from 'sweetalert2';
import './newDoctor.css';


//console.log(API_URL);

const NewDoctor = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]); // Estado para almacenar los datos obtenidos de la API
    const [error, setError] = useState(null); // Estado para manejar errores
    const [isLoading, setIsLoading] = useState(true); // Estado para el spinner de carga

    // Estados para cada campo del formulario
    const [formData, setFormData] = useState({
      rut: '',
      contrasena: '',
      correoElectronico: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      numeroCelular: '',
      especialidades: []
    });

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/doctors/specialities`);
        console.log(response.data);
  
        // Filtrar y mapear solo las especialidades necesarias
        const filteredData = response.data.map((speciality) => ({
          id: speciality.id,
          name: speciality.nom, // Suponiendo que el nombre de la especialidad está en 'nom'
        }));
        setData(filteredData); // Actualizar el estado con las especialidades
        setIsLoading(false); // Finaliza la carga
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
        setIsLoading(false); // Finaliza la carga
      }
    };

    const getYesterday = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1); // Establecer la fecha de ayer
      return date.toISOString().split("T")[0]; // Retornar en formato YYYY-MM-DD
    };

    // Función para manejar el cambio de los campos del formulario
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSpecialityChange = (e) => {
      const { value, checked } = e.target;
      const specialityId = parseInt(value); // Convertir a número si es necesario
    
      const updatedSpecialities = checked
        ? [...formData.especialidades, specialityId] // Agregar ID si está marcado
        : formData.especialidades.filter((id) => id !== specialityId); // Eliminar ID si está desmarcado
    
      setFormData({
        ...formData,
        especialidades: updatedSpecialities,
      });
    };

    const handleRutChange = async (e) => {
      const { value } = e.target;
    
      // Asegúrate de que el valor del RUT solo contenga números y el guion
      const cleanValue = value
        .replace(/[^0-9kK-]/g, '') // Solo permite números, k, K y el guion
        .toUpperCase(); // Convertir todo a mayúsculas
    
      // Evitar perder el valor del RUT, manteniendo el guion
      setFormData((prevState) => ({
        ...prevState,
        rut: cleanValue, // Asigna el RUT limpio con el guion
      }));
    
      if (cleanValue.length === 10) {
        try {
          const response = await axios.post(`${API_URL}/user/data`, {
            rut: cleanValue,  // Rut enviado en el cuerpo de la solicitud
          }, {
            headers: {
              'Content-Type': 'application/json', // Asegúrate de que el tipo de contenido es JSON
            }
          });
    
          const dataJason = response.data;
    
          // Log del contenido recibido
          console.log(dataJason);
    
          if (dataJason.status === 'success') {
            console.log("paso");
    
            // Función para convertir la fecha al formato yyyy-MM-dd
            const convertDateFormat = (date) => {
              const [day, month, year] = date.split('-');
              return `${year}-${month}-${day}`;
            };
    
            const formattedFechaNacimiento = convertDateFormat(dataJason.data.date_of_birth);
    
            console.log(formattedFechaNacimiento);
    
            setFormData({
              ...formData,
              rut:cleanValue,
              nombre: dataJason.data.name,
              apellidoPaterno: dataJason.data.father_lastname,
              apellidoMaterno: dataJason.data.mother_lastname,
              fechaNacimiento: formattedFechaNacimiento,  // Formato de la fecha
              edad: dataJason.data.age,  // Asumí que esto es la edad
              estadoCivil: dataJason.data.marital_status,
            });
          }
        } catch (error) {
          setError('Error fetching data');
          console.error('Error fetching user data:', error.response?.data || error.message);
        }
      }
    };

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
    
      // Validación del campo Rut
      if (!formData.rut || formData.rut.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Rut es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.rut.length > 12) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Rut no puede tener más de 12 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del campo Contraseña
      if (!formData.contrasena || formData.contrasena.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Contraseña es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.contrasena.length > 20) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La Contraseña no puede tener más de 20 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del Correo Electrónico
      if (!formData.correoElectronico || formData.correoElectronico.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Correo Electrónico es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (!validateEmail(formData.correoElectronico)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Correo Electrónico no es válido.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del campo Nombre
      if (!formData.nombre || formData.nombre.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Nombre es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.nombre.length > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Nombre no puede tener más de 50 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del campo Apellido Paterno
      if (!formData.apellidoPaterno || formData.apellidoPaterno.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Apellido Paterno es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.apellidoPaterno.length > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Apellido Paterno no puede tener más de 50 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del campo Apellido Materno
      if (!formData.apellidoMaterno || formData.apellidoMaterno.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Apellido Materno es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.apellidoMaterno.length > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Apellido Materno no puede tener más de 50 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación de la Fecha de Nacimiento
      if (!formData.fechaNacimiento) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La Fecha de Nacimiento es obligatoria.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del Número de Celular
      if (!formData.numeroCelular || formData.numeroCelular.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Número de Celular es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.numeroCelular.length > 15) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Número de Celular no puede tener más de 15 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación de las Especialidades
      if (formData.especialidades.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debe seleccionar al menos una especialidad.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Si no hay errores, mostramos los datos en la consola
      console.log(formData); // Mostrar los datos en la consola para probar

      const dataToSend = {
        rut: formData.rut,
        email: formData.correoElectronico,
        password: formData.contrasena,
        name: formData.nombre,
        patSurName: formData.apellidoPaterno,
        matSurName: formData.apellidoMaterno,
        genre: "", 
        dateBirth: formData.fechaNacimiento,
        cellphone: formData.numeroCelular,
        specialities: formData.especialidades, // Array de especialidades
      };

      axios.post(`${API_URL}/doctors`, dataToSend)
      .then((response) => {
        // Aquí puedes manejar la respuesta del servidor
        console.log('Respuesta del servidor:', response);
        Swal.fire({
          icon: 'success',
          title: 'Doctor añadido',
          text: 'Se ha creado un doctor con éxito.',
        }).then(() => {       
          navigate('/adminManagment');  
        });
      })
      .catch((error) => {
        // Aquí puedes manejar errores
        console.error('Error al enviar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema con los datos.',
        });
      });
      
    };


    return (
      <>
        <div className="flex bg-gradient-to-br from-teal-100 to-teal-150">
          <Sidebar />
  
          <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
            <h2 className="text-2xl font-semibold mb-6">Añadir doctor</h2>
  
            <form className="bg-white p-6 rounded-lg shadow-md space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rut</label>
                  <input
                    type="text"
                    name="rut"
                    id="rut"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Rut"
                    value={formData.rut}
                    onChange={handleRutChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                  <input
                    type="password"
                    name="contrasena"
                    id="contrasena"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Contraseña"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  name="correoElectronico"
                  id="correoElectronico"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Correo Electrónico"
                  value={formData.correoElectronico}
                  onChange={handleInputChange}
                />
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                  <input
                    type="text"
                    name="apellidoPaterno"
                    id="apellidoPaterno"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Apellido Paterno"
                    value={formData.apellidoPaterno}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido Materno</label>
                  <input
                    type="text"
                    name="apellidoMaterno"
                    id="apellidoMaterno"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Apellido Materno"
                    value={formData.apellidoMaterno}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Fecha de Nacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    max={getYesterday()}
                  />
                </div>
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Celular</label>
                <input
                  type="tel"
                  name="numeroCelular"
                  id="numeroCelular"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Número de Celular"
                  value={formData.numeroCelular}
                  onChange={handleInputChange}
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700">Especialidades</label>
                <div className="checkbox-container">
                {/* Spinner de carga */}
                {isLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  // Muestra las especialidades solo cuando ya no esté cargando
                  data.map((speciality) => (
                    <div key={speciality.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={speciality.id}
                        name="especialidades"
                        value={speciality.id} // Aquí usamos el ID en lugar del nombre
                        className="checkbox-input"
                        onChange={handleSpecialityChange}
                      />
                      <label htmlFor={speciality.id} className="checkbox-label">
                        {speciality.name}
                      </label>
                    </div>
                  ))
                )}
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
  
              <div className="flex justify-center lg:justify-end">
                <button
                  type="button"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
                 onClick={handleSubmit}>
                  Añadir Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  
      
};

export default NewDoctor;


  

