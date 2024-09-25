import React from 'react';
import Navbar from '../../components/navbar/navbar';
import loginImg from '../../images/login/centromedico.jpg';

const Register = () => {
  return (
    <>
    <Navbar/>

    return (
  <>
    <Navbar />

    <div className='grid grid-cols-1 sm:grid-cols-2 h-screen w-full'>
  <div className='hidden sm:block'>
    <img className='w-full h-full object-cover' src={loginImg} alt="" />
  </div>

  <div className='bg-gray-100 flex flex-col justify-center h-full'>
    <form className='max-w-[400px] w-full mx-auto bg-white p-8 rounded-lg shadow-lg mt-8'>
      <h2 className='text-4xl font-bold text-center py-6'>Registrarse</h2>
      <div className='flex flex-col py-2'>
        <label>Nombres</label>
        <input className='border p-2' type="text" />
      </div>
      <div className='flex flex-col py-2'>
        <label>Apellido</label>
        <input className='border p-2' type="text" />
      </div>
      <div className='flex flex-col py-2'>
        <label>Rut</label>
        <input className='border p-2' type="text" />
      </div>
      <div className='flex flex-col py-2'>
        <label>Fecha de Nacimiento</label>
        <input className='border p-2' type="date" />
      </div>
      <button className='border w-full my-5 py-2 bg-green-300 hover:bg-green-200 text-white'>Continuar</button>
    </form>
  </div>
</div>
  </>
);
    </>
  );
};

export default Register;