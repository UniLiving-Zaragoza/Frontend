import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col, ListGroup, Spinner, Alert } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomNavbar from "../components/CustomNavbar";
import Accordion from 'react-bootstrap/Accordion';
import CustomModal from "../components/CustomModal";
import Newimage from "../components/CustomModalPicture";
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Perfil.css";

const API_URL = 'https://uniliving-backend.onrender.com';

const ProfilePage = () => {
    const { logout, isAdmin, user } = useAuth();
    const navigate = useNavigate();

    // Estados para los modales
    const [showModal, setShowModal] = useState(false);
    const [showDissable, setShowDissable] = useState(false);
    const [showEnable, setShowEnable] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    // Estados para gestionar los datos del usuario y la carga
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Funciones para los modales
    const handleShowModal = () => setShowModal(true);
    const handleShowDissable = () => setShowDissable(true);
    const handleShowEnable = () => setShowEnable(true);
    const handleCloseModal = () => setShowModal(false);
    const handleCloseDissable = () => setShowDissable(false);
    const handleCloseEnable = () => setShowEnable(false);
    const handleShowImageModal = () => setShowImageModal(true);
    const handleCloseImageModal = () => setShowImageModal(false);

    // ID de usuario
    const userId = user && user.id;

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

                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                setError("Error al cargar los datos del usuario. Por favor, inténtalo de nuevo más tarde.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate, logout]);

    // Cerrar sesión
    const handleCloseSession = async () => {
        await logout();
        navigate('/');
        handleCloseModal();
    }

    // Deshabilitar usuario (para admin)
    const handleDissableUser = () => {
        console.log("Deshabilitar cuenta de usuario"); // Cambiar a deshabilitar en el backend
        navigate(-1); // Volver a la página anterior
        handleCloseModal();
    }

    // Habilitar usuario (para admin)
    const handleEnableUser = () => {
        console.log("Habilitar cuenta de usuario"); // Cambiar a habilitar en el backend
        navigate(-1); // Volver a la página anterior
        handleCloseModal();
    }

    // Navegar a la página de edición de perfil
    const handleEditClick = () => {
        navigate("/editar-perfil", {
            state: userData
        });
    };

    // Renderizar spinner mientras se cargan los datos
    if (loading) {
        return (
            <div className="App">
                {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
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
                {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
                <Container className="mt-4">
                    <Alert variant="danger">
                        {error}
                    </Alert>
                </Container>
            </div>
        );
    }

    // Renderizar la página de perfil con los datos del usuario
    return (
        <div className="App">
            {isAdmin && (
                <CustomNavbarAdmin />
            )}
            {!isAdmin && (
                <CustomNavbar />
            )}
            <Container className="mt-4">
                {/* Cabecera */}
                <Row className="d-flex justify-content-center text-center">
                    <Col xs={12} md={6} className="d-flex align-items-center">
                        <div className="position-relative">
                            <img
                                src={userData?.profilePicture || "https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360"}
                                alt="Perfil"
                                className="rounded-circle img-fluid"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            {/* Icono de edición */}
                            {user && user.id === userId && (
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
                            )}
                        </div>
                        <div className="text-start ms-3">
                            <h4>{userData?.firstName} {userData?.lastName}</h4>
                            <p>
                                Género: {userData?.gender === "Male" ? "Masculino" : userData?.gender === "Female" ? "Femenino" : "Otro"} | Edad: {userData?.age}
                            </p>
                        </div>
                    </Col>
                </Row>

                {/* Descripción personal */}
                <Row className="justify-content-center mt-4">
                    <Col md={10}>
                        <Card className="p-3 text-center mb-4">
                            <Card.Text> 
                                {userData?.personalDescription.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </Card.Text>
                        </Card>
                    </Col>
                </Row>

                {/* Información detallada */}
                <Row className="justify-content-center">
                    <Col md={10}>
                        <Accordion className="mt-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Situación personal</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup className="custom-list">
                                        <ListGroup.Item>
                                            Estado laboral: {
                                                userData?.personalSituation?.employmentStatus === "Employed" ? "Trabajando" :
                                                userData?.personalSituation?.employmentStatus === "Student" ? "Estudiante" :
                                                userData?.personalSituation?.employmentStatus === "Unemployed" ? "Desempleado" : "Otro"
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item>Fumador: {userData?.personalSituation?.smoker ? "Sí" : "No"}</ListGroup.Item>
                                        <ListGroup.Item>Mascotas: {userData?.personalSituation?.pets ? "Sí" : "No"}</ListGroup.Item>
                                        <ListGroup.Item>
                                            Frecuencia de visitas: {
                                                userData?.personalSituation?.visitFrequency === "Daily" ? "Diaria" :
                                                userData?.personalSituation?.visitFrequency === "Weekly" ? "Semanal" :
                                                userData?.personalSituation?.visitFrequency === "Monthly" ? "Mensual" :
                                                userData?.personalSituation?.visitFrequency === "Occasional" ? "Ocasional" : "Nunca"
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Preferencia de convivencia: {
                                                userData?.personalSituation?.livingPreference === "Alone" ? "Solo" :
                                                userData?.personalSituation?.livingPreference === "Shared" ? "Compartido" :
                                                userData?.personalSituation?.livingPreference === "Family" ? "Con familia" : "Otro"
                                            }
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            Intereses y hobbies: {userData?.personalSituation?.hobbiesInterests?.join(", ") || "No especificados"}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>

                {/* Botones para usuario viendo su propio perfil */}
                {user && user.id === userId && (
                    <>
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
                                    as={Link}
                                    to="/usuarios-bloqueados"
                                    variant="dark"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px' }}
                                >
                                    Usuarios bloqueados
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}

                {/* Botones de admin para habilitar/deshabilitar */}
                {isAdmin && userData && (
                    <Row className="mt-4 d-flex justify-content-center mb-4 gap-3">
                        <Col xs={12} md="auto" className="d-flex justify-content-center">
                            {userData.status !== "Disabled" ? (
                                <Button
                                    variant="danger"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px' }}
                                    onClick={handleShowDissable}
                                >
                                    Deshabilitar cuenta
                                </Button>
                            ) : (
                                <Button
                                    variant="success"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px', backgroundColor: "#000842" }}
                                    onClick={handleShowEnable}
                                >
                                    Habilitar cuenta
                                </Button>
                            )}
                        </Col>
                    </Row>
                )}
                
                <div style={{ marginBottom: '30px' }}></div>
                
                {/* Modales */}
                <CustomModal
                    show={showModal}
                    onHide={handleCloseModal}
                    title="Cerrar Sesión"
                    bodyText="¿Quieres cerrar sesión?"
                    confirmButtonText="Cerrar Sesión"
                    onSave={handleCloseSession}
                />

                <CustomModal
                    show={showDissable}
                    onHide={handleCloseDissable}
                    title={`Deshabilitar la cuenta de ${userData?.firstName} ${userData?.lastName}`}
                    bodyText={`Vas a deshabilitar la cuenta de ${userData?.firstName} ${userData?.lastName}, no podrá volver a acceder a ella ¿Continuar?`}
                    confirmButtonText="Deshabilitar"
                    onSave={handleDissableUser}
                />

                <CustomModal
                    show={showEnable}
                    onHide={handleCloseEnable}
                    title={`Habilitar la cuenta de ${userData?.firstName} ${userData?.lastName}`}
                    bodyText={`Vas a habilitar la cuenta de ${userData?.firstName} ${userData?.lastName}, podrá volver a acceder a ella ¿Continuar?`}
                    confirmButtonText="Habilitar"
                    onSave={handleEnableUser}
                />

                <Newimage
                    show={showImageModal}
                    onHide={handleCloseImageModal}
                    title="Cambiar Foto de Perfil"
                    imageUrl={userData?.profilePicture}
                    confirmButtonText="Guardar Cambios"
                    onSave={async (newImageUrl) => {
                        try {
                            const token = sessionStorage.getItem('authToken');
                            await axios.put(`${API_URL}/user/${userId}`, 
                                { userId: userId, profilePicture: newImageUrl },
                                {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                }
                            );
                            // Actualizar el userData localmente para reflejar el cambio sin recargar
                            setUserData({...userData, profilePicture: newImageUrl});
                            handleCloseImageModal();
                        } catch (error) {
                            console.error("Error al actualizar la foto de perfil:", error);
                            alert("Error al actualizar la foto de perfil");
                        }
                    }}
                />
            </Container>
        </div>
    );
};

export default ProfilePage;

