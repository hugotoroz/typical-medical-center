import React from "react";
import { motion } from "framer-motion";
import { Building2, Clock, Users, Phone, Mail, MapPin } from "lucide-react";
import Navbar from "../../../components/navbar/navbar.jsx";
import Footer from "../../../components/footer/footer.jsx";
import aboutBanner from "../../../images/aboutUs/aboutBanner.webp";

const AboutSection = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2"
  >
    <div className="p-4 bg-blue-100 rounded-full mb-4">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-gray-600 text-center leading-relaxed">{description}</p>
  </motion.div>
);

const MapSection = () => (
  <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3334.758881805468!2d-70.87492992344767!3d-33.29897048977213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDE3JzU2LjMiUyA3MMKwNTInMjAuNSJX!5e0!3m2!1ses-419!2scl!4v1731454510873!5m2!1ses-419!2scl"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
);
const ContactCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 items-center p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2"
  >
    <div className="">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        ¿Dónde Encontrarnos?
      </h2>
      <div className="space-y-4 mb-8">
        <div className="flex items-center space-x-3">
          <i class="fa-solid fa-map-pin w-5 h-5 text-blue-600"></i>
          <p className="text-gray-600">
            <a
              href="https://maps.app.goo.gl/Ya7DQpiZxnTXTwUa9"
              className="hover:text-blue-500"
              target="_blank"
            >
              Av. Principal 123, Lampa, Chile
            </a>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <i class="fa-solid fa-phone w-5 h-5 text-blue-600"></i>
          <p className="text-gray-600">
            <a href="tel:+56912345678" className="hover:text-blue-500">
              +56 9 1234 5678
            </a>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* <Mail className="w-5 h-5 text-blue-600" /> */}
          <i class="fa-solid fa-envelope w-5 h-5 text-blue-600"></i>
          <p className="text-gray-600">
            <a
              href="mailto:contacto@tmcenter.cl"
              className="hover:text-blue-500"
            >
              contacto@tmcenter.cl
            </a>
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Horario de Atención:</h3>
        <p className="text-gray-600">
          <span className="font-bold">Lunes a Viernes:</span> 8:00 - 20:00
        </p>
        <p className="text-gray-600">
          <span className="font-bold">Sábados:</span> 9:00 - 14:00
        </p>
        <p className="text-gray-600">
          <span className="font-bold">Domingos:</span> Cerrado
        </p>
      </div>
    </div>
  </motion.div>
);

const AboutUs = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[40vh] min-h-[400px]"
      >
        <img
          src={aboutBanner}
          alt="Centro Médico Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white text-center"
          >
            Conoce Nuestro Centro Médico
          </motion.h1>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-16">
        {/* Misión y Visión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          <div className="p-8 bg-blue-50 rounded-xl">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Nuestra Misión
            </h2>
            <p className="text-gray-700">
              Brindar atención médica de excelencia, centrada en el paciente y
              su familia, integrando la asistencia, docencia e investigación,
              con los más altos estándares de calidad, seguridad y ética
              profesional.
            </p>
          </div>
          <div className="p-8 bg-green-50 rounded-xl">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Nuestra Visión
            </h2>
            <p className="text-gray-700">
              Ser reconocidos como un centro médico en Lampa, destacando por
              nuestra calidad asistencial, compromiso con los pacientes y
              constante innovación en servicios de salud.
            </p>
          </div>
        </motion.div>

        {/* Características */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <AboutSection
            icon={Building2}
            title="Infraestructura Moderna"
            description="Instalaciones de última generación diseñadas para tu comodidad y atención"
          />
          <AboutSection
            icon={Users}
            title="Equipo Profesional"
            description="Personal altamente calificado y comprometido con tu salud"
          />
          <AboutSection
            icon={Clock}
            title="Atención Oportuna"
            description="Servicios médicos eficientes con los menores tiempos de espera"
          />
        </div>

        {/* Información de Contacto y Ubicación */}

        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <ContactCard />
            <MapSection />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
