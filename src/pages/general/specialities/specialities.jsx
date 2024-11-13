import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; 
import { motion } from "framer-motion";
// Components
import Navbar from "../../../components/navbar/navbar.jsx";
import Footer from "../../../components/footer/footer.jsx";


import "./specialities.css";

// Specialities images
import cardiologist from "../../../images/specialities/cardiologist.webp";
import dermatologist from "../../../images/specialities/dermatologist.webp";
import generalPractitioner from "../../../images/specialities/generalPractitioner.webp";
import kinesiologist from "../../../images/specialities/kinesiologist.webp";
import nutritionist from "../../../images/specialities/nutritionist.webp";
import occupationalTherapist from "../../../images/specialities/occupationalTherapist.webp";
import ophthalmologist from "../../../images/specialities/ophthalmologist.webp";
import otolaryngologist from "../../../images/specialities/otolaryngologist.webp";

const specialitiesData = [
  { id: "cardiologist", name: "Cardiología", description: "Contamos con especialistas destacados en el cuidado del corazón.", image: cardiologist },
  { id: "dermatologist", name: "Dermatología", description: "Tratamiento especializado para el cuidado de tu piel.", image: dermatologist },
  { id: "generalPractitioner", name: "Medicina General", description: "Atención médica integral personalizada.", image: generalPractitioner },
  { id: "kinesiologist", name: "Kinesiología", description: "Rehabilitación física con expertos.", image: kinesiologist },
  { id: "nutritionist", name: "Nutrición", description: "Planes alimenticios personalizados.", image: nutritionist },
  { id: "occupationalTherapist", name: "Terapia Ocupacional", description: "Mejora de la autonomía con expertos.", image: occupationalTherapist },
  { id: "ophthalmologist", name: "Oftalmología", description: "Cuidado experto para tu salud visual.", image: ophthalmologist },
  { id: "otolaryngologist", name: "Otorrinolaringología", description: "Cuidado especializado en oídos, nariz y garganta.", image: otolaryngologist },
];

const SpecialityCard = React.forwardRef(({ speciality, index, isHighlighted }, ref) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
      isHighlighted ? "hover:shadow-2xl" : ""
    }`}
    ref={ref}
    id={speciality.id}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative h-84 overflow-hidden">
      <img
        src={speciality.image}
        alt={speciality.name}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-white transition-colors duration-300">
        {speciality.name}
      </h2>
      <p className="text-gray-600 group-hover:text-white transition-colors duration-300">
        {speciality.description}
      </p>
    </div>
  </motion.div>
));

const Specialities = () => {
  const { id } = useParams();
  const refs = useRef({});

  useEffect(() => {
    if (id && refs.current[id]) {
      refs.current[id].scrollIntoView({ behavior: "smooth", block: "center" });

      // Simular hover
      refs.current[id].classList.add("hovered");
      setTimeout(() => {
        refs.current[id].classList.remove("hovered");
      }, 2000);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4 mt-16"
        >
          Nuestras Especialidades
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Contamos con un equipo de profesionales altamente calificados para cuidar de tu salud.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialitiesData.map((speciality, index) => (
            <SpecialityCard
              key={speciality.id}
              speciality={speciality}
              index={index}
              ref={(el) => (refs.current[speciality.id] = el)}
              isHighlighted={id === speciality.id}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Specialities;
