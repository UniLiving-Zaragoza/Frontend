import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import LogoGrande from "../assets/LogoGrande.png";

function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  // HABRÁ QUE AÑADIR NUEVAS VERIFICACIONES CON LA API *********
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    const newErrors = {};
    if (!email) {
        newErrors.email = 'Email es requerido';
    }
    else if (!/\S+@\S+/.test(email)){
        newErrors.email = 'Email no válido';
    }
    
    if (!password){
        newErrors.password = 'Contraseña es requerida';
    } 
    else if (password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    
    if (form.checkValidity() && Object.keys(newErrors).length === 0) {
      // LÓGICA DE AUTENTICACIÓN
    }
    
    setValidated(true);
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
              maxHeight: "100px" 
            }} 
          />
        </div>
        
        <h4 className="text-center mb-4">Iniciar sesión</h4>
        
        {/* Inicio de sesión con Google */}
        <Button 
          variant="outline-secondary" 
          className="w-100 mb-3 d-flex align-items-center justify-content-center"
          style={{ height: '45px' }}
        >
          <FcGoogle size={20} className="me-2" />
          Iniciar sesión con Google
        </Button>
        
        {/* Inicio de sesión con email */}
        <div className="text-center mb-3">
          <span style={{ color: '#6c757d' }}>───── o usar email ─────</span>
        </div>
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
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

          <Form.Group className="mb-4" controlId="formBasicPassword">
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

          {/* Botón para inicio de sesión con email */}
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3 fw-bold"
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
            Iniciar sesión
          </Button>
        </Form>
        
        {/* Acceso al área de registro */}
        <div className="text-center mt-3">
          <span style={{ color: '#6c757d' }}>
            ¿Aún no tienes una cuenta? <Link to="/registro" style={{ textDecoration: 'none' }}>Regístrate</Link>
          </span>
        </div>
      </Card>
    </Container>
  );
}

export default LoginPage;