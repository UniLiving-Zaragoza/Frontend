import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

function RegisterInfo({ formData, onFormChange, prevStep }) {

  const navigate = useNavigate();

  const API_URL = 'https://uniliving-backend.onrender.com';

  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY

  const barriosZaragoza = [
    "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
    "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
    "Centro", "Las Fuentes", "Universidad", "San José",
    "Casablanca", "Torrero-La Paz", "Sur"
  ];

  const [localFormData, setLocalFormData] = useState({
    nombre: formData.nombre || '',
    apellidos: formData.apellidos || '',
    edad: formData.edad || '',
    genero: formData.genero || '',
    pais: formData.pais || '',
    descripcion: formData.descripcion || '',
    estadoLaboral: formData.estadoLaboral || '',
    fumador: formData.fumador || '',
    duracionEstancia: formData.duracionEstancia || '',
    mascotas: formData.mascotas || '',
    frecuenciaVisitas: formData.frecuenciaVisitas || '',
    zonasBusqueda: formData.zonasBusqueda || '',
    preferenciaConvivencia: formData.preferenciaConvivencia || '',
    interesesHobbies: formData.interesesHobbies || ''
  });

  const [errors, setErrors] = useState({});
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Variables para el captcha
  const [captchaValue, setCaptchaValue] = useState(null);
  const [captchaError, setCaptchaError] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 5;
  const [temporarilyBlocked, setTemporarilyBlocked] = useState(false);
  const BLOCK_TIME = 60;
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(BLOCK_TIME);

  const requiredFields = [
    'nombre',
    'apellidos',
    'edad',
    'genero',
    'fumador',
    'mascotas',
    'estadoLaboral'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setCaptchaError('');
  };

  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach(field => {
      if (!localFormData[field] || localFormData[field].trim() === '') {
        newErrors[field] = 'Este campo es obligatorio';
      }
    });

    // Verificar captcha
    if (!captchaValue) {
      setCaptchaError('Por favor, complete el captcha');
      return false;
    }

    // Abrir acordeón si algún campo dentro de él tiene error
    const accordedFields = ['estadoLaboral', 'fumador', 'mascotas', 'duracionEstancia', 'frecuenciaVisitas', 'zonasBusqueda', 'preferenciaConvivencia', 'interesesHobbies'];
    const shouldOpenAccordion = accordedFields.some(field => newErrors[field]);

    setAccordionOpen(shouldOpenAccordion);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Función para iniciar bloqueo temporal
  const startTemporaryBlock = () => {
    setTemporarilyBlocked(true);
    
    let remainingTime = BLOCK_TIME;
    setBlockTimeRemaining(remainingTime);
    
    const timer = setInterval(() => {
      remainingTime -= 1;
      setBlockTimeRemaining(remainingTime);
      
      if (remainingTime <= 0) {
        clearInterval(timer);
        setTemporarilyBlocked(false);
        setAttemptCount(0);
      }
    }, 1000);
  };

  const mapFormDataToApiModel = () => {

    const age = parseInt(localFormData.edad, 10);
    const smoker = localFormData.fumador === 'Sí';
    const pets = localFormData.mascotas === 'Sí';
    
    let gender;
    switch(localFormData.genero) {
      case 'Masculino':
        gender = 'Male';
        break;
      case 'Femenino':
        gender = 'Female';
        break;
      default:
        gender = 'Other';
    }

    let employmentStatus;
    switch(localFormData.estadoLaboral) {
      case 'Estudiante':
        employmentStatus = 'Student';
        break;
      case 'Empleado':
        employmentStatus = 'Employed';
        break;
      case 'Desempleado':
        employmentStatus = 'Unemployed';
        break;
      default:
        employmentStatus = 'Other';
    }

    let livingPreference;
    switch(localFormData.preferenciaConvivencia) {
      case 'Solo':
        livingPreference = 'Alone';
        break;
      case 'Compartido':
        livingPreference = 'Shared';
        break;
      case 'Familiar':
        livingPreference = 'Family';
        break;
      default:
        livingPreference = 'Other';
    }

    let visitFrequency;
    switch(localFormData.frecuenciaVisitas) {
      case 'Diarias':
        visitFrequency = 'Daily';
        break;
      case 'Semanales':
        visitFrequency = 'Weekly';
        break;
      case 'Mensuales':
        visitFrequency = 'Monthly';
        break;
      case 'Ocasionales':
        visitFrequency = 'Occasional';
        break;
      case 'Nunca':
        visitFrequency = 'Never';
        break;
      default:
        visitFrequency = 'Occasional';
    }

    const hobbiesInterests = localFormData.interesesHobbies 
      ? localFormData.interesesHobbies.split(',').map(item => item.trim()) 
      : [];

    return {
      firstName: localFormData.nombre,
      lastName: localFormData.apellidos,
      age: age,
      gender: gender,
      personalDescription: localFormData.descripcion || "No se ha proporcionado una descripción",
      email: formData.email,
      password: formData.password,
      personalSituation: {
        smoker: smoker,
        pets: pets,
        employmentStatus: employmentStatus,
        livingPreference: livingPreference,
        visitFrequency: visitFrequency,
        hobbiesInterests: hobbiesInterests,
        zones: localFormData.zonasBusqueda && localFormData.zonasBusqueda.trim() !== '' ? [localFormData.zonasBusqueda] : null
      }
    };
  };

  // Función para verificar el captcha en el servidor
  const verifyCaptcha = async (token) => {
    try {
      const response = await axios.post(`${API_URL}/captcha/verify`, { token });
      return response.data.success;
    } catch (error) {
      console.error("Error al verificar captcha:", error);
      
      // Error en la respuesta del captcha
      if (error.response) {
        if (error.response.status === 403) {
          setCaptchaError('Captcha inválido. Por favor, intente nuevamente.');
        } else {
          setCaptchaError('Error en la verificación del captcha.');
        }
      } else {
        setCaptchaError('No se pudo conectar con el servidor para verificar el captcha.');
      }
      
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar si está bloqueado temporalmente
    if (temporarilyBlocked) {
      return;
    }
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const isCaptchaValid = await verifyCaptcha(captchaValue);
      
      if (!isCaptchaValid) {

        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);
        
        if (newAttemptCount >= MAX_ATTEMPTS) {
          startTemporaryBlock();
        }
        
        setIsSubmitting(false);
        return;
      }

      const userData = mapFormDataToApiModel();
      console.log('Datos a enviar al backend:', userData);
      
      const response = await axios.post(`${API_URL}/user/register`, userData);
      
      console.log('Respuesta del registro:', response.data);
      
      setRegistrationSuccess(true);
      setIsRedirecting(true);
      
      onFormChange(localFormData);
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      console.error("Error durante el registro:", error);
      
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      
      if (newAttemptCount >= MAX_ATTEMPTS) {
        startTemporaryBlock();
      }
      
      // Manejo de errores
      if (error.response) {
        if (error.response.status === 400 && error.response.data.message) {
          setApiError(error.response.data.message);
        } else if (error.response.data && error.response.data.error) {
          setApiError(error.response.data.error);
        } else {
          setApiError(`Error del servidor: ${error.response.status}`);
        }
      } else if (error.request) {
        setApiError('No se pudo conectar con el servidor.');
      } else {
        setApiError('Error al procesar la solicitud de registro.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    onFormChange(localFormData);
    prevStep();
  };

  // Determinar si los controles deben estar deshabilitados
  const isFormDisabled = isSubmitting || temporarilyBlocked || isRedirecting;

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '850px', maxHeight: '90vh', padding: '2rem' }} className="shadow">
        <div style={{ height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
  
          <h3 className="text-center mb-5">Crear una cuenta</h3>
          
          <Form onSubmit={handleSubmit} className="container">
            <Row>
              <Col md={4} sm={12}>
                <Form.Group className="mb-2" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre"
                    name="nombre"
                    value={localFormData.nombre}
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
                    disabled={isFormDisabled}
                  />
                  <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8} sm={12}>
                <Form.Group className="mb-2" controlId="apellidos">
                  <Form.Label>Apellidos</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tus apellidos"
                    name="apellidos"
                    value={localFormData.apellidos}
                    onChange={handleChange}
                    isInvalid={!!errors.apellidos}
                    disabled={isFormDisabled}
                  />
                  <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4} sm={12}>
                <Form.Group className="mb-2" controlId="edad">
                  <Form.Label>Edad</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingresa tu edad"
                    name="edad"
                    value={localFormData.edad}
                    onChange={handleChange}
                    isInvalid={!!errors.edad}
                    min="18"
                    max="100"
                    disabled={isFormDisabled}
                  />
                  <Form.Control.Feedback type="invalid">{errors.edad}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8} sm={12}>
                <Form.Group className="mb-2" controlId="genero">
                  <Form.Label>Género</Form.Label>
                  <Form.Select
                    name="genero"
                    value={localFormData.genero}
                    onChange={handleChange}
                    isInvalid={!!errors.genero}
                    disabled={isFormDisabled}
                  >
                    <option value="">Selecciona tu género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.genero}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción personal</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ingresa una descripción personal (mínimo 10 caracteres)"
                name="descripcion"
                value={localFormData.descripcion}
                onChange={handleChange}
                isInvalid={!!errors.descripcion}
                disabled={isFormDisabled}
                minLength={10}
              />
              <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
            </Form.Group>

            <Accordion activeKey={accordionOpen ? "0" : null} onSelect={(key) => setAccordionOpen(key === "0")}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Situación personal</Accordion.Header>
                <Accordion.Body>
                  <Row className="mb-3">
                    <Col md={6} sm={12}>
                      <Form.Group controlId="mascotas">
                        <Form.Label>Mascotas</Form.Label>
                        <Form.Select
                          name="mascotas"
                          value={localFormData.mascotas}
                          onChange={handleChange}
                          isInvalid={!!errors.mascotas}
                          disabled={isFormDisabled}
                        >
                          <option value="">Selecciona si tienes mascotas</option>
                          <option value="Sí">Sí</option>
                          <option value="No">No</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.mascotas}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} sm={12}>
                      <Form.Group controlId="fumador">
                        <Form.Label>Fumador</Form.Label>
                        <Form.Select
                          name="fumador"
                          value={localFormData.fumador}
                          onChange={handleChange}
                          isInvalid={!!errors.fumador}
                          disabled={isFormDisabled}
                        >
                          <option value="">Selecciona si eres fumador</option>
                          <option value="Sí">Sí</option>
                          <option value="No">No</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.fumador}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                
                  <Row className="mb-3">
                    <Col md={6} sm={12}>
                      <Form.Group controlId="estadoLaboral">
                        <Form.Label>Estado Laboral</Form.Label>
                        <Form.Select
                          name="estadoLaboral"
                          value={localFormData.estadoLaboral}
                          onChange={handleChange}
                          isInvalid={!!errors.estadoLaboral}
                          disabled={isFormDisabled}
                        >
                          <option value="">Selecciona tu estado laboral</option>
                          <option value="Estudiante">Estudiante</option>
                          <option value="Empleado">Empleado</option>
                          <option value="Desempleado">Desempleado</option>
                          <option value="Otro">Otro</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.estadoLaboral}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} sm={12}>
                      <Form.Group controlId="preferenciaConvivencia">
                        <Form.Label>Preferencias de convivencia</Form.Label>
                        <Form.Select
                          name="preferenciaConvivencia"
                          value={localFormData.preferenciaConvivencia}
                          onChange={handleChange}
                          isInvalid={!!errors.preferenciaConvivencia}
                          disabled={isFormDisabled}
                        >
                          <option value="">Sin preferencia</option>
                          <option value="Solo">Solo</option>
                          <option value="Compartido">Compartido</option>
                          <option value="Familiar">Familiar</option>
                          <option value="Otros">Otros</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.preferenciaConvivencia}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6} sm={12}>
                      <Form.Group controlId="frecuenciaVisitas">
                        <Form.Label>Frecuencia de visitas</Form.Label>
                        <Form.Select
                          name="frecuenciaVisitas"
                          value={localFormData.frecuenciaVisitas}
                          onChange={handleChange}
                          isInvalid={!!errors.frecuenciaVisitas}
                          disabled={isFormDisabled}
                        >
                          <option value="">Sin preferencia</option>
                          <option value="Diarias">Diarias</option>
                          <option value="Semanales">Semanales</option>
                          <option value="Mensuales">Mensuales</option>
                          <option value="Ocasionales">Ocasionales</option>
                          <option value="Nunca">Nunca</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.frecuenciaVisitas}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6} sm={12}>
                      <Form.Group controlId="zonasBusqueda">
                        <Form.Label>Zona de búsqueda</Form.Label>
                        <Form.Select
                          name="zonasBusqueda"
                          value={localFormData.zonasBusqueda}
                          onChange={handleChange}
                          isInvalid={!!errors.zonasBusqueda}
                          disabled={isFormDisabled}
                        >
                          <option value="">Sin preferencia</option>
                          {barriosZaragoza.map((barrio, index) => (
                            <option key={index} value={barrio}>{barrio}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.zonasBusqueda}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col xs={12}>
                      <Form.Label>Intereses y hobbies (separados por comas)</Form.Label>
                      <Form.Control
                        id="interesesHobbies"
                        name="interesesHobbies"
                        value={localFormData.interesesHobbies}
                        onChange={handleChange}
                        placeholder="Ej: Leer, Deporte, Cocinar"
                        aria-label="Intereses y hobbies"
                        isInvalid={!!errors.interesesHobbies}
                        disabled={isFormDisabled}
                      />
                      <Form.Control.Feedback type="invalid">{errors.interesesHobbies}</Form.Control.Feedback>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            {/* Componente reCAPTCHA */}
            <div className="mt-4 mb-3 d-flex justify-content-center">
              <ReCAPTCHA
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                disabled={isFormDisabled}
              />
            </div>

            {/* Mostrar mensaje de bloqueo temporal si aplica */}
            {temporarilyBlocked && (
              <Alert variant="danger" className="mb-3">
                Demasiados intentos fallidos. Por favor, espere {blockTimeRemaining} segundos antes de intentar nuevamente.
              </Alert>
            )}
            
            {/* Error de captcha */}
            {captchaError && (
              <div className="text-center text-danger mb-3">
                {captchaError}
              </div>
            )}

            {/* Mensaje de exito */}
            {registrationSuccess && (
              <Alert variant="success" className="mb-3 mt-3">
                ¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...
              </Alert>
            )}
            
            {/* Mensaje de error */}
            {apiError && (
              <Alert variant="danger" className="mb-3 mt-3">
                {apiError}
              </Alert>
            )}

            {/* Mensaje de intentos fallidos */}
            {!temporarilyBlocked && attemptCount > 0 && (
              <Alert variant="warning" className="mb-3 mt-3">
                Intentos fallidos: {attemptCount}/{MAX_ATTEMPTS}
              </Alert>
            )}

            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="secondary" 
                onClick={handleGoBack}
                disabled={isFormDisabled}
              >
                Atrás
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isFormDisabled}
                style={{
                  borderRadius: "30px",
                  backgroundColor: "#000842",
                  borderColor: "#000842",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {isSubmitting ? 'Creando cuenta...' : isRedirecting ? 'Redirigiendo...' : 'Crear cuenta'}
              </Button>
            </div>
          </Form>
        </div>
      </Card>
    </Container>
  );
}

export default RegisterInfo;