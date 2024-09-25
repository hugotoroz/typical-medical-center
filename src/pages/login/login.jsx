import React from 'react';
import Navbar from '../../components/navbar/navbar';
import loginImg from '../../images/login/centromedico.jpg';
import { Link, NavLink, useLocation } from 'react-router-dom';
const Login = () => {
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
        <form className='max-w-[400px] w-full mx-auto bg-white p-8 rounded-lg shadow-lg'>
          <h2 className='text-4xl font-bold text-center py-6'>Inicio de Sesion</h2>
          <div className='flex flex-col py-2'>
            <label>Usuario</label>
            <input className='border p-2' type="text" />
          </div>
          <div className='flex flex-col py-2'>
            <label>Constrasena</label>
            <input className='border p-2' type="password" />
          </div>
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
    </>
  );
};

export default Login;