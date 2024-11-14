import React, { useState } from 'react';
import Navbar from '../../../components/navbar/navbar.jsx';
import loginImg from '../../../images/login/centromedico.jpg';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../config.js';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    email:'',
    apellidoPaterno: '',
    apellidoMaterno: '',
    genero: '',
    rut: '',
    numDoc: '',
    telefono: '',
    fechaNacimiento: '',
    clave: '',
    confirmarClave: ''
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateRut = async (rut,numDoc) => {
    try {
      const response = await fetch(`${API_URL}/user/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rut: rut,
          numDoc: numDoc
        })
      });

      const data = await response.json();
      return response.ok && data.data.value === "1";
    } catch (error) {
      console.error('Error validating RUT', error);
      return false;
    }
  };

  const fetchUserData = async (rut) => {
    try {
      const response = await axios.post(`${API_URL}/user/data`, {
        rut
      });
      
      if (response.data.status === "success") {
        // Separar nombres (asumiendo que vienen como "PRIMER_NOMBRE SEGUNDO_NOMBRE")
        const nombres = response.data.data.name.trim();
        
        // Convertir fecha de nacimiento de DD-MM-YYYY a YYYY-MM-DD para el input date
        const [day, month, year] = response.data.data.date_of_birth.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        setFormData(prev => ({
          ...prev,
          nombres: nombres,
          apellidoPaterno: response.data.data.father_lastname,
          apellidoMaterno: response.data.data.mother_lastname,
          genero: response.data.data.gender.toLowerCase(),
          fechaNacimiento: formattedDate,
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response) {

        console.error('Response error:', error.response.data);
      } else if (error.request) {

        console.error('Request error:', error.request);
      } else {

        console.error('Error:', error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Si el campo es RUT y tiene un formato válido, buscar los datos
    if (name === 'rut' && value.length >= 9) {
      fetchUserData(value);
    }
  };

  const validateGenero = (genero) => {
    const validGeneros = ['masculino', 'femenino'];
    return validGeneros.includes(genero.toLowerCase());
  };

  const validate = () => {
    let tempErrors = {};
  
    if (!formData.nombres) tempErrors.nombres = 'Nombres es requerido';
    if (formData.nombres.length > 50) tempErrors.nombres = 'Nombres no puede tener más de 50 caracteres';
    
    if (!formData.apellidoPaterno) tempErrors.apellidoPaterno = 'Apellido Paterno es requerido';
    if (formData.apellidoPaterno.length > 50) tempErrors.apellidoPaterno = 'Apellido Paterno no puede tener más de 50 caracteres';
    
    if (!formData.apellidoMaterno) tempErrors.apellidoMaterno = 'Apellido Materno es requerido';
    if (formData.apellidoMaterno.length > 50) tempErrors.apellidoMaterno = 'Apellido Materno no puede tener más de 50 caracteres';
    
    if (!validateGenero(formData.genero)) {
      tempErrors.genero = 'El género debe ser "masculino" o "femenino"';
    }
    
    if (!formData.rut) tempErrors.rut = 'Rut es requerido';
    if (formData.rut.length > 12) tempErrors.rut = 'Rut no puede tener más de 12 caracteres';
    
    if (!formData.numDoc) tempErrors.numDoc = 'Número de Documento es requerido';
    
    if (!formData.telefono) tempErrors.telefono = 'Telefono es requerido';
    if (formData.telefono.length > 15) tempErrors.telefono = 'Telefono no puede tener más de 15 caracteres';
    
    if (!formData.fechaNacimiento) tempErrors.fechaNacimiento = 'Fecha de Nacimiento es requerido';
    
    if (!formData.email) tempErrors.email = 'Email es requerido';
    if (!validateEmail(formData.email)) tempErrors.email = 'Email no es válido';
    
    if (!formData.clave) tempErrors.clave = 'Clave es requerido';
    if (formData.clave.length > 20) tempErrors.clave = 'Clave no puede tener más de 20 caracteres';
    
    if (formData.clave !== formData.confirmarClave) tempErrors.confirmarClave = 'Las claves no coinciden';
  
    return tempErrors;
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const isRutValid = await validateRut(formData.rut, formData.numDoc);
      if (!isRutValid) {
        setErrors({ ...validationErrors, rut: 'RUT no es válido' });
        return;
      }
      try {
        const response = await axios.post(`${API_URL}/patients`, {
          rut: formData.rut,
          email: formData.email,
          password: formData.clave,
          name: formData.nombres,
          patSurName: formData.apellidoPaterno,
          matSurName: formData.apellidoMaterno,
          genre: formData.genero,
          dateBirth: formData.fechaNacimiento,
          cellphone: formData.telefono
        });

        if (response.data) {
          console.log('Form submitted successfully', response.data);
          localStorage.setItem('token', response.data.token);
          Swal.fire({
            title: 'Registro exitoso',
            text: 'El usuario ha sido registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/');
          });
        }
      } catch (error) {
        if (error.response && error.response.data.data?.error_code === 'DUPLICATE_KEY') {
          setErrors({ ...validationErrors, rut: 'RUT ya está registrado' });
        } else {
          console.error('Error submitting form:', error);
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };



  return (
    <>
    <Navbar/>
    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
  <div className='hidden sm:block'>
    <img className='w-full h-full object-cover  mt-10' src={loginImg} alt="" />
  </div>

  <div className='bg-gray-100 flex flex-col justify-center h-full mt-10'>
  <form className='bg-white p-6 rounded-lg shadow-lg max-w-[500px] mx-auto' onSubmit={handleSubmit}>
    <p className='text-4xl font-bold text-center py-6'>Registrarse</p>

    <div className='grid grid-cols-2 gap-4'>
      <div>
        <label className="font-medium">Rut</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="text" 
          name='rut' 
          value={formData.rut} 
          onChange={(e) => {
            handleChange(e);
            if (e.target.value === '') {
              setFormData({
                ...formData,
                nombres: '',
                apellidoPaterno: '',
                apellidoMaterno: '',
                genero: '',
                fechaNacimiento: ''
              });
            }
          }}
          placeholder="Ingrese RUT para autocompletar"
        />
        {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}
      </div>

      <div>
        <label className="font-medium">Número de Documento</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="number" 
          name='numDoc' 
          value={formData.numDoc} 
          onChange={handleChange} 
        />
        {errors.numDoc && <p className="text-red-500 text-sm mt-1">{errors.numDoc}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Nombres</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="text" 
          name='nombres' 
          value={formData.nombres} 
          onChange={handleChange}
        />
        {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Apellido Paterno</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="text" 
          name='apellidoPaterno' 
          value={formData.apellidoPaterno} 
          onChange={handleChange}
        />
        {errors.apellidoPaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoPaterno}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Apellido Materno</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="text" 
          name='apellidoMaterno' 
          value={formData.apellidoMaterno} 
          onChange={handleChange}
        />
        {errors.apellidoMaterno && <p className="text-red-500 text-sm mt-1">{errors.apellidoMaterno}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Género</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="text" 
          name='genero' 
          value={formData.genero} 
          onChange={handleChange}
        />
        {errors.genero && <p className="text-red-500 text-sm mt-1">{errors.genero}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Fecha de Nacimiento</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="date" 
          name='fechaNacimiento' 
          value={formData.fechaNacimiento} 
          onChange={handleChange}
        />
        {errors.fechaNacimiento && <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Correo Electrónico</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="email" 
          name='email' 
          value={formData.email} 
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Teléfono</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="number" 
          name='telefono' 
          value={formData.telefono} 
          onChange={handleChange}
        />
        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Clave</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="password" 
          name='clave' 
          value={formData.clave} 
          onChange={handleChange}
        />
        {errors.clave && <p className="text-red-500 text-sm mt-1">{errors.clave}</p>}
      </div>

      <div>
        <label className="font-medium mb-1">Confirmar Clave</label>
        <input 
          className='border p-2 rounded focus:outline-none focus:border-green-300' 
          type="password" 
          name='confirmarClave' 
          value={formData.confirmarClave} 
          onChange={handleChange}
        />
        {errors.confirmarClave && <p className="text-red-500 text-sm mt-1">{errors.confirmarClave}</p>}
      </div>
    </div>

    <button className='border w-full my-5 py-2 bg-green-300 hover:bg-green-200 text-white rounded font-medium transition duration-200' type='submit'>
      Continuar
    </button>
  </form>
</div>
</div>
  </>
  );
};
 
export default Register;