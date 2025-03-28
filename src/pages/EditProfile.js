import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Form, Row, Col, InputGroup, Card } from "react-bootstrap";
import CustomNavbar from "../components/CustomNavbar";
import Accordion from 'react-bootstrap/Accordion';
import "../css/Perfil.css";
import CustomModal from "../components/CustomModal";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const EditProfilePedad = () => {
    const location = useLocation();
    const { nombre, apellidos, edad, genero, paisNacimiento, textoPerfil, estadoLaboral, fumador, duracionEstancia, mascotas, frecuenciaVisitas, zonasBusqueda, preferenciaConvivencia, interesesHobbies
    } = location.state || {};

    const [formData, setFormData] = useState({
        nombre: nombre || '',
        apellidos: apellidos || '',
        edad: edad || '',
        genero: genero || '',
        paisNacimiento: paisNacimiento || '',
        textoPerfil: textoPerfil || '',
        estadoLaboral: estadoLaboral || '',
        fumador: fumador || '',
        duracionEstancia: duracionEstancia || '',
        mascotas: mascotas || '',
        frecuenciaVisitas: frecuenciaVisitas || '',
        zonasBusqueda: zonasBusqueda || '',
        preferenciaConvivencia: preferenciaConvivencia || '',
        interesesHobbies: interesesHobbies || ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleSaveChanges = () => {
        console.log("Cambios guardados"); //Aqui seria operacion update en base de datos
        navigate("/perfil");
        handleCloseModal();
    }

    return (
        <div className="App">
            <CustomNavbar />
            <Container className="mt-4">
                <div>
                    <div>
                        {/* Cabecera */}
                        <Row className="d-flex justify-content-center text-center mt-3 mb-3">
                            <Col xs={12} md={6} className="d-flex justify-content-center align-items-center">
                                <div>
                                    <h4>Modificar cuenta</h4>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Primera línea: Nombre y Apellidos */}
                    <Row className="mb-3">
                        <Col xs={6}>
                            <Form.Label htmlFor="nombre">Nombre</Form.Label>
                            <Form.Control
                                id="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                aria-label="Nombre"
                            />
                        </Col>
                        <Col xs={6}>
                            <Form.Label htmlFor="apellidos">Apellidos</Form.Label>
                            <Form.Control
                                id="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                placeholder="Apellidos"
                                aria-label="Apellidos"
                            />
                        </Col>
                    </Row>

                    {/* Segunda línea: Edad, Género, País de nacimiento */}
                    <Row className="mb-3">
                        <Col xs={4}>
                            <Form.Label htmlFor="edad">Edad</Form.Label>
                            <Form.Control
                                id="edad"
                                value={formData.edad}
                                onChange={handleChange}
                                placeholder="Edad"
                                aria-label="Edad"
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Label htmlFor="genero">Género</Form.Label>
                            <Form.Control
                                id="genero"
                                value={formData.genero}
                                onChange={handleChange}
                                placeholder="Género"
                                aria-label="Género"
                            />
                        </Col>
                        <Col xs={4}>
                            <Form.Label htmlFor="paisNacimiento">País de Nacimiento</Form.Label>
                            <Form.Control
                                id="paisNacimiento"
                                value={formData.paisNacimiento}
                                onChange={handleChange}
                                placeholder="País de Nacimiento"
                                aria-label="País de Nacimiento"
                            />
                        </Col>
                    </Row>

                    {/* Tercera línea: Descripción personal */}
                    <Form.Label htmlFor="textoPerfil">Descripción Personal</Form.Label>
                    <InputGroup className="mb-3">
                        <Form.Control
                            as="textarea"
                            value={formData.textoPerfil}
                            onChange={handleChange}
                            id="textoPerfil"
                            aria-label="Descripción personal"
                            placeholder="Escribe tu descripción personal..."
                            rows={6}
                        />
                    </InputGroup>

                    {/* Acordeón para información adicional */}
                    <Accordion defaultActiveKey="0">
                        <Card>
                            <Accordion.Header>Situación personal</Accordion.Header>
                            <Accordion.Body>
                                {/* Estado laboral */}
                                <Row className="mb-3">
                                    <Col xs={12}>
                                        <Form.Label htmlFor="estadoLaboral">Estado laboral</Form.Label>
                                        <Form.Control
                                            id="estadoLaboral"
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
                                        <Form.Label htmlFor="fumador">Fumador</Form.Label>
                                        <Form.Control
                                            id="fumador"
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
                                        <Form.Label htmlFor="duracionEstancia">Duración de la estancia</Form.Label>
                                        <Form.Control
                                            id="duracionEstancia"
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
                                        <Form.Label htmlFor="mascotas">Mascotas</Form.Label>
                                        <Form.Control
                                            id="mascotas"
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
                                        <Form.Label htmlFor="frecuenciaVisitas">Frecuencia de visitas</Form.Label>
                                        <Form.Control
                                            id="frecuenciaVisitas"
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
                                        <Form.Label htmlFor="zonasBusqueda">Zonas de búsqueda</Form.Label>
                                        <Form.Control
                                            id="zonasBusqueda"
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
                                        <Form.Label htmlFor="preferenciaConvivencia">Preferencia de convivencia</Form.Label>
                                        <Form.Control
                                            id="preferenciaConvivencia"
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
                                        <Form.Label htmlFor="interesesHobbies">Intereses y hobbies</Form.Label>
                                        <Form.Control
                                            id="interesesHobbies"
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
                </div>

                {/* Botones Inferiores */}
                <Row className="mt-4 d-flex justify-content-center mb-4">
                    <Col xs="auto" className="d-flex justify-content-center">
                        <Button variant="light" className="rounded-pill px-4" style={{ width: '200px', borderColor: '#000000' }} as={Link} to="/perfil" >
                            Cancelar
                        </Button>
                    </Col>
                    <Col xs="auto" className="d-flex justify-content-center" style={{ marginLeft: '50px', marginRight: '50px', }} onClick={handleShowModal}>
                        <Button variant="primary" className="rounded-pill px-4" style={{ width: '200px', backgroundColor: "#000842", borderColor: '#000842' }}>
                            Modificar Perfil
                        </Button>
                    </Col>
                </Row>
                <div style={{ marginBottom: '30px' }}></div>

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

export default EditProfilePedad;