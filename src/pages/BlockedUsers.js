import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import { ImBlocked } from "react-icons/im";
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://uniliving-backend.onrender.com';

const BlockedUsers = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    const usersPerPage = 15;

    useEffect(() => {

        const fetchBlockedUsers = async () => {
            try {
                if (!user || !token) {
                    await logout();
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_URL}/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const blockedUserIds = response.data.blockedUsers;
                
                if (blockedUserIds && blockedUserIds.length > 0) {
                    const blockedUsersDetails = await Promise.all(
                        blockedUserIds.map(async (blockedUser) => {

                            const userId = typeof blockedUser === 'object' ? blockedUser._id : blockedUser;
                            
                            try {
                                const userResponse = await axios.get(`${API_URL}/user/${userId}`, {
                                    headers: {
                                        Authorization: `Bearer ${token}`
                                    }
                                });
                                
                                return {
                                    id: userId,
                                    nombre: `${userResponse.data.firstName} ${userResponse.data.lastName}`,
                                    URL_foto_perfil: userResponse.data.profilePicture || "https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg"
                                };
                            } catch (err) {
                                console.error(`Error al obtener detalles del usuario ${userId}:`, err);
                                
                                return {
                                    id: userId,
                                    nombre: "Usuario no disponible",
                                    URL_foto_perfil: "https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg"
                                };
                            }
                        })
                    );
                    
                    setBlockedUsers(blockedUsersDetails);
                } else {
                    setBlockedUsers([]);
                }
                
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener usuarios bloqueados:", err);
                setError("No se pudieron cargar los usuarios bloqueados. Por favor, inténtalo de nuevo más tarde.");
                setLoading(false);
            }
        };

        fetchBlockedUsers();
    }, [user, token, navigate, logout]);

    const handleShowModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    // Desbloquear usuario
    const handleUnblockUser = async () => {
        if (!selectedUser) return;
        
        try {
            setActionLoading(true);
            
            const currentUserResponse = await axios.get(`${API_URL}/user/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const currentUser = currentUserResponse.data;
            
            const updatedBlockedUsers = currentUser.blockedUsers.filter(
                blockedUser => (typeof blockedUser === 'object' ? blockedUser._id !== selectedUser.id : blockedUser !== selectedUser.id)
            );
            
            await axios.put(
                `${API_URL}/user/${user.id}`,
                { 
                    userId: user.id, 
                    blockedUsers: updatedBlockedUsers
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setBlockedUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
            
            handleCloseModal();
        } catch (error) {
            console.error("Error al desbloquear usuario:", error);
            alert("Error al desbloquear el usuario");
            handleCloseModal();
        } finally {
            setActionLoading(false);
        }
    };

    const filteredData = blockedUsers.filter(user =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

    if (loading) {
        return (
            <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
                <CustomNavbar />
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
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
        <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
            <CustomNavbar />
            <Container className="mt-4 flex-grow-1 d-flex flex-column">
                <Row className="d-flex justify-content-center text-center mb-3">
                    <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                        <div className="rounded-circle img-fluid me-3" style={{ width: "100px", height: "100px" }}>
                            <ImBlocked
                                size={75}
                                style={{ overflow: "visible" }}
                            />
                        </div>
                        <div>
                            <h4 className="mb-1">Usuarios bloqueados</h4>
                            <p className="text-muted">{filteredData.length} Usuarios bloqueados</p>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col xs={12} md={6} className="mx-auto">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Buscar usuario..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    borderTopLeftRadius: '0.375rem',
                                    borderBottomLeftRadius: '0.375rem',
                                    outline: 'none',
                                    boxShadow: 'none'
                                }}
                            />
                            <InputGroup.Text
                                style={{
                                    backgroundColor: '#000842',
                                    color: 'white',
                                    borderTopRightRadius: '0.375rem',
                                    borderBottomRightRadius: '0.375rem',
                                    border: '1px solid #000842'
                                }}
                            >
                                <Search />
                            </InputGroup.Text>
                        </InputGroup>
                    </Col>
                </Row>
                <div className="flex-grow-1 overflow-auto p-3"
                    style={{
                        flexGrow: 1,
                        minHeight: '200px',
                        maxHeight: 'calc(100vh - 310px)',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }}>
                    <Row>
                        {currentUsers.length > 0 ? (
                            currentUsers.map(user => (
                                <Col xs={12} key={user.id} className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Link to={`/perfil/${user.id}`} style={{ textDecoration: 'none' }}>
                                            <img
                                                src={user.URL_foto_perfil}
                                                alt={user.nombre}
                                                className="rounded-circle"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                        </Link>
                                        <div className="d-flex align-items-center justify-content-between w-100 p-2"
                                            style={{
                                                backgroundColor: '#D6EAFF',
                                                border: '0.5px solid #ddd',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                                borderRadius: '10px',
                                                marginLeft: '10px',
                                                minHeight: '55px'
                                            }}>
                                            <Link 
                                                to={`/perfil/${user.id}`} 
                                                style={{ 
                                                textDecoration: 'none', 
                                                color: 'inherit',
                                                }}
                                            >
                                                <span className="ms-3">{user.nombre}</span>
                                            </Link>
                                            <Button
                                                variant="outline-light"
                                                className="ms-3"
                                                onClick={() => handleShowModal(user)}
                                                style={{ backgroundColor: '#000842', color: 'white', borderRadius: '20px', padding: '6px 16px' }}
                                                disabled={actionLoading}
                                            >
                                                Desbloquear
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            ))
                        ) : (
                            <Col xs={12} className="text-center p-5">
                                <p className="text-muted">No tienes usuarios bloqueados actualmente</p>
                            </Col>
                        )}
                    </Row>
                </div>
                {totalPages > 1 && (
                    <div className="pt-1 pb-2">
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    </div>
                )}
                <Row className="mt-3 mb-4">
                    <Col className="d-flex justify-content-center">
                        <Button 
                            variant="secondary" 
                            className="rounded-pill px-4" 
                            style={{ width: '200px' }}
                            onClick={() => navigate(-1)}
                        >
                            Volver
                        </Button>
                    </Col>
                </Row>
            </Container>
            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title={selectedUser ? `Desbloquear a ${selectedUser.nombre}` : "Desbloquear usuario"}
                bodyText={selectedUser ? `¿Estás seguro que deseas desbloquear a ${selectedUser.nombre}? Volverá a poder comunicarse contigo.`
                    : "¿Estás seguro que deseas desbloquear al usuario? Volverá a poder comunicarse contigo."}
                onSave={handleUnblockUser}
                disabled={actionLoading}
                confirmButtonText={actionLoading ? "Procesando..." : "Desbloquear usuario"}
            />
        </div>
    );
};

export default BlockedUsers;