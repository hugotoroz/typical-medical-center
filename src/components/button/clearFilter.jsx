import React from "react";
import { motion } from "framer-motion";

function ClearButton({ onClick, text }) {
    return (
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 font-bold"
        >
          {text}
        </motion.button>
      );
    
}



export default ClearButton;