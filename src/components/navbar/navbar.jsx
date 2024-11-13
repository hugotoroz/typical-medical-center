import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation,useNavigate } from 'react-router-dom';
import logo from "../../images/logo/logo.jpeg"
import profile from "../../images/navbar/profile.jpg"
import './navbar.css';
// Button component
import Button from '../button/hrefButton.jsx';

function Navbar() {
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
          <Button text="Agendar Cita" href="/schedule" />
          {isLoggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-150"
            >
              Cerrar sesión
            </button>
            <Link to="/profile" className="hover:underline">
            <img className="w-10 h-10 rounded-full" src="src/images/navbar/profile.jpg" alt="User" />
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