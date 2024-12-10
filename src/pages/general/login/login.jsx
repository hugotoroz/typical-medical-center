import React,{useState} from 'react';
import Navbar from '../../../components/navbar/navbar.jsx';
import loginImg from '../../../images/login/centromedico.jpg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { API_URL } from '../../../../config.js';
import axios from 'axios';
import LoadingButton from '../../../components/button/loadingButton.jsx';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rut: '',
    clave: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    let errors = {};

    if (!formData.rut) errors.rut = 'Rut es requerido';
    if (!formData.clave) errors.clave = 'Clave es requerido';

    return errors;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
  
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}/user/login`, {
          rut: formData.rut,
          password: formData.clave
        });
  
        const data = response.data;
  
        localStorage.setItem('token', data.data.token);
  
        const decodedToken = jwtDecode(data.data.token);
        const userRole = decodedToken.roleId;

        console.log(data.data.token);
  
        if (userRole === 3) {
          navigate('/'); 
        } else if (userRole === 2) {
          navigate('/doctor/doctorsPage'); 
        } else if (userRole === 1){
          navigate('/admin/adminManagment'); 
        } else {
          console.error('Rol desconocido');
          setErrors({ form: 'Rol desconocido' });
        }
  
      } catch (error) {
        console.error('Error submitting form', error);
  
        if (error.response) {
          setErrors({ form: 'Credenciales inválidas' });
        } else if (error.request) {
          setErrors({ form: 'Problema de red. Verifica tu conexión.' });
        } else {
          setErrors({ form: 'Error desconocido. Intenta más tarde.' });
        }
      } finally {
        setIsLoading(false);
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
        <img className='w-full h-full object-cover' src={loginImg} alt="" />
      </div>

      <div className='bg-gray-100 flex flex-col justify-center h-full'>
        <form className='max-w-[400px] w-full mx-auto bg-white p-8 rounded-lg shadow-lg' onSubmit={handleSubmit}>
          <h2 className='text-4xl font-bold text-center py-6'>Inicio de Sesión</h2>
          <div className='flex flex-col py-2'>
            <label>Rut</label>
            <input className='border p-2' type="text" name='rut' placeholder="11111111-1" value={formData.rut} onChange={handleChange}/>
            {errors.rut && <p className="text-red-500">{errors.rut}</p>}
          </div>
          <div className='flex flex-col py-2'>
            <label>Contraseña</label>
            <input className='border p-2' type="password" name='clave' value={formData.clave} onChange={handleChange}/>
            {errors.clave && <p className="text-red-500">{errors.clave}</p>}
          </div>
          {errors.form && <p className="text-red-500">{errors.form}</p>}
          <LoadingButton text="Ingresar" isLoading={isLoading} />
          <Link to="/patient/register" className="w-full">
          <p className='flex items-center justify-center text-black hover:text-blue-800 transition-colors duration-300 font-medium group'>
            Registrarme 
            <svg 
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </p>
        </Link>
        </form>
      </div>
    </div>
  </>
);

};

export default Login;