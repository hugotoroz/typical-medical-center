import { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiEyeOff,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { API_URL } from '../../../../config.js'; //VARIABLE DE ENTORNO
import './adminManagment.css';

const AdminManagment = () => {
  const [openId, setOpenId] = useState(null); // State to store user ID open
  const [data, setData] = useState([]); // Estado para almacenar los datos obtenidos de la API
  const [error, setError] = useState(null); // Estado para manejar errores
  const [isLoading, setIsLoading] = useState(true); // Estado para el spinner de carga

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  // Función para obtener los datos de la API usando Axios
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/doctors`, {
        headers: {
          Authorization: `Bearer ${token}` // Enviar el token en los headers
        }
      }); 

      // Bring all the data
      const filteredData = response.data.map((user) => ({
        id: user.id, 
        name: user.nom, 
        rut: user.rut, 
        email: user.email 
      }));

      setData(filteredData); // Actualizar el estado con los datos filtrados
      setIsLoading(false); // Finaliza la carga
    } catch (error) {
      setError('Error fetching data'); // Manejar error si la API falla
      console.error('Error fetching data:', error);
      setIsLoading(false); // Finaliza la carga
    }
  };

  return (
    <>
    <div className="flex bg-gradient-to-br from-teal-100 to-teal-150 h-screen">
        <Sidebar />
        <div className="flex-1 p-8 bg-white bg-opacity-90 rounded-lg shadow-lg m-4">
          <div className="container mx-auto flex-grow px-4">
          <h2 className="text-2xl font-semibold mb-6">Doctores</h2>
          {error && <p className="text-red-500">{error}</p>} {/* Mostrar error si existe */}
            {isLoading ? (
              // Muestra solo el spinner mientras se cargan los datos
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full max-w-xs bg-white border border-gray-300 rounded-lg shadow-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rut</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 border-b border-gray-200 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100 transition-colors duration-200">
                        <td className="px-4 py-3 border-b border-gray-200 text-sm">{user.id}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-left">{user.rut}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-left">{user.name}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm text-left">{user.email}</td>
                        <td className="px-4 py-3 border-b border-gray-200 text-sm">
                          <div className="flex items-center justify-center">
                            <motion.div animate={openId === user.id ? "open" : "closed"} className="absolute">
                              <button
                                onClick={() => setOpenId(openId === user.id ? null : user.id)} // Alternate Id
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-indigo-50 bg-indigo-500 hover:bg-indigo-500 transition-colors z-10"
                              >
                                <span className="font-medium text-sm">Post actions</span>
                                <motion.span variants={iconVariants}>
                                  <FiChevronDown />
                                </motion.span>
                              </button>

                              <motion.ul
                                initial={wrapperVariants.closed}
                                variants={wrapperVariants}
                                style={{ originY: "top", translateX: "-50%" }}
                                className="flex flex-col gap-2 p-2 rounded-lg bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden z-20"
                              >
                                <Option setOpen={setOpenId} Icon={FiEdit} text="Modificar" />
                                <Option setOpen={setOpenId} Icon={FiEyeOff} text="Desactivar" rut={user.rut}/>
                                <Option setOpen={setOpenId} Icon={FiTrash} text="Eliminar" rut={user.rut}/>
                              </motion.ul>
                            </motion.div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
   
    </div>
    
    </>
  );
};

const Option = ({ text, Icon, setOpen, rut }) => {

  const handleClick = async (action) => { 
    if (action === "Desactivar") {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Está seguro de desactivar al doctor con RUT ${rut}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => { // Cambia esta función anónima a async
        if (result.isConfirmed) {
          setOpen(null);
          try {
            const token = sessionStorage.getItem('token');
            // Envía el RUT al backend para desactivar el doctor
            await axios.put(`${API_URL}/user/status`, 
              { rut }, 
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            fetchData();
            Swal.fire('Desactivado!', 'El doctor ha sido desactivado.', 'success');
          } catch (error) {
            Swal.fire('Error', 'Hubo un problema al desactivar al doctor.', 'error');
            console.error('Error desactivando doctor:', error);
          }
        }
      });
    }else if (action === "Eliminar") {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Está seguro de eliminar al doctor con RUT ${rut}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => { // Cambia esta función anónima a async
        if (result.isConfirmed) {
          setOpen(null);
          try {
            const token = sessionStorage.getItem('token');
            // Envía el RUT al backend para desactivar el doctor
            await axios.put(`${API_URL}/user/delete`, 
              { rut }, 
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            fetchData();
            Swal.fire('Eliminado!', 'El doctor ha sido eliminado con exito.', 'success');
          } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar al doctor.', 'error');
            console.error('Error eliminando doctor:', error);
          }
        }
      });
    }
  };

  return (
    <motion.li
      variants={itemVariants}
      //onClick={() => setOpen(null)} // Close the menu when clicking an option
      onClick={() => handleClick(text)}
      className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

export default AdminManagment;

// Variants for animations
const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};
