import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';

function LoadingButton2({ text, isLoading = false }) {
  return (
    <motion.button
      disabled={isLoading}
      className={`w-1/2 px-6 py-2 my-5 bg-blue-400 text-white font-bold rounded-full flex justify-center items-center transition-colors duration-300 ${
        isLoading
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-primary hover:bg-blue-600"
      }`}
      whileHover={!isLoading ? { scale: 1.05 } : {}}
      whileTap={!isLoading ? { scale: 0.95 } : {}}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        text
      )}
    </motion.button>
  );
}
export default LoadingButton2;