import React from "react";
import { motion } from "framer-motion";

function onClickButton({ text, func }) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
        onClick={func}
      >
        {text}
      </motion.button>
    );
  }

export default onClickButton;
