import React, { useState } from 'react';
import Navbar from '../../components/navbar/navbar';
import loginImg from '../../images/login/centromedico.jpg';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateRut = async (rut,numDoc) => {
    try {
      const response = await fetch('https://tmcenter.cl/api/user/validate', {
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

  const validateGenero = (genero) => {
    const validGeneros = ['masculino', 'femenino'];
    return validGeneros.includes(genero.toLowerCase());
  };

  const validate = () => {
    let errors = {};

    if (!formData.nombres) errors.nombres = 'Nombres es requerido';
    if (formData.nombres.length > 50) errors.nombres = 'Nombres no puede tener más de 50 caracteres';
    if (!formData.apellidoPaterno) errors.apellidoPaterno = 'Apellido Paterno es requerido';
    if (formData.apellidoPaterno.length > 50) errors.apellidoPaterno = 'Apellido Paterno no puede tener más de 50 caracteres';
    if (!formData.apellidoMaterno) errors.apellidoMaterno = 'Apellido Materno es requerido';
    if (formData.apellidoMaterno.length > 50) errors.apellidoMaterno = 'Apellido Materno no puede tener más de 50 caracteres';
    if (!validateGenero(formData.genero)) {
      validationErrors.genero = 'El género debe ser "masculino" o "femenino".';
    }
    if (!formData.rut) errors.rut = 'Rut es requerido';
    if (formData.rut.length > 12) errors.rut = 'Rut no puede tener más de 12 caracteres';
    if (!formData.numDoc) errors.numDoc = 'Número de Documento es requerido';
    if (!formData.telefono) errors.telefono = 'Telefono es requerido';
    if (formData.telefono.length > 15) errors.telefono = 'Telefono no puede tener más de 15 caracteres';
    if (!formData.fechaNacimiento) errors.fechaNacimiento = 'Fecha de Nacimiento es requerido';
    if (!formData.email) errors.email = 'Email es requerido';
    if (!validateEmail(formData.email)) errors.email = 'Email no es válido';
    if (!formData.clave) errors.clave = 'Clave es requerido';
    if (formData.clave.length > 20) errors.clave = 'Clave no puede tener más de 20 caracteres';
    if (formData.clave !== formData.confirmarClave) errors.confirmarClave = 'Las claves no coinciden';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      const isRutValid = await validateRut(formData.rut,formData.numDoc);
      if (!isRutValid) {
        setErrors({ ...validationErrors, rut: 'RUT no es válido' });
        return;
      }
      try {
        const response = await fetch('https://tmcenter.cl/api/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rut: formData.rut,
            email: formData.email,
            password: formData.clave,
            name: formData.nombres,
            patSurName: formData.apellidoPaterno,
            matSurName: formData.apellidoMaterno,
            genre: formData.genero,
            dateBirth: formData.fechaNacimiento,
            cellphone: formData.telefono
          })
        });

        const data = await response.json();
        if (response.ok) {
          console.log('Form submitted successfully', data);
          localStorage.setItem('token', data.token);
          navigate('/');
          // Handle successful registration, e.g., redirect or show a success message
        } else {
          if (data.data && data.data.error_code === 'DUPLICATE_KEY') {
            setErrors({ ...validationErrors, rut: 'RUT ya está registrado' });
          } else {
            console.error('Error submitting form', data);
          }
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
    <form className='max-w-[400px] w-full mx-auto bg-white p-8 rounded-lg shadow-lg mt-8' onSubmit={handleSubmit}>
      <h2 className='text-4xl font-bold text-center py-6'>Registrarse</h2>
      <div className='flex flex-col py-2'>
        <label>Nombres</label>
        <input className='border p-2' type="nombres" name='nombres' value={formData.nombres} onChange={handleChange}/>
        {errors.nombres && <p className="text-red-500">{errors.nombres}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Correo Electronico</label>
        <input className='border p-2' type="email" name='email' value={formData.email} onChange={handleChange}/>
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Apellido Paterno</label>
        <input className='border p-2' type="text" name='apellidoPaterno' value={formData.apellidoPaterno} onChange={handleChange}/>
        {errors.apellidoPaterno && <p className="text-red-500">{errors.apellidoPaterno}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Apellido Materno</label>
        <input className='border p-2' type="text" name='apellidoMaterno' value={formData.apellidoMaterno} onChange={handleChange}/>
        {errors.apellidoMaterno && <p className="text-red-500">{errors.apellidoMaterno}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Genero</label>
        <input className='border p-2' type="text" name='genero' value={formData.genero} onChange={handleChange}/>
        {errors.genero && <p className="text-red-500">{errors.genero}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Rut</label>
        <input className='border p-2' type="text" name='rut' value={formData.rut} onChange={handleChange}/>
        {errors.rut && <p className="text-red-500">{errors.rut}</p>}
      </div>
      <div className='flex flex-col py-2'>
              <label>Número de Documento</label>
              <input className='border p-2' type="number" name='numDoc' value={formData.numDoc} onChange={handleChange} />
              {errors.numDoc && <p className="text-red-500">{errors.numDoc}</p>}
            </div>
      <div className='flex flex-col py-2'>
        <label>Telefono</label>
        <input className='border p-2' type="number" name='telefono' value={formData.telefono} onChange={handleChange}/>
        {errors.telefono && <p className="text-red-500">{errors.telefono}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Fecha de Nacimiento</label>
        <input className='border p-2' type="date" name='fechaNacimiento' value={formData.fechaNacimiento} onChange={handleChange}/>
        {errors.fechaNacimiento && <p className="text-red-500">{errors.fechaNacimiento}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Clave</label>
        <input className='border p-2' type="password" name='clave' value={formData.clave} onChange={handleChange}/>
        {errors.clave && <p className="text-red-500">{errors.clave}</p>}
      </div>
      <div className='flex flex-col py-2'>
        <label>Confirmar Clave</label>
        <input className='border p-2' type="password" name='confirmarClave' value={formData.confirmarClave} onChange={handleChange}/>
        {errors.confirmarClave && <p className="text-red-500">{errors.confirmarClave}</p>}
      </div>
      <button className='border w-full my-5 py-2 bg-green-300 hover:bg-green-200 text-white' type='submit'>Continuar</button>
    </form>
  </div>
</div>
  </>
  );
};
 
export default Register;