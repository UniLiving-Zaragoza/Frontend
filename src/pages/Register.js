import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoGrande from "../assets/LogoGrande.png";

function Register({ formData, onFormChange, nextStep }) {
  const [email, setEmail] = useState(formData.email || '');
  const [password, setPassword] = useState(formData.password || '');
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || '');
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
      return ['Contraseña es requerida'];
    }
    
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    
    if (password.length > 128) {
      errors.push('Máximo 128 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    
    return errors;
  };

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
    
    const passwordErrors = validatePassword(password);

    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Por favor confirma tu contraseña';
    } 
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    
    if (form.checkValidity() && Object.keys(newErrors).length === 0) {
      onFormChange({ email, password, confirmPassword });
      nextStep();
    }
    
    setValidated(true);
  };

  // Renderiza los errores de la contraseña como una lista
  const renderPasswordErrors = () => {
    if (!errors.password || !Array.isArray(errors.password)) {
      return errors.password;
    }
    
    return (
      <ul className="mb-0 ps-3">
        {errors.password.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    );
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
        
        <h4 className="text-center mb-3">Crear una cuenta</h4>
                
        {/* Inicio de sesión con email */}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-2" controlId="formBasicEmail">
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

          <Form.Group className="mb-2" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              isValid={validated && !errors.password}
              required
              minLength={8}
              maxLength={128}
            />
            <Form.Control.Feedback type="invalid">
              {renderPasswordErrors()}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!errors.confirmPassword}
              isValid={validated && !errors.confirmPassword && confirmPassword.length > 0}
              required
              minLength={8}
              maxLength={128}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword}
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
            Continuar
          </Button>
        </Form>
        
        {/* Acceso al área de registro */}
        <div className="text-center mt-2">
          <span style={{ color: '#6c757d' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ textDecoration: 'none' }}>Inicia sesión</Link>
          </span>
        </div>
      </Card>
    </Container>
  );
}

export default Register;