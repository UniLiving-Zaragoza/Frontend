import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { ImBlocked } from "react-icons/im";
import CustomNavbar from '../components/CustomNavbar';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";
import { Link } from 'react-router-dom';

const BlockedUsers = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const usersPerPage = 5;
    const data = [
        { id: 10, nombre: "Paco González", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png" },
        { id: 2, nombre: "Carlos Martínez", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png" },
        { id: 3, nombre: "María Pérez", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png" },
        { id: 4, nombre: "Luis Rodríguez", URL_foto_perfil: "https://upload.wikimedia.org/wikipedia/commons/5/59/4NumberFourInCircle.png" },
        { id: 5, nombre: "Sofía Ramírez", URL_foto_perfil: "https://static.vecteezy.com/system/resources/previews/026/468/774/non_2x/number-5-icon-circle-illustration-on-isolated-white-background-number-five-icon-free-vector.jpg" },
        { id: 6, nombre: "Paco González", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png" },
        { id: 7, nombre: "Carlos Martínez", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png" },
        { id: 8, nombre: "María Pérez", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png" },
        { id: 9, nombre: "Luis Rodríguez", URL_foto_perfil: "https://upload.wikimedia.org/wikipedia/commons/5/59/4NumberFourInCircle.png" },
    ];

    const handleShowModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const filteredData = data.filter(user =>
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
                        {currentUsers.map(user => (
                            <Col xs={12} key={user.id} className="mb-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <Link to={`/perfil/${user.id}`}>
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
                                        >
                                            Desbloquear
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className="pt-1 pb-2">
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                </div>
            </Container>
            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title={selectedUser ? `Desbloquear a ${selectedUser.nombre}` : "Desbloquear usuario"}
                bodyText={selectedUser ? `¿Estás seguro que deseas desbloquear a ${selectedUser.nombre}? Volverá a poder comunicarse contigo.`
                    : "¿Estás seguro que deseas desbloquear al usuario? Volverá a poder comunicarse contigo."}
                confirmButtonText="Desbloquear usuario"
                onSave={handleCloseModal}
            />
        </div>
    );
};

export default BlockedUsers;