import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { ImBlocked } from "react-icons/im";
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomAdminNavbar from '../components/CustomNavbarAdmin';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BannedUsers = () => {

    // Estado para almacenar los datos de usuarios deshabilitados
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para la interacción con el usuario
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const usersPerPage = 15;

    const { token } = useAuth();

    const API_URL = 'https://uniliving-backend.onrender.com';

    useEffect(() => {

        const fetchDisabledUsers = async () => {
            try {
                setLoading(true);
                
                if (!token) {
                    throw new Error('No hay token de autenticación disponible');
                }
                
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                
                const response = await axios.get(`${API_URL}/user`, config);
                
                // Filtrar solo los usuarios deshabilitados
                const disabledUsers = response.data
                    .filter(user => user.status === "Disabled")
                    .map(user => ({
                        id: user._id,
                        nombre: `${user.firstName} ${user.lastName}`,
                        URL_foto_perfil: user.profilePicture || "https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg"
                    }));
                
                setUsers(disabledUsers);
                setError(null);
            } catch (err) {
                console.error('Error al obtener usuarios deshabilitados:', err);
                setError('No se pudieron cargar los usuarios deshabilitados. Por favor, inténtelo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDisabledUsers();
    }, [token, updateSuccess]);

    // Función para manejar la rehabilitación de un usuario
    const handleEnableUser = async () => {
        if (!selectedUser) return;
        
        try {
            if (!token) {
                throw new Error('No hay token de autenticación disponible');
            }
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            
            await axios.put(`${API_URL}/user/${selectedUser.id}`, 
                { userId: selectedUser.id, status: "Enabled" },
                config
            );
            
            setShowModal(false);
            setSelectedUser(null);
            setUpdateSuccess(!updateSuccess);
            
        } catch (err) {
            console.error('Error al habilitar usuario:', err);
            setError('No se pudo habilitar al usuario. Por favor, inténtelo de nuevo más tarde.');
            setShowModal(false);
        }
    };

    const handleShowModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
            <CustomAdminNavbar />
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
                            <h4 className="mb-1">Usuarios deshabilitados</h4>
                            <p className="text-muted">{filteredUsers.length} Usuarios deshabilitados</p>
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
                
                {/* Mostrar mensaje de error si existe */}
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}
                
                {/* Mostrar indicador de carga mientras se obtienen los datos */}
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
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
                                            <Link to={`/perfil/${user.id}`}>
                                                <img
                                                    src={user.URL_foto_perfil}
                                                    alt={user.nombre}
                                                    className="rounded-circle"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://cdn-icons-png.flaticon.com/512/9387/9387271.png";
                                                    }}
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
                                                >
                                                    Habilitar usuario
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center">
                                    <p>No hay usuarios deshabilitados en el sistema.</p>
                                </Col>
                            )}
                        </Row>
                    </div>
                )}
                
                {/* Componente de paginación */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="pt-1 pb-2">
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    </div>
                )}
            </Container>
            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title={selectedUser ? `Habilitar a ${selectedUser.nombre}` : "Habilitar usuario"}
                bodyText={selectedUser ? `¿Estás seguro que deseas volver a habilitar a ${selectedUser.nombre}?` : "¿Estás seguro que deseas volver a habilitar al usuario?"}
                confirmButtonText="Habilitar usuario"
                onSave={handleEnableUser}
            />
        </div>
    );
};

export default BannedUsers;