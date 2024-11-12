import React from "react";
import "./footer.css";
import logo from "../../images/logo/logo2.jpeg";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Logo and Intro */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-12">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-16 w-auto mr-4" />
            <div>
              <h3 className="text-xl font-semibold">Centro Médico Lampa</h3>
              <p className="text-sm">
                Cuidando tu salud con tecnología y calidez humana.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links and Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <h4 className="text-lg font-semibold mb-2">Enlaces Rápidos</h4>
            <ul className="space-y-1">
              <li>
                <a href="#services" className="hover:text-blue-500">
                  Nuestros Servicios
                </a>
              </li>
              <li>
                <a href="#appointments" className="hover:text-blue-500">
                  Agenda tu Cita
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-500">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-500">
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Contáctanos</h4>
            <p className="text-sm">
              Dirección: Av. Principal 123, Lampa, Chile
            </p>
            <p className="text-sm">
              Teléfono:{" "}
              <a href="tel:+56912345678" className="hover:text-blue-500">
                +56 9 1234 5678
              </a>
            </p>
            <p className="text-sm">
              Email:{" "}
              <a
                href="mailto:contacto@tmcenter.cl"
                className="hover:text-blue-500"
              >
                contacto@tmcenter.cl
              </a>
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Síguenos</h4>
            <div className="flex space-x-6 justify-center">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-white text-3xl"
              >
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-white text-3xl"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-white text-3xl"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-white text-3xl"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Rights Reserved Section */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-center text-sm">
            © {new Date().getFullYear()} Typical Medical Center - Tu salud
            comienza aquí. Todos los derechos reservados. Desarrollado por
            Estudiantes de{" "}
            <a
              href="https://www.duoc.cl/sedes/plaza-norte/"
              className="text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              DuocUC
            </a>{" "}
            (Sede Plaza Norte).
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
