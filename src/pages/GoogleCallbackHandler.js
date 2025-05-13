import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import axios from 'axios';

function GoogleCallbackHandler() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const fetchGoogleCallback = async () => {
      try {

        const response = await axios.get('https://uniliving-backend.onrender.com/auth/google/callback', {
          credentials: 'include',
        });

        if (response.data.token) {
          // Usuario autenticado completamente
          await login(response.data.token);
          navigate('/principal');
        } else if (response.data.requiresProfileCompletion) {
          // Guardar info parcial
          navigate('/registro-google', {
            state: {
              googleProfile: response.data.partialProfile
            }
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
  }, [navigate, login]);

  return <p>Procesando autenticación con Google...</p>;
}

export default GoogleCallbackHandler;
