import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomNavbar from "../components/CustomNavbar";
import Accordion from 'react-bootstrap/Accordion';
import CustomModal from "../components/CustomModal";
import axios from "axios";
import "../css/Perfil.css";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = 'https://uniliving-backend.onrender.com';

const barriosZaragoza = [
    "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
    "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
    "Centro", "Las Fuentes", "Universidad", "San José",
    "Casablanca", "Torrero-La Paz", "Sur"
];

const EditProfile = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const userId = user && user.id;

    // Estados para gestionar los datos y la carga
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const [accordionOpen, setAccordionOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Obtener datos del usuario desde la API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) {
                    setError("No se pudo identificar al usuario");
                    setLoading(false);
                    return;
                }

                const token = sessionStorage.getItem('authToken');
                if (!token) {
                    await logout();
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_URL}/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // Inicializar el formulario con los datos del usuario
                setFormData({
                    nombre: response.data.firstName || '',
                    apellidos: response.data.lastName || '',
                    edad: response.data.age || '',
                    genero: mapearGenero(response.data.gender, 'toSpanish') || '',
                    descripcion: response.data.personalDescription || '',
                    estadoLaboral: mapearEstadoLaboral(response.data.personalSituation?.employmentStatus, 'toSpanish') || '',
                    fumador: response.data.personalSituation?.smoker ? 'Sí' : 'No',
                    mascotas: response.data.personalSituation?.pets ? 'Sí' : 'No',
                    frecuenciaVisitas: mapearFrecuenciaVisitas(response.data.personalSituation?.visitFrequency, 'toSpanish') || '',
                    preferenciaConvivencia: mapearPreferenciaConvivencia(response.data.personalSituation?.livingPreference, 'toSpanish') || '',
                    interesesHobbies: response.data.personalSituation?.hobbiesInterests?.join(', ') || '',
                    zonasBusqueda: response.data.personalSituation?.zones?.length > 0 ? barriosZaragoza[0] : ''
                });
                
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                setError("Error al cargar los datos del usuario. Por favor, inténtalo de nuevo más tarde.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate, logout]);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        edad: '',
        genero: '',
        descripcion: '',
        estadoLaboral: '',
        fumador: '',
        mascotas: '',
        frecuenciaVisitas: '',
        preferenciaConvivencia: '',
        interesesHobbies: '',
        zonasBusqueda: ''
    });

    // Funciones para mapear valores entre el frontend (español) y el backend (inglés)
    const mapearGenero = (valor, direccion) => {
        const mapeo = {
            'Male': 'Masculino',
            'Female': 'Femenino',
            'Other': 'Otro'
        };
        
        if (direccion === 'toEnglish') {
            for (const [key, value] of Object.entries(mapeo)) {
                if (value === valor) return key;
            }
            return 'Other';
        } else {
            return mapeo[valor] || '';
        }
    };

    const mapearEstadoLaboral = (valor, direccion) => {
        const mapeo = {
            'Student': 'Estudiante',
            'Employed': 'Empleado',
            'Unemployed': 'Desempleado',
            'Other': 'Otro'
        };
        
        if (direccion === 'toEnglish') {
            for (const [key, value] of Object.entries(mapeo)) {
                if (value === valor) return key;
            }
            return 'Other';
        } else {
            return mapeo[valor] || '';
        }
    };

    const mapearFrecuenciaVisitas = (valor, direccion) => {
        const mapeo = {
            'Daily': 'Diarias',
            'Weekly': 'Semanales',
            'Monthly': 'Mensuales',
            'Occasional': 'Ocasionales',
            'Never': 'Nunca'
        };
        
        if (direccion === 'toEnglish') {
            for (const [key, value] of Object.entries(mapeo)) {
                if (value === valor) return key;
            }
            return 'Occasional';
        } else {
            return mapeo[valor] || '';
        }
    };

    const mapearPreferenciaConvivencia = (valor, direccion) => {
        const mapeo = {
            'Alone': 'Solo',
            'Shared': 'Compartido',
            'Family': 'Familiar',
            'Other': 'Otros'
        };
        
        if (direccion === 'toEnglish') {
            for (const [key, value] of Object.entries(mapeo)) {
                if (value === valor) return key;
            }
            return 'Other';
        } else {
            return mapeo[valor] || '';
        }
    };

    const [errors, setErrors] = useState({});

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

    const handleSaveChanges = async () => {
        setSaving(true);
        setSaveError(null);
        
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            
            // Preparar los datos para enviar al backend
            const updateData = {
                userId: userId,
                firstName: formData.nombre,
                lastName: formData.apellidos,
                age: parseInt(formData.edad),
                gender: mapearGenero(formData.genero, 'toEnglish'),
                personalDescription: formData.descripcion,
                personalSituation: {
                    smoker: formData.fumador === 'Sí',
                    pets: formData.mascotas === 'Sí',
                    employmentStatus: mapearEstadoLaboral(formData.estadoLaboral, 'toEnglish'),
                    visitFrequency: mapearFrecuenciaVisitas(formData.frecuenciaVisitas, 'toEnglish'),
                    livingPreference: mapearPreferenciaConvivencia(formData.preferenciaConvivencia, 'toEnglish'),
                    hobbiesInterests: formData.interesesHobbies.split(',').map(item => item.trim()).filter(item => item)
                }
            };
            
            // Llamada a la API para actualizar
            await axios.put(`${API_URL}/user/${userId}`, updateData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            navigate("/perfil");
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            setSaveError("Error al guardar los cambios. Por favor, inténtalo de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    // Renderizar spinner mientras se cargan los datos
    if (loading) {
        return (
            <div className="App">
                <CustomNavbar />
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Container>
            </div>
        );
    }

    // Renderizar mensaje de error si hay algún problema
    if (error) {
        return (
            <div className="App">
                <CustomNavbar />
                <Container className="mt-4">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                </Container>
            </div>
        );
    }

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
                                        disabled={saving}
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
                                        disabled={saving}
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
                                        min="18"
                                        max="100"
                                        disabled={saving}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.edad}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={8} sm={12}>
                                <Form.Group className="mb-2" controlId="genero">
                                    <Form.Label>Género</Form.Label>
                                    <Form.Select
                                        value={formData.genero}
                                        onChange={handleChange}
                                        isInvalid={!!errors.genero}
                                        disabled={saving}
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
                                disabled={saving}
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
                                                    value={formData.mascotas}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.mascotas}
                                                    disabled={saving}
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
                                                    value={formData.fumador}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.fumador}
                                                    disabled={saving}
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
                                                    value={formData.estadoLaboral}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.estadoLaboral}
                                                    disabled={saving}
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
                                                    value={formData.preferenciaConvivencia}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.preferenciaConvivencia}
                                                    disabled={saving}
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
                                                    value={formData.frecuenciaVisitas}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.frecuenciaVisitas}
                                                    disabled={saving}
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
                                                    value={formData.zonasBusqueda}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.zonasBusqueda}
                                                    disabled={saving}
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
                                                    value={formData.interesesHobbies}
                                                    onChange={handleChange}
                                                    placeholder="Intereses y hobbies (separados por comas)"
                                                    isInvalid={!!errors.interesesHobbies}
                                                    disabled={saving}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.interesesHobbies}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        {saveError && (
                            <Alert variant="danger" className="mb-3 mt-3">
                                {saveError}
                            </Alert>
                        )}

                        <Row className="mt-4 d-flex justify-content-center mb-4 gap-3">
                            <Col xs={12} md="auto" className="d-flex justify-content-center">
                                <Button
                                    variant="light"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px', borderColor: '#000000' }}
                                    as={Link}
                                    to="/perfil"
                                    disabled={saving}
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
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Guardando...
                                        </>
                                    ) : (
                                        "Modificar Perfil"
                                    )}
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