import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation,useNavigate } from 'react-router-dom';
import logo from "../../images/logo/logo.jpeg"
import profile from "../../images/navbar/profile.jpg"
import './navbar.css';
import { jwtDecode } from "jwt-decode";
// Button component
import Button from '../button/hrefButton.jsx';

function Navbar() {
  const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [patSurName, setPatSurName] = useState('');
    const [matSurName, setMatSurName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [cellphone, setCellphone] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  // The useLocation hook provides the current location object
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Function to close the menu
  const closeMenu = () => setIsMenuOpen(false);

  // Effect to handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // 768px is the breakpoint for md screens in Tailwind CSS
        closeMenu();
      }
    };

    // Add event listener on mount
    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    // Eliminar el token de sessionStorage
    sessionStorage.removeItem("token");
    
    // Redirigir al usuario a la página de inicio de sesión
    navigate("/login");
  };

  const isLoggedIn = Boolean(sessionStorage.getItem("token"));

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

          //fetchUserData();
      }
  }, []);

  return (
    <>
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-30"> {/* Navbar with z-30 */}
        <div className="max-w-8xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img className="hidden md:block w-10 h-10 rounded-full" src={logo} alt="Logo" />
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden md:flex space-x-9 ml-9">
            <NavLink
              to="/"
              className={`text-gray-700 underline-black ${location.pathname === '/' ? 'active' : ''}`}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/specialities"
              className={`text-gray-700 underline-black ${location.pathname === '/services' ? 'active' : ''}`}
            >
              Especialidades
            </NavLink>
            <NavLink
              to="/aboutUs"
              className={`text-gray-700 underline-black ${location.pathname === '/patient' ? 'active' : ''}`}
            >
              ¿Quiénes Somos?
            </NavLink>
            <NavLink
              to="/contact"
              className={`text-gray-700 underline-black ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contáctanos
            </NavLink>
          </div>
          <div className="flex items-center space-x-6 ml-auto">
          <Button text="Agendar Cita" href="/patient/schedule" />
          {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-150 text-white"
            >
              Cerrar sesión
            </button>
            <Link to="/patient/userProfile">
              {userName ? (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <img className="w-12 h-12 rounded-full" src="../../images/navbar/profile.jpg" alt="User" />
              )}
            </Link>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1.5 px-6 border border-blue-500 hover:border-transparent rounded-lg">
              Iniciar Sesión
            </button>
          </Link>
        )}

          </div>
        </div>
      </nav>
      {/* Mobile menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} z-20 mt-16`}> {/* Add mt-16 */}
        <div className="p-4">
          <NavLink
            to="/"
            className={`block text-gray-700 p-4 ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/specialities"
            className={`block text-gray-700 p-4 ${location.pathname === '/services' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Especialidades
          </NavLink>
          <NavLink
            to="/aboutUs"
            className={`block text-gray-700 p-4 ${location.pathname === '/patient' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            ¿Quiénes Somos?
          </NavLink>
          <NavLink
            to="/contact"
            className={`block text-gray-700 p-4 ${location.pathname === '/contact' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Contáctanos
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Navbar;