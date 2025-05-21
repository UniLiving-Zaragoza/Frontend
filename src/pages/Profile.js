import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaBriefcase, FaSmoking, FaPaw, FaUsers, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { MdHome } from 'react-icons/md';
import { PencilSquare } from "react-bootstrap-icons";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomNavbar from "../components/CustomNavbar";
import CustomModal from "../components/CustomModal";
import Newimage from "../components/CustomModalPicture";
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Perfil.css";

const API_URL = 'https://uniliving-backend.onrender.com';

const ProfilePage = () => {
    const { logout, isAdmin, user, token } = useAuth();
    const navigate = useNavigate();
    const { id: urlUserId } = useParams();

    // Estados para los modales
    const [showModal, setShowModal] = useState(false);
    const [showDissable, setShowDissable] = useState(false);
    const [showEnable, setShowEnable] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);

    // Estados para gestionar los datos del usuario y la carga
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    
    // Determinar qué ID de usuario mostrar
    const userId = urlUserId || (user && user.id);
    const isOwnProfile = user && user.id === userId;

    // Funciones para los modales
    const handleShowModal = () => setShowModal(true);
    const handleShowDissable = () => setShowDissable(true);
    const handleShowEnable = () => setShowEnable(true);
    const handleCloseModal = () => setShowModal(false);
    const handleCloseDissable = () => setShowDissable(false);
    const handleCloseEnable = () => setShowEnable(false);
    const handleShowImageModal = () => setShowImageModal(true);
    const handleCloseImageModal = () => setShowImageModal(false);

    // Obtener datos del usuario desde la API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!userId) {
                    setError("No se pudo identificar al usuario");
                    setLoading(false);
                    return;
                }

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
    }, [userId, navigate, logout, token]);

    // Cerrar sesión
    const handleCloseSession = async () => {
        await logout();
        navigate('/');
        handleCloseModal();
    }

    // Deshabilitar usuario (para admin)
    const handleDissableUser = async () => {
        try {
            setStatusUpdateLoading(true);
            
            await axios.put(
                `${API_URL}/user/${userId}`,
                { userId: userId, status: 'Disabled' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setUserData({...userData, status: 'Disabled'});
                        
            navigate(-1);
        } catch (error) {
            console.error("Error al deshabilitar usuario:", error);
            alert("Error al deshabilitar el usuario");
        } finally {
            setStatusUpdateLoading(false);
            handleCloseDissable();
        }
    }

    // Habilitar usuario (para admin)
    const handleEnableUser = async () => {
        try {
            setStatusUpdateLoading(true);
            
            await axios.put(
                `${API_URL}/user/${userId}`,
                { userId: userId, status: 'Enabled' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setUserData({...userData, status: 'Enabled'});
                        
            navigate(-1);
        } catch (error) {
            console.error("Error al habilitar usuario:", error);
            alert("Error al habilitar el usuario");
        } finally {
            setStatusUpdateLoading(false);
            handleCloseEnable();
        }
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
            {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
            <Container className="mt-4">
                {/* Cabecera */}
                <Row className="justify-content-center text-center">
                    <Col xs="auto">
                        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
                        <div className="position-relative">
                            <img
                                src={userData?.profilePicture || "https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg"}
                                alt="Perfil"
                                className="rounded-circle img-fluid"
                                style={{ width: "140px", height: "140px", objectFit: "cover", border: "2px solid #000842" }}
                            />
                            {/* Icono de edición */}
                            {isOwnProfile && (
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
                        <div className="ms-md-5 mt-3 mt-md-0 text-md-start text-center">
                            <h4>{userData?.firstName} {userData?.lastName}</h4>
                            <p>
                                Género: {userData?.gender === "Male" ? "Masculino" : userData?.gender === "Female" ? "Femenino" : "Otro"} | Edad: {userData?.age}
                            </p>
                            {/* Mostrar el estado del usuario si el admin está viendo el perfil */}
                            {isAdmin && !isOwnProfile && (
                                <p className={`badge ${userData?.status === "Enabled" ? "bg-success" : "bg-danger"}`}>
                                    Estado: {userData?.status === "Enabled" ? "Habilitado" : "Deshabilitado"}
                                </p>
                            )}
                        </div>
                        </div>
                    </Col>
                </Row>

                {/* Descripción personal */}
                <Row className="justify-content-center mt-5">
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

               <Row className="justify-content-center mt-4">
                    <Col md={10}>
                        <h5 className="mb-3">Situación Personal</h5>
                        <Card className="p-4 shadow-sm rounded-4">

                        {/* Fila 1 */}
                        <Row className="mb-1">
                            <Col md={4}>
                            <FaBriefcase className="me-2 text-primary" />
                            <strong>Estado laboral:</strong>{' '}
                            {
                                userData?.personalSituation?.employmentStatus === 'Employed'
                                ? 'Trabajando'
                                : userData?.personalSituation?.employmentStatus === 'Student'
                                ? 'Estudiante'
                                : userData?.personalSituation?.employmentStatus === 'Unemployed'
                                ? 'Desempleado'
                                : 'Otro'
                            }
                            </Col>
                            <Col md={4}>
                            <FaSmoking className="me-2 text-danger" />
                            <strong>Fumador:</strong>{' '}
                            {userData?.personalSituation?.smoker ? 'Sí' : 'No'}
                            </Col>
                            <Col md={4}>
                            <FaPaw className="me-2 text-warning" />
                            <strong>Mascotas:</strong>{' '}
                            {userData?.personalSituation?.pets ? 'Sí' : 'No'}
                            </Col>
                        </Row>
                        <hr />

                        {/* Fila 2 */}
                        <Row className="mb-1">
                            <Col md={4}>
                            <FaUsers className="me-2 text-info" />
                            <strong>Visitas:</strong>{' '}
                            {
                                userData?.personalSituation?.visitFrequency === 'Daily'
                                ? 'Diaria'
                                : userData?.personalSituation?.visitFrequency === 'Weekly'
                                ? 'Semanal'
                                : userData?.personalSituation?.visitFrequency === 'Monthly'
                                ? 'Mensual'
                                : userData?.personalSituation?.visitFrequency === 'Occasional'
                                ? 'Ocasional'
                                : 'Sin preferencia'
                            }
                            </Col>
                            <Col md={4}>
                            <MdHome className="me-2 text-success" />
                            <strong>Convivencia:</strong>{' '}
                            {
                                userData?.personalSituation?.livingPreference === 'Alone'
                                ? 'Solo'
                                : userData?.personalSituation?.livingPreference === 'Shared'
                                ? 'Compartido'
                                : userData?.personalSituation?.livingPreference === 'Family'
                                ? 'Con familia'
                                : 'Sin preferencia'
                            }
                            </Col>
                            <Col md={4}>
                            <FaMapMarkerAlt className="me-2 text-secondary" />
                            <strong>Zonas de búsqueda:</strong>{' '}
                            {
                                userData?.personalSituation?.zones?.length > 0
                                ? userData.personalSituation.zones.join(', ')
                                : 'Sin preferencia'
                            }
                            </Col>
                        </Row>
                        <hr />

                        {/* Fila 3 */}
                        <Row>
                            <Col>
                            <FaHeart className="me-2 text-danger" />
                            <strong>Intereses y hobbies:</strong>{' '}
                            {
                                userData?.personalSituation?.hobbiesInterests?.length > 0
                                ? userData.personalSituation.hobbiesInterests.join(', ')
                                : 'No especificados'
                            }
                            </Col>
                        </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Botones para usuario viendo su propio perfil */}
                {isOwnProfile && (
                    <Row className="mt-5 d-flex justify-content-center mb-4 gap-3">
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
                )}

                {/* Botones de admin para habilitar/deshabilitar */}
                {isAdmin && !isOwnProfile && userData && (
                    <Row className="mt-4 d-flex justify-content-center mb-4 gap-3">
                        <Col xs={12} md="auto" className="d-flex justify-content-center">
                            {userData.status !== "Disabled" ? (
                                <Button
                                    variant="danger"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px' }}
                                    onClick={handleShowDissable}
                                    disabled={statusUpdateLoading}
                                >
                                    {statusUpdateLoading ? 'Procesando...' : 'Deshabilitar cuenta'}
                                </Button>
                            ) : (
                                <Button
                                    variant="success"
                                    className="rounded-pill px-4 mx-2"
                                    style={{ width: '200px', backgroundColor: "#000842" }}
                                    onClick={handleShowEnable}
                                    disabled={statusUpdateLoading}
                                >
                                    {statusUpdateLoading ? 'Procesando...' : 'Habilitar cuenta'}
                                </Button>
                            )}
                        </Col>
                        <Col xs={12} md="auto" className="d-flex justify-content-center">
                            <Button
                                variant="secondary"
                                className="rounded-pill px-4 mx-2"
                                style={{ width: '200px' }}
                                onClick={() => navigate(-1)}
                            >
                                Volver
                            </Button>
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

