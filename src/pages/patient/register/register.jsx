import React, { useState } from 'react';
import Navbar from '../../../components/navbar/navbar.jsx';
import loginImg from '../../../images/login/centromedico.jpg';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../config.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';
import LoadingButton2 from '../../../components/button/loadingButton2.jsx';
import ClearButton from '../../../components/button/clearButton.jsx';
import '../../patient/register/register.css';

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
    clave: ''
  });

  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          genero: response.data.data.gender.toUpperCase(),
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




  const validatePassword = (password) => {
    return password.length >= 8 && 
           /(?=.*[A-Z])/.test(password) && 
           /(?=.*\d)/.test(password) && 
           /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
  
    try {

      const isRutValid = await validateRut(formData.rut, formData.numDoc);
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

      if (!formData.numDoc || formData.numDoc.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Numero de documento es obligatorio.',
        });

        return; // Evitamos que el formulario se envíe si hay error
      }

      if (!isRutValid) {
        Swal.fire({
          icon: 'error',
          title: 'Documento Inválido',
          text: 'El N° Documento no es válido',
          confirmButtonText: 'Aceptar'
        });
        setIsLoading(false);
        return;
      }

    
      // Validación del campo Contraseña
      if (!formData.clave || formData.clave.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Contraseña es obligatorio.',
        });

        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.clave.length > 20) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La Contraseña no puede tener más de 20 caracteres.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.clave) || formData.clave.length < 8) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña debe contener minimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial.',
        });
        return;
      }
    
      // Validación del Correo Electrónico
      if (!formData.email || formData.email.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Correo Electrónico es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (!validateEmail(formData.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Correo Electrónico no es válido.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      }
    
      // Validación del campo Nombre
      if (!formData.nombres || formData.nombres.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Nombre es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (formData.nombres.length > 50) {
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
      if (!formData.telefono || formData.telefono.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo Número de Celular es obligatorio.',
        });
        return; // Evitamos que el formulario se envíe si hay error
      } else if (!/^9\d{8}$/.test(formData.telefono)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El Número de Celular debe comenzar con 9 y tener exactamente 9 dígitos.',
        });
        return;
      }
    
      const response = await axios.post(`${API_URL}/patients`, {
        rut: formData.rut,
        email: formData.email,
        password: formData.clave,
        name: formData.nombres,
        patSurName: formData.apellidoPaterno,
        matSurName: formData.apellidoMaterno,
        genre: formData.genero,
        dateBirth: formData.fechaNacimiento,
        cellphone: formData.telefono,
      });
  
      localStorage.setItem('token', response.data.token);
      Swal.fire({
        title: 'Registro exitoso',
        text: 'El usuario ha sido registrado exitosamente.',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/');
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
  
      // Directly use the message from the backend response
      const errorMessage = error.response?.data?.message || 
                           'Hubo un problema con el registro. Intente nuevamente.';
    
      Swal.fire({
        title: 'Error de Registro',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
};
  



return (
  <>
    <Navbar/>

    <div className=' flex flex-col grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>

      <div className='hidden sm:block'>
        <img className='w-full h-full object-cover mt-20' src={loginImg} alt="" />
      </div>

      <div className='form-container bg-gray-100 flex flex-col justify-center h-full mt-20'>
        <form className='bg-white p-4 p-6 rounded-lg shadow-lg max-w-[490px] mx-auto' onSubmit={handleSubmit}>
          <p className='text-xl md:text-2xl font-bold text-center py-4'>Registrarse</p>


          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Rut</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="text" 
                name='rut' 
                value={formData.rut} 
                onChange={(e) => {
                  handleChange(e);
                  if (!e.target.value || e.target.value.trim() === '') {
                    setFormData(prev => ({
                      ...prev,
                      nombres: '',
                      apellidoPaterno: '',
                      apellidoMaterno: '',
                      genero: '',
                      fechaNacimiento: '',
                      rut: ''
                    }));
                    return;
                  }
                }}
                placeholder="11111111-1"
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Número de Documento</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="number" 
                name='numDoc' 
                value={formData.numDoc} 
                onChange={handleChange} 
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Nombres</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="text" 
                name='nombres' 
                value={formData.nombres} 
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Apellido Paterno</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="text" 
                name='apellidoPaterno' 
                value={formData.apellidoPaterno} 
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Apellido Materno</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="text" 
                name='apellidoMaterno' 
                value={formData.apellidoMaterno} 
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Género</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="text" 
                name='genero' 
                value={formData.genero} 
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Fecha de Nacimiento</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="date" 
                name='fechaNacimiento' 
                value={formData.fechaNacimiento} 
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Correo Electrónico</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="email" 
                name='email' 
                value={formData.email} 
                onChange={handleChange}
              />
            </div>

            <div className='space-y-1'>
              <label className="font-medium text-sm md:text-base">Teléfono</label>
              <input 
                className='border p-2 rounded focus:outline-none focus:border-green-300 w-full' 
                type="number" 
                name='telefono' 
                value={formData.telefono} 
                onChange={handleChange}
              />
                <p className="mt-1 text-xs text-gray-500">
                  El número debe comenzar con <strong>9</strong> seguido de 8 dígitos más. Ejemplo: <code>912345678</code>.
                </p>
            </div>

            <div className='space-y-1 relative'>
  <label className="font-medium text-sm md:text-base">Clave</label>
  <div className="relative">
    <input 
      className='border p-2 pr-10 rounded focus:outline-none focus:border-green-300 w-full' 
      type={showPassword ? 'text' : 'password'} 
      name='clave' 
      value={formData.clave} 
      onChange={handleChange}
    />
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      {showPassword ? '🙈' : '👁️'}
    </button>
  </div>
  {formData.clave && !validatePassword(formData.clave) && (
    <p className="mt-1 text-xs text-red-500">
      La contraseña no cumple con los requisitos
    </p>
  )}
  <p className="mt-1 text-xs text-gray-500">
    Debe incluir: mayúscula, número, carácter especial y minimo 8 caracteres.
  </p>
</div>
          </div>

          <div className='flex flex-row justify-between items-center space-x-4 mt-6'>
            <LoadingButton2 text="Ingresar" isLoading={isLoading} />
            <ClearButton setFormData={setFormData} />
          </div>
          
        </form>
      </div>
    </div>
  </>
);
};


export default Register;