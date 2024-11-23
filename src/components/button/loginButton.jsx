import { motion } from "framer-motion";

function LoginButton({ text = "Iniciar Sesión", href }) {
  return (
<motion.a
      href={href}
      className="bg-primary text-white font-bold py-2 px-4 rounded-full"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
      >
        {text}
      </motion.button>
    </motion.a>
  );
}

export default LoginButton;