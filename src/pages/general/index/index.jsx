import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
// Components
import Navbar from "../../../components/navbar/navbar.jsx";
import Footer from "../../../components/footer/footer.jsx";
import Chatbot from "../../../components/chatbot/chatbot.jsx";
import Button from "../../../components/button/hrefButton.jsx";
// Banner image
import banner from "../../../images/index/banner.png";
// Specialities images
import generalPractitioner from "../../../images/specialities/generalPractitioner.webp";
import ophthalmologist from "../../../images/specialities/ophthalmologist.webp";
import kinesiologist from "../../../images/specialities/kinesiologist.webp";

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
const ShortcutCard = ({ icon, text, href }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="shortcuts hover:shadow-xl transition-shadow duration-300"
  >
    <Link to={href} className="block p-6">
      <i className={`${icon} fa-2x mb-3 transition-colors duration-300`}></i>
      <p className="text-center font-semibold">{text}</p>
    </Link>
  </motion.div>
);
const SpecialityCard = ({ image, title, id }) => (
  <motion.div
    className="max-w-xs relative group"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="location-card overflow-hidden rounded-3xl">
      <motion.img
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        className="object-cover w-full h-48 sm:h-56 md:h-64 lg:h-72"
        src={image}
        alt={title}
      />
      <div className="location-overlay bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="location-text text-white text-xl font-bold mb-4">
            {title}
          </p>

          <Button text="Ver más" href={`/specialities#${id}`} />
        </motion.div>
      </div>
    </div>
  </motion.div>
);

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative mt-nav"
      >
        <img
          className="h-auto w-full shadow-lg sm:h-64 md:h-80 lg:h-96 object-cover"
          src={banner}
          alt="Hospital banner"
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4">
          <TextSwitcher />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto px-4"
      >
        <h2 className="text-center text-3xl font-semibold text-gray-800 my-16">
          ¿Qué quieres hacer?
        </h2>

        <div className="flex flex-wrap justify-center gap-4 my-20 sm:gap-8 md:gap-12 lg:gap-20">
          <ShortcutCard
            icon="fas fa-calendar-alt text-red-500"
            text="Agendar Cita"
            href="/patient/schedule"
          />
          <ShortcutCard
            icon="fas fa-heart-pulse text-blue-500"
            text="Conócenos"
            href="#"
          />
          <ShortcutCard
            icon="fas fa-clipboard-list text-green-500"
            text="Especialidades"
            href="#"
          />
          <ShortcutCard
            icon="fas fa-user-md text-yellow-500"
            text="Doctores"
            href="#"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            ¿Quiénes Somos?
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gray-700 leading-relaxed max-w-3xl mx-auto mb-6"
          >
            Somos un nuevo centro médico ubicado en la comuna de Lampa, con el
            objetivo de brindar atención de alta calidad a nuestra comunidad.
            Nuestro equipo de profesionales altamente capacitados está
            comprometido en ofrecer servicios médicos integrales y
            personalizados, enfocados en la prevención, el diagnóstico y el
            tratamiento de diversas condiciones de salud.
          </motion.p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
            href="#"
          >
            Click aquí para más información
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="text-center text-3xl font-semibold text-gray-800 mb-12">
            Especialidades
          </h2>
          <div className="flex flex-wrap justify-center gap-4 my-4 sm:gap-6 md:gap-8 lg:gap-12 mb-16">
            <SpecialityCard
              image={generalPractitioner}
              title="Medicina General"
              id="generalPractitioner"
            />
            <SpecialityCard
              image={ophthalmologist}
              title="Oftalmología"
              id="ophthalmologist"
            />
            <SpecialityCard
              image={kinesiologist}
              title="Kinesiología"
              id="kinesiologist"
            />
          </div>
        </motion.div>
      </motion.div>

      <Footer />
      <Chatbot />
    </>
  );
};

export default MainPage;
