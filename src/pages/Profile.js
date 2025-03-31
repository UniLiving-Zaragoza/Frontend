import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col, ListGroup } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import CustomNavbar from "../components/CustomNavbar";
import Accordion from 'react-bootstrap/Accordion';
import "../css/Perfil.css";
import CustomModal from "../components/CustomModal";
import Newimage from "../components/CustomModalPicture";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProfilePage = () => {

    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const navigate = useNavigate();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowImageModal = () => setShowImageModal(true);
    const handleCloseImageModal = () => setShowImageModal(false);

    const handleCloseSession = () => {
        // Aquí pones lo que deseas hacer cuando se haga click en el botón de "Confirmar"
        document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; // Eliminar la cookie de sesión. Cambiar a cerrar sesión en el backend
        navigate("/");
        handleCloseModal();
    }

    const handleEditClick = () => {
        // Enviar los datos de "data" al hacer clic en "Modificar Perfil"
        navigate("/editar-perfil", {
            state: data
        });
    };

    const data = {
        nombre: "Laura",
        apellidos: "González",
        edad: 28,
        paisNacimiento: "Colombia",
        genero: "Femenino",
        estadoLaboral: "Trabajando jornada completa",
        fumador: "No",
        duracionEstancia: "Indefinida",
        mascotas: "No",
        frecuenciaVisitas: "Mensual",
        zonasBusqueda: "Actur, Las fuentes",
        preferenciaConvivencia: "Poco ruido",
        interesesHobbies: "Deportes, Viajar",
        textoPerfil: `
          Hola, soy Laura González, tengo 28 años y trabajo como diseñadora UX/UI en una startup tecnológica.
          Actualmente estoy buscando un piso en Madrid, preferiblemente en una zona bien conectada con el centro,
          ya que trabajo en remoto tres días a la semana y necesito un espacio cómodo para ello.
      
          Busco un piso con una habitación independiente, buena iluminación natural y, si es posible, un pequeño
          espacio de trabajo. Me gustaría que estuviera en un barrio tranquilo, pero con acceso a cafeterías,
          gimnasios y transporte público.
      
          Mi presupuesto máximo es de 1.000 euros al mes y, aunque prefiero vivir sola, estoy abierta a compartir
          piso si encuentro compañeros con los que me sienta cómoda. También me interesa que el piso tenga buena
          conexión a internet y, si es posible, que esté amueblado.
      
          Si conoces algún piso que encaje con lo que busco, ¡me encantaría saber más!
        `
    };
    return (
        <div className="App">
            <CustomNavbar />
            <Container className="mt-4">
                {/* Cabecera */}
                <Row className="d-flex justify-content-center text-center">
                    <Col xs={12} md={6} className="d-flex align-items-center">
                        <div className="position-relative">
                            <img
                                src="https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360"
                                alt="Perfil"
                                className="rounded-circle img-fluid"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            {/* Icono de edición */}
                            <PencilSquare
                                className="position-absolute bg-light text-dark p-1 rounded-circle shadow"
                                style={{
                                    bottom: "10px",
                                    right: "20px",
                                    fontSize: "32px",
                                    cursor: "pointer",
                                }}
                                onClick={handleShowImageModal}
                                title="Editar perfil"
                            />
                        </div>
                        <div className="text-start ms-3">
                            <h4>{data.nombre} {data.apellidos}</h4>
                            <p>
                                Género: {data.genero} | Edad: {data.edad} | País de nacimiento: {data.paisNacimiento}
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Cuadro de Texto Central */}
                <Row className="justify-content-center mt-4">
                    <Col md={10}>
                        <Card className="p-3 text-center mb-4">
                            <Card.Text> {data.textoPerfil.split('\n').map((line, index) => (
                                <span key={index}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                            </Card.Text>
                        </Card>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col md={10}>
                        <Accordion className="mt-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Situación personal</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup className="custom-list">
                                        <ListGroup.Item>Estado laboral: {data.estadoLaboral}</ListGroup.Item>
                                        <ListGroup.Item>Fumador: {data.fumador}</ListGroup.Item>
                                        <ListGroup.Item>Duración de la estancia: {data.duracionEstancia}</ListGroup.Item>
                                        <ListGroup.Item>Mascotas: {data.mascotas}</ListGroup.Item>
                                        <ListGroup.Item>Frecuencia de visitas: {data.frecuenciaVisitas}</ListGroup.Item>
                                        <ListGroup.Item>Zonas de búsqueda: {data.zonasBusqueda}</ListGroup.Item>
                                        <ListGroup.Item>Preferencia de convivencia: {data.preferenciaConvivencia}</ListGroup.Item>
                                        <ListGroup.Item>Intereses y hobbies: {data.interesesHobbies}</ListGroup.Item>
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>

                {/* Botones Inferiores */}
                <Row className="mt-4 d-flex justify-content-center mb-4 gap-3">
                    <Col xs={12} md="auto" className="d-flex justify-content-center">
                        <Button
                            variant="danger"
                            className="rounded-pill px-4 mx-2"
                            style={{ width: '200px' }}
                            onClick={handleShowModal}
                        >
                            Cerrar Sesión
                        </Button>
                    </Col>
                    <Col xs={12} md="auto" className="d-flex justify-content-center">
                        <Button
                            variant="primary"
                            className="rounded-pill px-4 mx-2"
                            style={{ width: '200px', backgroundColor: "#000842" }}
                            onClick={handleEditClick}
                        >
                            Modificar Perfil
                        </Button>
                    </Col>
                    <Col xs={12} md="auto" className="d-flex justify-content-center">
                        <Button
                            as={Link} // Hace que el botón sea un enlace
                            to="/usuarios-bloqueados" // Establece la ruta a la que se redirige
                            variant="dark"
                            className="rounded-pill px-4 mx-2"
                            style={{ width: '200px' }}
                        >
                            Usuarios bloqueados
                        </Button>
                    </Col>
                </Row>
                <div style={{ marginBottom: '30px' }}></div>

                {/* Usar el CustomModal */}
                <CustomModal
                    show={showModal}               // Controlar la visibilidad
                    onHide={handleCloseModal}      // Función para cerrar el modal
                    title="Cerrar Sesión"       // Título del modal
                    bodyText="¿Quieres cerrar sesión?"  // Cuerpo del modal
                    confirmButtonText="Cerrar Sesión"    // Texto del botón de confirmar
                    onSave={handleCloseSession}     // Acción que se ejecuta al guardar
                />

                <Newimage
                    show={showImageModal}               // Controlar la visibilidad
                    onHide={handleCloseImageModal}      // Función para cerrar el modal
                    title="Cambiar Foto de Perfil"       // Título del modal
                    imageUrl="https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360"
                    confirmButtonText="Guardar Cambios"    // Texto del botón de confirmar
                    onSave={(newImage) => console.log(newImage)}     // Acción que se ejecuta al guardar
                />
            </Container>
        </div>
    );
};

export default ProfilePage;

