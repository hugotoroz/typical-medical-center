import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sidebar, SidebarItem } from '../../components/sidebar/sidebar.jsx';
import { API_URL } from '../../../config.js';
import './newDoctor.css';


//console.log(API_URL);

const NewDoctor = () => {
    const [openId, setOpenId] = useState(null); // State to store user ID open
    const [data, setData] = useState([]); // Estado para almacenar los datos obtenidos de la API
    const [error, setError] = useState(null); // Estado para manejar errores

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
    try {
        const response = await axios.get(`${API_URL}/doctors/specialities`); 

        console.log(response.data);

        // Bring all the data
        const filteredData = response.data.map((user) => ({
        id: user.id, 
        name: user.nom, 
        rut: user.rut, 
        email: user.email 
        }));

        setData(filteredData); // Actualizar el estado con los datos filtrados
    } catch (error) {
        setError('Error fetching data'); // Manejar error si la API falla
        console.error('Error fetching data:', error);
    }
    };


    return (
        <>
          <div className="flex">
            <Sidebar>
              <SidebarItem iconName="Home" text="Home" />
              <Link to="/newDoctor" className="text-gray-700">
                <SidebarItem iconName="User" text="Crear doctor" active />
              </Link>
              <SidebarItem iconName="Settings" text="Settings" />
            </Sidebar>
      
            <div className="flex-1 p-8">
              <h2 className="text-2xl font-semibold mb-6">Crear nuevo doctor</h2>
              
              <form className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rut</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      id="fullName" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Nombre completo" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input 
                      type="text" 
                      name="specialty" 
                      id="specialty" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Especialidad" 
                    />
                  </div>
                </div>
      
                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo electronico</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="Correo electrónico" 
                  />
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      id="fullName" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Nombre completo" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
                    <input 
                      type="text" 
                      name="specialty" 
                      id="specialty" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Especialidad" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido Materna</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      id="fullName" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Nombre completo" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                    <input 
                      type="text" 
                      name="specialty" 
                      id="specialty" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Especialidad" 
                    />
                  </div>
                </div>
      
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numero de Celular</label>
                  <input 
                      type="text" 
                      name="specialty" 
                      id="specialty" 
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      placeholder="Especialidad" 
                    />
                </div>

                <div> 
                <label className="block text-sm font-medium text-gray-700">Especialidades</label>
                <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center">
                        <input 
                        type="checkbox" 
                        id="specialty1" 
                        name="specialties" 
                        value="cardiology" 
                        className="mr-2 leading-tight" 
                        />
                        <label htmlFor="specialty1" className="text-sm">Cardiología</label>
                    </div>
                    <div className="flex items-center">
                        <input 
                        type="checkbox" 
                        id="specialty2" 
                        name="specialties" 
                        value="neurology" 
                        className="mr-2 leading-tight" 
                        />
                        <label htmlFor="specialty2" className="text-sm">Neurología</label>
                    </div>
                    <div className="flex items-center">
                        <input 
                        type="checkbox" 
                        id="specialty3" 
                        name="specialties" 
                        value="pediatrics" 
                        className="mr-2 leading-tight" 
                        />
                        <label htmlFor="specialty3" className="text-sm">Pediatría</label>
                    </div>
                    <div className="flex items-center">
                        <input 
                        type="checkbox" 
                        id="specialty4" 
                        name="specialties" 
                        value="orthopedics" 
                        className="mr-2 leading-tight" 
                        />
                        <label htmlFor="specialty4" className="text-sm">Ortopedia</label>
                    </div>
                </div>

                </div>
      
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none"
                  >
                    Crear Doctor
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      );
      
};

export default NewDoctor;


  

