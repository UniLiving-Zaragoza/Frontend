import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import Accordion from 'react-bootstrap/Accordion';
import LogoGrande from "../assets/LogoGrande.png";


function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const barriosZaragoza = [
        "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
        "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
        "Centro", "Las Fuentes", "Universidad", "San José",
        "Casablanca", "Torrero-La Paz", "Sur"
    ];
  
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
                <Form.Group className="mb-2" controlId="nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa tu nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
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
                <Form.Group className="mb-2" controlId="edad">
                  <Form.Label>Edad</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Ingresa tu edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    isInvalid={!!errors.edad}
                    min="0"
                    max="100"
                  />
                  <Form.Control.Feedback type="invalid">{errors.edad}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={8} sm={12}>
                <Form.Group className="mb-2" controlId="genero">
                  <Form.Label>Género</Form.Label>
                  <Form.Select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    isInvalid={!!errors.genero}
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
  
            {/*<Form.Group className="mb-2" controlId="pais">
              <Form.Select
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                isInvalid={!!errors.pais}
              >
                <option value="">País de nacimiento</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.pais}</Form.Control.Feedback>
            </Form.Group>*/}
  
            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción personal</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ingresa una descripción personal"
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
                <Accordion.Body>
                <Row className="mb-3">
                    <Col md={6} sm={12}>
                    <Form.Group controlId="mascotas">
                        <Form.Label>Mascotas</Form.Label>
                        <Form.Select
                        name="mascotas"
                        value={formData.mascotas}
                        onChange={handleChange}
                        isInvalid={!!errors.mascotas}
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
                        value={formData.fumador}
                        onChange={handleChange}
                        isInvalid={!!errors.fumador}
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
                        value={formData.estadoLaboral}
                        onChange={handleChange}
                        isInvalid={!!errors.estadoLaboral}
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
                        value={formData.preferenciaConvivencia}
                        onChange={handleChange}
                        isInvalid={!!errors.preferenciaConvivencia}
                        >
                        <option value="">Selecciona preferecia de convivencia</option>
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
                        value={formData.frecuenciaVisitas}
                        onChange={handleChange}
                        isInvalid={!!errors.frecuenciaVisitas}
                        >
                        <option value="">Selecciona cuando recibes visitas</option>
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
                        value={formData.zonasBusqueda}
                        onChange={handleChange}
                        isInvalid={!!errors.zonasBusqueda}
                        >
                        <option value="">Selecciona la zona donde buscas piso</option>
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
                        <Form.Label>Intereses y hobbies</Form.Label>
                        <Form.Control
                        id="interesesHobbies"
                        name="interesesHobbies"
                        value={formData.interesesHobbies}
                        onChange={handleChange}
                        placeholder="Intereses y hobbies"
                        aria-label="Intereses y hobbies"
                        isInvalid={!!errors.interesesHobbies}
                        />
                        <Form.Control.Feedback type="invalid">{errors.interesesHobbies}</Form.Control.Feedback>
                    </Col>
                </Row>
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