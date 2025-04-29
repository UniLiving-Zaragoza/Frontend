import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import Accordion from 'react-bootstrap/Accordion';
import LogoGrande from "../assets/LogoGrande.png";

// FALTA ESTRUCUTRAR IGUAL QUE MODIFICAR EL PERFIL, CON EL MISMO ACORDEÓN
// FALTAN VERIFICACIONES Y DEFINIR QUE CAMPOS CON OBLIGATORIOS
// NO SE GUARDAN LOS CAMPOS ENTRE LAS DOS PÁGINAS DE REGISTRO

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);

    // FALTAN VERIFICACIONES IGUAL QUE EN Register.js **************

    document.cookie = "session=true; path=/; max-age=3600"; // Expira en 1 hora. Cambiar a guardar las variables de sesión en el backend

    await register();
    navigate("/principal"); // Redirigir a la página principal

  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '600px', padding: '2rem' }} className="shadow">
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
                    required 
                    />
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
                    required 
                    />
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
                    required 
                    />
                </Form.Group>
                </Col>
                <Col md={8} sm={12}>
                <Form.Group className="mb-3" controlId="genero">
                    <Form.Select name="genero" value={formData.genero} onChange={handleChange} required>
                    <option value="">Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                    </Form.Select>
                </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3" controlId="pais">
                    <Form.Select name="pais" value={formData.pais} onChange={handleChange} required>
                    <option value="">País de nacimiento</option>
                    <option value="España">España</option>
                    <option value="México">México</option>
                    <option value="Argentina">Argentina</option>
                    </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
                <Form.Control 
                as="textarea" 
                placeholder="Descripción personal" 
                name="descripcion" 
                value={formData.descripcion} 
                onChange={handleChange} 
                />
            </Form.Group>

            {/* Acordeón para información adicional */}
            <Accordion defaultActiveKey="0">
                <Card>
                    <Accordion.Header>Situación personal</Accordion.Header>
                    <Accordion.Body>
                        {/* Estado laboral */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="estadoLaboral"
                                    name="estadoLaboral"
                                    value={formData.estadoLaboral}
                                    onChange={handleChange}
                                    placeholder="Estado laboral"
                                    aria-label="Estado laboral"
                                />
                            </Col>
                        </Row>

                        {/* Fumador */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="fumador"
                                    name="fumador"
                                    value={formData.fumador}
                                    onChange={handleChange}
                                    placeholder="Fumador"
                                    aria-label="Fumador"
                                />
                            </Col>
                        </Row>

                        {/* Duración de la estancia */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="duracionEstancia"
                                    name="duracionEstancia"
                                    value={formData.duracionEstancia}
                                    onChange={handleChange}
                                    placeholder="Duración de la estancia"
                                    aria-label="Duración de la estancia"
                                />
                            </Col>
                        </Row>

                        {/* Mascotas */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="mascotas"
                                    name="mascotas"
                                    value={formData.mascotas}
                                    onChange={handleChange}
                                    placeholder="Mascotas"
                                    aria-label="Mascotas"
                                />
                            </Col>
                        </Row>

                        {/* Frecuencia de visitas */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="frecuenciaVisitas"
                                    name="frecuenciaVisitas"
                                    value={formData.frecuenciaVisitas}
                                    onChange={handleChange}
                                    placeholder="Frecuencia de visitas"
                                    aria-label="Frecuencia de visitas"
                                />
                            </Col>
                        </Row>

                        {/* Zonas de búsqueda */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="zonasBusqueda"
                                    name="zonasBusqueda"
                                    value={formData.zonasBusqueda}
                                    onChange={handleChange}
                                    placeholder="Zonas de búsqueda"
                                    aria-label="Zonas de búsqueda"
                                />
                            </Col>
                        </Row>

                        {/* Preferencia de convivencia */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="preferenciaConvivencia"
                                    name="preferenciaConvivencia"
                                    value={formData.preferenciaConvivencia}
                                    onChange={handleChange}
                                    placeholder="Preferencia de convivencia"
                                    aria-label="Preferencia de convivencia"
                                />
                            </Col>
                        </Row>

                        {/* Intereses y hobbies */}
                        <Row className="mb-3">
                            <Col xs={12}>
                                <Form.Control
                                    id="interesesHobbies"
                                    name="interesesHobbies"
                                    value={formData.interesesHobbies}
                                    onChange={handleChange}
                                    placeholder="Intereses y hobbies"
                                    aria-label="Intereses y hobbies"
                                />
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Card>
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
      </Card>
    </Container>
  );
}

export default RegisterPage;