import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      // No hay token, redirigir a login
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);

      if (!allowedRoles.includes(decodedToken.roleId)) {
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } catch (error) {
      console.error('Error al validar token:', error);
      sessionStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate, allowedRoles]);

  return children;
};


export default ProtectedRoute;