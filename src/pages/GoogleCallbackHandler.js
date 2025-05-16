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
          // Usuario existente autenticado completamente
          await login(token);
          navigate('/principal', { replace: true });
        } else if (status === 'incomplete') {
          // Usuario NO existente requiere completar registro
          const partialProfile = {
            email: params.get('email'),
            name: params.get('name')
          };
          navigate('/registro-google', {
            state: { googleProfile: partialProfile },
            replace: true,
          });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Error procesando Google callback:', err);
        navigate('/login', { replace: true });
      }
    };

    fetchGoogleCallback();
  }, [navigate, location.search, login]);


  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
      <div
        className="spinner-border"
        role="status"
        style={{ width: '3rem', height: '3rem', borderColor: '#f3f3f3', borderTopColor: '#000842' }}
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="mt-3 fw-bold" style={{ color: '#000842' }}>
        Procesando autenticación...
      </p>
    </div>
  );
}

export default GoogleCallbackHandler;
