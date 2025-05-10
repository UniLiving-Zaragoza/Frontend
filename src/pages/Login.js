import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import LogoGrande from "../assets/LogoGrande.png";
import axios from 'axios';

function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { login } = useAuth();

  const navigate = useNavigate();

  const API_URL = 'https://uniliving-backend.onrender.com';

  const handleGoogleLogin = () => {
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email es requerido';
    }

    if (!password) {
      newErrors.password = 'Contraseña es requerida';
    }
    else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);

    if (form.checkValidity() && Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setApiError('');
      
      try {

        const response = await axios.post(`${API_URL}/user/login`, {
          email,
          password
        });
        
        if (response.data && response.data.token) {

          sessionStorage.setItem('isAuthenticated', response.data.token);
          
          const userData = parseJwt(response.data.token);
          
          const isAdmin = userData.role === 'admin';
          sessionStorage.setItem('isAdmin', isAdmin.toString());
          
          await login();
          
          navigate(isAdmin ? "/principal-admin" : "/principal");
        }
      } catch (error) {
        console.error('Error de inicio de sesión:', error);
        
        // Manejar diferentes tipos de errores
        if (error.response) {
          if (error.response.status === 401) {
            setApiError('Credenciales inválidas.');
          } else {
            setApiError('Error en el servidor.');
          }
        } else if (error.request) {
          setApiError('No se pudo conectar con el servidor.');
        } else {
          setApiError('Error al procesar la solicitud.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    setValidated(true);
  };

  // Función para decodificar el token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '450px', maxWidth: '90vw', padding: '2.5rem' }} className="shadow">
        {/* Logo */}
        <div className="d-flex justify-content-center mb-4">
          <img
            src={LogoGrande}
            alt="UniLiving Logo"
            className="img-fluid"
            style={{
              maxWidth: "100%",
              height: "auto",
              maxHeight: "110px"
            }}
          />
        </div>

        <h4 className="text-center mb-3">Iniciar sesión</h4>

        {/* Inicio de sesión con Google */}
        <Button
          variant="outline-secondary"
          className="w-100 mb-3 d-flex align-items-center justify-content-center"
          style={{ height: '45px' }}
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={20} className="me-2" />
          Iniciar sesión con Google
        </Button>

        {/* Inicio de sesión con email */}
        <div className="text-center mb-2">
          <span style={{ color: '#6c757d' }}>───── o usar email ─────</span>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-1" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              isValid={validated && !errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              isValid={validated && !errors.password}
              required
              minLength={6}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Mostrar errores de la API */}
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}

          {/* Botón para inicio de sesión con email */}
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3 fw-bold"
            disabled={isLoading}
            style={{
              height: '50px',
              borderRadius: "30px",
              backgroundColor: "#000842",
              borderColor: "#000842",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              letterSpacing: "0.5px",
              fontSize: "1rem",
            }}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </Form>

        {/* Acceso al área de registro */}
        <div className="text-center mt-2">
          <span style={{ color: '#6c757d' }}>
            ¿Aún no tienes una cuenta? <Link to="/registro" style={{ textDecoration: 'none' }}>Regístrate</Link>
          </span>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;