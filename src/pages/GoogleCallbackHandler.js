import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../authContext';

function GoogleCallbackHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const fetchGoogleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const status = params.get('status');

        if (token) {
          // Usuario autenticado completamente
          await login(token);
          window.location.replace('/principal')
        } else if (status === 'incomplete') {
          const partialProfile = {
            email: params.get('email'),
            name: params.get('name')
          };
          navigate('/registro-google', {
            state: { googleProfile: partialProfile }
          });
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error procesando Google callback:', err);
        navigate('/login');
      }
    };

    fetchGoogleCallback();
  }, [navigate, login, location.search]);

  return <p>Procesando autenticación con Google...</p>;
}

export default GoogleCallbackHandler;
