import React,{useState} from 'react';
import Navbar from '../../components/navbar/navbar';
import loginImg from '../../images/login/centromedico.jpg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rut: '',
    clave: ''
  });
  
  const [errors, setErrors] = useState({});
  

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
      try {
        const response = await fetch('https://backend-tmc.onrender.com/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rut: formData.rut,
            password: formData.clave
          })
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Form submitted successfully', data);
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          console.error('Error logging in', data);
          setErrors({ form: data.data || 'Credenciales inválidas' });
          // Handle error response from the server
        }
      } catch (error) {
        console.error('Error submitting form', error);
        // Handle network or other errors
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
          <h2 className='text-4xl font-bold text-center py-6'>Inicio de Sesion</h2>
          <div className='flex flex-col py-2'>
            <label>Rut</label>
            <input className='border p-2' type="text" name='rut' value={formData.rut} onChange={handleChange}/>
            {errors.rut && <p className="text-red-500">{errors.rut}</p>}
          </div>
          <div className='flex flex-col py-2'>
            <label>Contraseña</label>
            <input className='border p-2' type="password" name='clave' value={formData.clave} onChange={handleChange}/>
            {errors.clave && <p className="text-red-500">{errors.clave}</p>}
          </div>
          {errors.form && <p className="text-red-500">{errors.form}</p>}
          <button className='border w-full my-5 py-2 bg-green-300 hover:bg-green-200 text-white'>Ingresar</button>
          <div className='flex justify-between'>
            <p className='flex items-center'><input className='mr-2' type="checkbox" /> Recuerdame</p>
            <Link to="/register">
            <p>Registrarme</p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  </>
);

};

export default Login;