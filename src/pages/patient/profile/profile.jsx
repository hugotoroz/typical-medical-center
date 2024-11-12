import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/navbar/navbar.jsx';
import Footer from '../../../components/footer/footer.jsx';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [patSurName, setPatSurName] = useState('');
  const [matSurName, setMatSurName] = useState('');
  const [dateBirth, setDateBirth] = useState('');


  const [cellphone, setCellphone] = useState('');
  const [showModal, setShowModal] = useState(false);



  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://tmcenter.cl/api/user/update",
        { email, cellphone },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        // Guardar el nuevo token
        sessionStorage.setItem("token", response.data.data.token);
        alert("¡Usuario actualizado exitosamente!");
        setShowModal(false); // Cerrar el modal
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave(e);
    handleCloseModal();
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.fullName);
      setRut(decodedToken.rut);
      setEmail(decodedToken.email);
      setPassword(decodedToken.password);
      setPatSurName(decodedToken.patSurName);
      setMatSurName(decodedToken.matSurName);
      setDateBirth(decodedToken.dateBirth);
      setCellphone(decodedToken.cellphone);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-64 rounded-lg border-2 border-indigo-500 bg-transparent p-4 text-center shadow-lg dark:bg-gray-800">
          <figure className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-600">

            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-person-fill text-white dark:text-indigo-300" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
            </svg>
            <figcaption className="sr-only">Información Basica</figcaption>
          </figure>
          <h2 className="mt-4 text-xl font-bold text-indigo-600 dark:text-indigo-400"></h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{rut}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{email}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{password}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{userName}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{patSurName}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{matSurName}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{dateBirth}</p>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{cellphone}</p>
          <div className="flex items-center justify-center">
            <button onClick={() => setShowModal(true)} className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-500">Editar Información</button>
          </div>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">
              Actualizar datos
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex space-x-4 mb-4">
                <input
                  placeholder="First Name"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-1/2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  type="text"
                />
                <input
                  placeholder="Last Name"
                  className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 w-1/2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                  type="text"
                />
              </div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="email"
              />
              <input
                value={cellphone}
                onChange={(e) => setCellphone(e.target.value)}
                placeholder="Telefono"
                className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                type="number"
              />
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                type="submit"
              >
                Guardar
              </button>
              <button
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}






      <Chatbot />
      <Footer />
    </>
  );
};


export default Profile;
