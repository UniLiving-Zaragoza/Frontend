import React, { useState } from "react";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CustomNavbar from "../components/CustomNavbar";
import Accordion from 'react-bootstrap/Accordion';
import CustomModal from "../components/CustomModal";
import "../css/Perfil.css";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProfile = () => {
    const location = useLocation();
    const {
        nombre, apellidos, edad, genero, descripcion,
        estadoLaboral, fumador, duracionEstancia, mascotas, frecuenciaVisitas,
        zonasBusqueda, preferenciaConvivencia, interesesHobbies
    } = location.state || {};

    const barriosZaragoza = [
        "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
        "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
        "Centro", "Las Fuentes", "Universidad", "San José",
        "Casablanca", "Torrero-La Paz", "Sur"
    ];

    const [formData, setFormData] = useState({
        nombre: nombre || '',
        apellidos: apellidos || '',
        edad: edad || '',
        genero: genero || '',
        descripcion: descripcion || '',
        estadoLaboral: estadoLaboral || '',
        fumador: fumador || '',
        duracionEstancia: duracionEstancia || '',
        mascotas: mascotas || '',
        frecuenciaVisitas: frecuenciaVisitas || '',
        zonasBusqueda: zonasBusqueda || '',
        preferenciaConvivencia: preferenciaConvivencia || '',
        interesesHobbies: interesesHobbies || ''
    });

    const [errors, setErrors] = useState({});
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

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
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
        if (errors[id]) {
            setErrors(prev => ({ ...prev, [id]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        requiredFields.forEach(field => {
            if (!formData[field] || String(formData[field]).trim() === '') {
                newErrors[field] = 'Este campo es obligatorio';
            }
        });
    
        const accordedFields = ['estadoLaboral', 'fumador', 'mascotas', 'duracionEstancia', 'frecuenciaVisitas', 'zonasBusqueda', 'preferenciaConvivencia', 'interesesHobbies'];
        const shouldOpenAccordion = accordedFields.some(field => newErrors[field]);
    
        setAccordionOpen(shouldOpenAccordion);
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };    

    const handleShowModal = () => {
        if (validateForm()) {
            setShowModal(true);
        }
    };
    
    const handleCloseModal = () => setShowModal(false);

    const handleSaveChanges = () => {
        console.log("Cambios guardados", formData);
        navigate("/perfil");
        handleCloseModal();
    };

    return (
        <div className="App">
            <CustomNavbar />
            <Container className="mt-4 mb-5">
                    <Row className="d-flex justify-content-center text-center mt-3 mb-4">
                        <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                            <div>
                                <h2>Modificar cuenta</h2>
                            </div>
                        </Col>
                    </Row>

                    <Form className="container">
                        <Row className="mb-3">
                            <Col md={4} sm={12}>
                                <Form.Group className="mb-2" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ingresa tu nombre"
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
                                        value={formData.apellidos}
                                        onChange={handleChange}
                                        isInvalid={!!errors.apellidos}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4} sm={12}>
                                <Form.Group className="mb-2" controlId="edad">
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Ingresa tu edad"
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
                                        id="genero"
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

                        <Form.Group className="mb-3" controlId="descripcion">
                            <Form.Label>Descripción personal</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Ingresa una descripción personal"
                                value={formData.descripcion}
                                onChange={handleChange}
                                isInvalid={!!errors.descripcion}
                                rows={4}
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
                                                    id="mascotas"
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
                                                    id="fumador"
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
                                                    id="estadoLaboral"
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
                                                    id="preferenciaConvivencia"
                                                    value={formData.preferenciaConvivencia}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.preferenciaConvivencia}
                                                >
                                                    <option value="">Selecciona preferencia de convivencia</option>
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
                                                    id="frecuenciaVisitas"
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
                                                    id="zonasBusqueda"
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
                                        <Col md={12} sm={12}>
                                            <Form.Group controlId="interesesHobbies">
                                                <Form.Label>Intereses y hobbies</Form.Label>
                                                <Form.Control
                                                    id="interesesHobbies"
                                                    value={formData.interesesHobbies}
                                                    onChange={handleChange}
                                                    placeholder="Intereses y hobbies"
                                                    isInvalid={!!errors.interesesHobbies}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.interesesHobbies}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        <Row className="mt-4 d-flex justify-content-center mb-4 gap-3">
                            <Col xs={12} md="auto" className="d-flex justify-content-center">
                                <Button
                                    variant="light"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px', borderColor: '#000000' }}
                                    as={Link}
                                    to="/perfil"
                                >
                                    Cancelar
                                </Button>
                            </Col>
                            <Col xs={12} md="auto" className="d-flex justify-content-center">
                                <Button
                                    variant="primary"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px', backgroundColor: "#000842", borderColor: '#000842' }}
                                    onClick={handleShowModal}
                                >
                                    Modificar Perfil
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                <CustomModal
                    show={showModal}
                    onHide={handleCloseModal}
                    title="Modificar Perfil"
                    bodyText="¿Quieres guardar las modificaciones?"
                    confirmButtonText="Modificar Perfil"
                    onSave={handleSaveChanges}
                />
            </Container>
        </div>
    );
};

export default EditProfile;