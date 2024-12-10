import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // No hay token, redirigir a login
      navigate('/login');
      return;
    }

    try {
      // Decodificar token usando jwt-decode
      const decodedToken = jwtDecode(token);

      // Verificar si el rol está permitido
      if (!allowedRoles.includes(decodedToken.roleId)) {
        // Mostrar alerta de acceso denegado
        Swal.fire({
          icon: 'error',
          title: 'Acceso Denegado',
          text: 'No tienes permisos para acceder a esta página.',
          confirmButtonText: 'Iniciar Sesión',
          allowOutsideClick: false
        }).then(() => {
          // Limpiar el token y redirigir al login
          localStorage.removeItem('token');
          navigate('/login');
        });
        return;
      }

    } catch (error) {
      console.error('Error al validar token:', error);
      
      // Limpiar el token inválido y redirigir al login
      localStorage.removeItem('token');
      
      Swal.fire({
        icon: 'error',
        title: 'Sesión Inválida',
        text: 'Tu sesión no es válida. Por favor, inicia sesión nuevamente.',
        confirmButtonText: 'Iniciar Sesión',
        allowOutsideClick: false
      }).then(() => {
        navigate('/login');
      });
      return;
    }
  }, [navigate, allowedRoles]);

  // Si el token es válido y el rol está permitido, renderiza el componente hijo
  return children;
};


export default ProtectedRoute;