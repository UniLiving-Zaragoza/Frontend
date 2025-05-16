import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaChartBar, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import Pagination from "../components/CustomPagination";
import CustomModal from '../components/CustomModal';
import 'bootstrap/dist/css/bootstrap.min.css';

const AnalyticsCommentsPage = () => {
    const [searchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [newComment, setNewComment] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedBarrio, setSelectedBarrio] = useState('');
    const usersPerPage = 5;

    const { isAuthenticated, isAdmin } = useAuth();

    const barriosZaragoza = [
        "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
        "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
        "Centro", "Las Fuentes", "Universidad", "San José",
        "Casablanca", "Torrero-La Paz", "Sur"
    ];

    const data = [
        { id: 10, nombre: "Paco González", comentario: "comentario", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png" },
        { id: 2, nombre: "Carlos Martínez", comentario: "comentario", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png" },
        { id: 3, nombre: "María Pérez", comentario: "comentario", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png" },
        { id: 4, nombre: "Luis Rodríguez", comentario: "comentario", URL_foto_perfil: "https://upload.wikimedia.org/wikipedia/commons/5/59/4NumberFourInCircle.png" },
        { id: 5, nombre: "Sofía Ramírez", comentario: "comentario", URL_foto_perfil: "https://static.vecteezy.com/system/resources/previews/026/468/774/non_2x/number-5-icon-circle-illustration-on-isolated-white-background-number-five-icon-free-vector.jpg" },
        { id: 6, nombre: "Paco González", comentario: "comentario", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png" },
        { id: 7, nombre: "Carlos Martínez", comentario: "comentario", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png" },
        { id: 8, nombre: "María Pérez", comentario: "comentario", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png" },
        { id: 9, nombre: "Luis Rodríguez", comentario: "comentario", URL_foto_perfil: "https://upload.wikimedia.org/wikipedia/commons/5/59/4NumberFourInCircle.png" },
    ];

    const filteredData = data.filter(user =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const navigate = useNavigate();

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        console.log("Comentario enviado:", newComment);
        setNewComment('');
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleSearch = () => {
        //LUEGO HABRA QUE REDIRIGIR A LA PRINCIPAL APLICANDO LOS FILTROS
        navigate('/principal');
    };

    const handleGraphics = () => {
        navigate('/analiticas-graficos');
    };

    const handleBarrioChange = (e) => {
        const value = e.target.value;
        setSelectedBarrio(value === 'Selecciona un barrio de Zaragoza' ? '' : value);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

    const commentsContainerMaxHeight =
        isAuthenticated && isAdmin
            ? 'calc(100vh - 200px)'
            : isAuthenticated && !isAdmin
            ? 'calc(100vh - 320px)'
            : 'calc(100vh - 265px)';
    
    const searchButtonText = selectedBarrio ? 
        `Buscar piso en ${selectedBarrio}` : 
        'Buscar piso en toda Zaragoza';

    return (
        <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
            {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Container className="mt-3 mb-1">
                    <div className="d-flex justify-content-center">
                        <div style={{ width: '80%', maxWidth: '700px' }}>
                            <Form.Select 
                                aria-label="Selector de barrios" 
                                className="mb-3 shadow-sm"
                                onChange={handleBarrioChange}
                                value={selectedBarrio || 'Selecciona un barrio de Zaragoza'}
                            >
                                <option style={{ fontWeight: 'bold' }}>Selecciona un barrio de Zaragoza</option>
                                {barriosZaragoza.map((barrio, index) => (
                                    <option key={index} value={barrio}>{barrio}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </Container>
                
                {/* Campo de comentario para usuarios logueados */}
                {isAuthenticated && !isAdmin && (
                    <Container className="mb-3 px-4">
                        <Form onSubmit={handleCommentSubmit}>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Escribe tu comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="shadow-sm"
                                />
                                <Button 
                                    type="submit" 
                                    variant="outline-light"
                                    style={{
                                        backgroundColor: '#000842',
                                        borderRadius: '0 5px 5px 0'
                                    }}
                                >
                                    <FaPaperPlane style={{ 
                                        color: 'white', 
                                        pointerEvents: 'none' 
                                    }} />
                                </Button>
                            </InputGroup>
                        </Form>
                    </Container>
                )}
                
                {/* Contenedor de comentarios con altura ajustada dinámicamente */}
                <div className="flex-grow-1 overflow-auto p-3 mx-3"
                    style={{
                        flexGrow: 1,
                        minHeight: '200px',
                        maxHeight: commentsContainerMaxHeight,
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }}>
                    <Row className="p-3">
                        {currentUsers.map(user => (
                            <Col xs={12} key={user.id} className="mb-4">
                                <div className="d-flex align-items-center">
                                    <Link to={`/perfil/${user.id}`}>
                                    <img
                                        src={user.URL_foto_perfil}
                                        alt={user.nombre}
                                        className="rounded-circle"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    />
                                    </Link>

                                    <div
                                        className="d-flex align-items-center justify-content-between flex-grow-1 ms-3 px-3"
                                        style={{
                                            backgroundColor: '#D6EAFF',
                                            border: '0.5px solid #ddd',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                            borderRadius: '10px',
                                            minHeight: '55px',
                                            overflow: 'visible',
                                            flexWrap: 'wrap'     
                                        }}
                                    >
                                        <div className="d-flex flex-column">
                                            <Link
                                                to={`/perfil/${user.id}`}
                                                style={{
                                                textDecoration: 'none',
                                                color: 'inherit',
                                                }}
                                            >
                                                <span className="fw-semibold">{user.nombre}</span>
                                            </Link>

                                            <span
                                                className="text-muted"
                                                style={{
                                                whiteSpace: 'normal',        
                                                overflowWrap: 'break-word', 
                                                wordBreak: 'break-word'     
                                                }}
                                            >
                                                {user.comentario || 'Sin comentarios'}
                                            </span>
                                        </div>
                                        {isAdmin && (
                                            <Button
                                                variant="outline-light"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => handleDeleteClick(user)}
                                                style={{
                                                    backgroundColor: 'white',
                                                    color: 'white',
                                                    borderRadius: '6px',
                                                    padding: '4px 8px',
                                                }}
                                            >
                                                <FaTrash style={{ color: 'red' }} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                <div className="pt-1 pb-2">
                    <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                </div>

                <Container fluid className="mt-4 mb-3">
                    <Row className="align-items-center">

                        <Col sm={4} className="d-none d-sm-block"></Col>
                        
                        {/* Center button */}
                        {!isAdmin && (
                            <Col xs={12} sm={4} className="text-center mb-3 mb-sm-0">
                                <Button
                                    onClick={handleSearch}
                                    variant="outline-light"
                                    style={{
                                        backgroundColor: '#000842',
                                        color: 'white',
                                        borderRadius: '10px',
                                        padding: '6px 16px', 
                                        width: 'auto',
                                        maxWidth: 'none'
                                    }}
                                > 
                                    {searchButtonText}
                                </Button>
                            </Col>
                        )}
                        
                        {/* Right button */}
                        {!isAdmin && (
                                <Col xs={12} sm={4} className="text-center text-sm-end">
                                <Button 
                                    onClick={handleGraphics}
                                    variant="outline-secondary" 
                                    className="d-flex align-items-center mx-auto mx-sm-0 ms-sm-auto"
                                    style={{
                                        borderRadius: '10px',
                                        padding: '6px 16px',
                                        maxWidth: '200px'
                                    }}
                                >
                                    <FaChartBar className="me-2" />
                                    Ver gráficas
                                </Button>
                            </Col>
                        )}
                    </Row>
                </Container>
            </Container>

            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title={selectedUser ? `Eliminar comentario de ${selectedUser.nombre}` : "Eliminar comentario"}
                bodyText={selectedUser ? `¿Estás seguro que deseas eliminar el comentario de ${selectedUser.nombre}?` : "¿Estás seguro que deseas eliminar el comentario?"}
                confirmButtonText="Eliminar comentario"
                onSave={handleCloseModal}
            />
        </div>
    );
};

export default AnalyticsCommentsPage;