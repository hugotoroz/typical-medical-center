import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // Asegúrate de que 'token' está almacenado en sessionStorage

    if (!token) {
      // Redirige a la página de login si no hay token
      navigate('/login');
    }
  }, [navigate]);

  // Si hay token, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;