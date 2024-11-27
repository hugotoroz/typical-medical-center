import React, { useState, useEffect } from 'react'; // hooks
import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../../../components/chatbot/chatbot.jsx';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Sidebar, SidebarItem } from '../../../components/sidebar/sidebar.jsx';
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
import {
    FiEdit,
    FiChevronDown,
    FiTrash,
    FiShare,
    FiPlusSquare,
  } from "react-icons/fi";
import { API_URL } from '../../../../config.js'; //VARIABLE DE ENTORNO
import './doctorSchedule.css';

const Schedule = () => {
  const [formData, setFormData] = useState({
    startTime: '09:00',
    endTime: '17:00',
    speciality: 1,
    weekdays: true,
    saturdays: true,
    sundays: true
  });

  const specialties = [
    { id: 1, name: 'General Medicine' },
    { id: 2, name: 'Pediatrics' },
    { id: 3, name: 'Cardiology' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your submission logic here
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-100 to-teal-150">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Doctor Schedule
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Speciality
              </label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {[
                { name: 'weekdays', label: 'Disponible en dias de semana' },
                { name: 'saturdays', label: 'Disponible en Sabados' },
                { name: 'sundays', label: 'Disponible en Domingos' }
              ].map(({ name, label }) => (
                <div key={name} className="flex items-center">
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    {label}
                  </label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              Generar Horario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Option = ({ text, Icon, setOpen, idCita, idPaciente }) => {
  const navigate = useNavigate();

  const handleOptionClick = async (action) => { 
      if (action === "Diagnosticar" && idCita && idPaciente) {
        localStorage.setItem("idCita", idCita);
        localStorage.setItem("idPaciente", idPaciente);
        navigate(`/doctor/diagnosis`);
      }
    };

    return (
      <motion.li
        variants={itemVariants}
        //onClick={() => setOpen(null)} // Close the menu when clicking an option
        onClick={() => handleOptionClick(text)}
        className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-md hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
      >
        <motion.span variants={actionIconVariants}>
          <Icon />
        </motion.span>
        <span>{text}</span>
      </motion.li>
    );
  };

export default Schedule;

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
  

