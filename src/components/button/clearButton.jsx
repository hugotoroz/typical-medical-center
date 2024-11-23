import { motion } from "framer-motion";

function ClearButton({ setFormData }) {
  const handleClear = () => {
    setFormData({
      rut: '',
      numDoc: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      genero: '',
      fechaNacimiento: '',
      email: '',
      telefono: '',
      clave: '',
      confirmarClave: ''
    });
  };

  return (
    <motion.button
      onClick={handleClear}
      className="w-1/2 px-6 py-2 my-5 bg-red-400 hover:bg-red-600 text-white font-bold rounded-full flex justify-center items-center transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Limpiar
    </motion.button>
  );
}

export default ClearButton;