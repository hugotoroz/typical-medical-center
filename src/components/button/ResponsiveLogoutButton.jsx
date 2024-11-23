import { motion } from 'framer-motion';
import React from 'react';
import { LogOut } from 'lucide-react'; // Usando Lucide icons para el icono de logout

const ResponsiveLogoutButton = ({ onClick, expanded }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 font-bold w-full"
    >
      <div className={`flex items-center justify-center ${expanded ? 'block' : 'hidden'}`}>
        Cerrar sesión
      </div>
      <div className={`flex items-center justify-center ${expanded ? 'hidden' : 'block'}`}>
        <LogOut size={20} />
      </div>
    </motion.button>
  );
};

export default ResponsiveLogoutButton;