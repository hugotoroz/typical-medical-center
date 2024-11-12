import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/navbar.jsx";
import Footer from "../../components/footer/footer.jsx";
import Chatbot from "../../components/chatbot/chatbot.jsx";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import banner from "../../images/index/banner.png";
import generalPractitioner from "../../images/index/general-practitioner.webp";
import ophthalmologist from "../../images/index/ophthalmologist.webp";
import kinesiologist from "../../images/index/kinesiologist.webp";

import "./index.css";

/* animated text from the banner */
const texts = [
  "Tu salud comienza aquí",
  "Proporcionamos atención médica de alta calidad",
  "Estamos aquí para tu salud, en cada paso del camino",
  "Estamos aquí para ayudarte en cualquier momento",
  "Soluciones médicas avanzadas para todas tus necesidades",
];

const TextSwitcher = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0 }}
          className="absolute w-full"
        >
          <h1 className="text-xxs font-bold mb-3 sm:text-xl md:text-2xl lg:text-3xl">
            {texts[index]}
          </h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const MainPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [rut, setRut] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.fullName);
      setRut(decodedToken.rut);
    }
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      {/* banner */}
      <div className="absolute mt-nav relative">
        <img
          className="h-auto w-full shadow-bottom sm:h-64 md:h-80 lg:h-96"
          src={banner}
          alt="Hospital banner"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <TextSwitcher />
        </div>
      </div>

      {/* Quick Access */}
      <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4 sm:mb-8 md:mb-12 lg:mb-16">
        ¿Qué quieres hacer?
      </p>
      <div className="flex flex-wrap justify-center gap-4 my-20 sm:gap-8 md:gap-12 lg:gap-20">
        {userName && (
          <h2 className="text-xl text-white mt-4 w-full text-center">
            Welcome, {rut} {userName}!
          </h2>
        )}
        <Link to="/schedule">
          <a href="#" className="shortcuts">
            <i className="fas fa-calendar-alt fa-2x mb-2 text-red-500"></i>
            <p className="text-center font-semibold">Agendar Cita</p>
          </a>
        </Link>
        <a href="#" className="shortcuts">
          <i className="fas fa-heart-pulse fa-2x mb-2 text-blue-500"></i>
          <p className="text-center font-semibold">Conócenos</p>
        </a>
        <a href="#" className="shortcuts">
          <i className="fas fa-clipboard-list fa-2x mb-2 text-green-500"></i>
          <p className="text-center font-semibold">Especialidades</p>
        </a>
        <a href="#" className="shortcuts">
          <i className="fas fa-user-md fa-2x mb-2 text-yellow-500"></i>
          <p className="text-center font-semibold">Doctores</p>
        </a>
      </div>

      {/* locations */}
      <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4 sm:mb-8 md:mb-12 lg:mb-16">
        ¿Quiénes Somos?
      </p>
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-gray-700 leading-relaxed m-6 sm:m-6 md:m-8 lg:mb-10">
          Somos un nuevo centro médico ubicado en la comuna de Lampa, con el
          objetivo de brindar atención de alta calidad a nuestra comunidad.
          <br />
          Nuestro equipo de profesionales altamente capacitados está
          comprometido en ofrecer servicios médicos integrales y personalizados, <br />
          enfocados en la prevención, el diagnóstico y el tratamiento de
          diversas condiciones de salud.
        </p>
        <p className="text-gray-700 leading-relaxed m-6 sm:m-6 md:m-8 lg:mb-10">
          Si quieres saber mas sobre nosotros,
          <a href="#" className="text-blue-500">
            {" "}
            click aquí para más información.{" "}
          </a>
        </p>
      </div>

      {/* Specialities */}
      <p className="mb-banner text-center text-3xl font-semibold text-gray-800 mb-4 sm:mb-8 md:mb-12 lg:mb-16">
        Especialidades
      </p>
      <div className="flex flex-wrap justify-center gap-4 my-4 sm:gap-6 md:gap-8 lg:gap-12 mb-16">
        <div className="max-w-xs">
          <a href="#" className="flex flex-col location-card">
            <img
              className="object-cover w-full h-48 rounded-3xl sm:h-56 md:h-64 lg:h-72"
              src={generalPractitioner}
              alt="Medico general"
            />
            <div className="location-overlay">
              <p className="location-text">Médicina General</p>
              <button
                className="location-button"
                onClick={() => {
                  /* Maps */
                }}
              >
                Saber Más
              </button>
            </div>
          </a>
        </div>
        <div className="max-w-xs">
          <a href="#" className="flex flex-col location-card">
            <img
              className="object-cover w-full h-48 rounded-3xl sm:h-56 md:h-64 lg:h-72"
              src={ophthalmologist}
              alt="Oftalólogo"
            />
            <div className="location-overlay">
              <p className="location-text">Oftalmología</p>
              <button
                className="location-button"
                onClick={() => {
                  /* Maps */
                }}
              >
                Saber Más
              </button>
            </div>
          </a>
        </div>
        <div className="max-w-xs">
          <a href="#" className="flex flex-col location-card">
            <img
              className="object-cover w-full h-48 rounded-3xl sm:h-56 md:h-64 lg:h-72"
              src={kinesiologist}
              alt="Hospital 3"
            />
            <div className="location-overlay">
              <p className="location-text">Kinesiología</p>
              <button
                className="location-button"
                onClick={() => {
                  /* Maps */
                }}
              >
                Saber Más
              </button>
            </div>
          </a>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </>
  );
};

export default MainPage;
