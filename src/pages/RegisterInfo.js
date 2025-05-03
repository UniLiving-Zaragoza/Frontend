import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import Accordion from 'react-bootstrap/Accordion';
import LogoGrande from "../assets/LogoGrande.png";


function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
      nombre: '',
      apellidos: '',
      edad: '',
      genero: '',
      pais: '',
      descripcion: '',
      estadoLaboral: '',
      fumador: '',
      duracionEstancia: '',
      mascotas: '',
      frecuenciaVisitas: '',
      zonasBusqueda: '',
      preferenciaConvivencia: '',
      interesesHobbies: ''
    });
  
    const [errors, setErrors] = useState({});
    const [accordionOpen, setAccordionOpen] = useState(false);
  
    const requiredFields = [
      'nombre',
      'apellidos',
      'edad',
      'genero',
      'pais',
      'fumador',
      'mascotas',
      'estadoLaboral'
    ];
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
      }
    };
  
    const validateForm = () => {
      const newErrors = {};
      requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
          newErrors[field] = 'Este campo es obligatorio';
        }
      });
  
      // Abrir acordeón si algún campo dentro de él tiene error
      const accordedFields = ['estadoLaboral', 'fumador', 'mascotas', 'duracionEstancia', 'frecuenciaVisitas', 'zonasBusqueda', 'preferenciaConvivencia', 'interesesHobbies'];
      const shouldOpenAccordion = accordedFields.some(field => newErrors[field]);
  
      setAccordionOpen(shouldOpenAccordion);
      setErrors(newErrors);
  
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      console.log('Formulario enviado:', formData);
      await register();
      navigate("/principal");
    };
  
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '850px', maxHeight: '90vh', padding: '2rem' }} className="shadow">
          <div style={{ height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
            <div className="d-flex justify-content-center mb-4">
              <img 
                src={LogoGrande} 
                alt="UniLiving Logo" 
                className="img-fluid" 
                style={{ maxWidth: "100%", height: "auto", maxHeight: "120px" }} 
              />
            </div>
    
            <h4 className="text-center mb-4">Crear una cuenta</h4>
            
          <Form onSubmit={handleSubmit} className="container">
            <Row>
              <Col md={4} sm={12}>
                <Form.Group className="mb-3" controlId="nombre">
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8} sm={12}>
                <Form.Group className="mb-3" controlId="apellidos">
                  <Form.Control
                    type="text"
                    placeholder="Apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    isInvalid={!!errors.apellidos}
                  />
                  <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <Row>
              <Col md={4} sm={12}>
                <Form.Group className="mb-3" controlId="edad">
                  <Form.Control
                    type="number"
                    placeholder="Edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    isInvalid={!!errors.edad}
                  />
                  <Form.Control.Feedback type="invalid">{errors.edad}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8} sm={12}>
                <Form.Group className="mb-3" controlId="genero">
                  <Form.Select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    isInvalid={!!errors.genero}
                  >
                    <option value="">Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.genero}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
  
            <Form.Group className="mb-3" controlId="pais">
              <Form.Select
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                isInvalid={!!errors.pais}
              >
                <option value="">País de nacimiento</option>
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.pais}</Form.Control.Feedback>
            </Form.Group>
  
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Control
                as="textarea"
                placeholder="Descripción personal"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                isInvalid={!!errors.descripcion}
              />
              <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
            </Form.Group>
  
            <Accordion activeKey={accordionOpen ? "0" : null} onSelect={(key) => setAccordionOpen(key === "0")}>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Situación personal</Accordion.Header>
                <Accordion.Body className="p-0">
                  <div style={{ padding: '1rem' }}>
                    {[
                      { name: 'estadoLaboral', placeholder: 'Estado laboral' },
                      { name: 'fumador', placeholder: 'Fumador' },
                      { name: 'mascotas', placeholder: 'Mascotas' },
                      { name: 'duracionEstancia', placeholder: 'Duración de la estancia' },
                      { name: 'frecuenciaVisitas', placeholder: 'Frecuencia de visitas' },
                      { name: 'zonasBusqueda', placeholder: 'Zonas de búsqueda' },
                      { name: 'preferenciaConvivencia', placeholder: 'Preferencia de convivencia' },
                      { name: 'interesesHobbies', placeholder: 'Intereses y hobbies' }
                    ].map(({ name, placeholder }) => (
                      <Row className="mb-3" key={name}>
                        <Col xs={12}>
                          <Form.Control
                            id={name}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            aria-label={placeholder}
                            isInvalid={!!errors[name]}
                          />
                          <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
  
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate(-1)}>Atrás</Button>
              <Button
                variant="primary"
                type="submit"
                style={{
                  borderRadius: "30px",
                  backgroundColor: "#000842",
                  borderColor: "#000842",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                Crear cuenta
              </Button>
            </div>
          </Form>
          </div>
        </Card>
      </Container>
    );
  }
  
  export default RegisterPage;
