import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, InputGroup  } from 'react-bootstrap';
import { FaChartBar, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import Pagination from "../components/CustomPagination";
import CustomModal from '../components/CustomModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { io } from "socket.io-client";

const AnalyticsCommentsPage = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [newComment, setNewComment] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const initialBarrio = location.state?.barrio || '';
    const [selectedBarrio, setSelectedBarrio] = useState(initialBarrio);
    const [comments, setComments] = useState([]);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const usersPerPage = 5; //TODO: Ampliar en producción
    const socket = io("https://uniliving-backend.onrender.com");

    const { isAuthenticated, isAdmin, user, token } = useAuth();

    const barriosZaragoza = [
        "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
        "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
        "Centro", "Las Fuentes", "Universidad", "San José",
        "Casablanca", "Torrero-La Paz", "Sur"
    ];

    useEffect(() => {
    if (selectedBarrio) {
        axios
        .get(`https://uniliving-backend.onrender.com/zones/by-name/${encodeURIComponent(selectedBarrio)}/comment/Visible`)
        .then((res) => {
            const sortedComments = res.data.data.sort(
            (a, b) =>  new Date(b.createdAt) - new Date(a.createdAt) 
            );
            setComments(sortedComments);
            console.log("Comentarios ordenados:", sortedComments);
            setCurrentPage(1);
        })
        .catch((err) => {
            console.error(err);
        });
    } else {
        setComments([]);
    }
    }, [selectedBarrio,socket]);
    
    useEffect(() => {
        if (selectedBarrio) {
            socket.emit('joinZone', selectedBarrio);
        }
    }, [selectedBarrio]);

    useEffect(() => {
        if (!selectedBarrio) return;

        const eventName = `zone:commentAdded:${selectedBarrio}`;

        const handler = (newComment) => {
            setComments((prev) => [newComment, ...prev]); 
        };

        socket.on(eventName, handler);

        return () => {
            socket.off(eventName, handler); // limpia al cambiar de zona
        };
    }, [selectedBarrio, socket]);



    const totalPages = Math.ceil(comments.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const navigate = useNavigate();

    const handleCommentSubmit = async (e) => {
    e.preventDefault();

        if (!newComment.trim()) return; // Evita enviar comentarios vacíos

        try {
            const response = await fetch(`https://uniliving-backend.onrender.com/zones/name/${selectedBarrio}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: newComment,
                    userId: user.id, // Asumiendo que tienes un currentUser definido
                }),
            });

            if (!response.ok) throw new Error('Error al enviar el comentario');

            const savedComment = await response.json();

            setNewComment('');
            setComments(prev => [...prev, savedComment]); // Asumiendo que tienes `setComments`

        } catch (error) {
            console.error('Fallo al enviar el comentario:', error.message);
            // Podrías mostrar una alerta al usuario si lo deseas
        }
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
        //LUEGO HABRA QUE REDIRIGIR A LA PRINCIPAL APLICANDO LOS FILTROS TODO
        navigate('/principal');
    };

    const handleGraphics = () => {
        //TODO: Implementar la lógica para redirigir a la página de gráficos
        navigate('/analiticas-graficos');
    };

    const handleBarrioChange = (e) => {
        const value = e.target.value;
        setSelectedBarrio(value === 'Selecciona un barrio de Zaragoza' ? '' : value);
    };

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentComments = comments.slice(indexOfFirst, indexOfLast);


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
                                    disabled={!newComment.trim()}
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
                        {comments.length === 0 ? (
                            <Col xs={12}>
                                <p className="text-center text-muted">No hay comentarios disponibles.</p>
                            </Col>
                        ) : (
                            [...currentComments].reverse().map(comment => (
                                <Col xs={12} key={comment._id} className="mb-4">
                                    <div className="d-flex align-items-center">
                                        <Link to={`/perfil/${comment.user._id}`}>
                                            <img
                                                src={comment.user.profilePicture || 'https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360'}
                                                alt={`${comment.user.firstName} ${comment.user.lastName}`}
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
                                                to={`/perfil/${comment.user._id}`}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                }}
                                            >
                                                <span className="fw-semibold">
                                                    {comment.user.firstName} {comment.user.lastName}
                                                </span>
                                            </Link>

                                            <span
                                                className="text-muted"
                                                style={{
                                                    whiteSpace: 'normal',
                                                    overflowWrap: 'break-word',
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {comment.content}
                                            </span>

                                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                                {(() => {
                                                    const date = new Date(comment.createdAt);
                                                    const today = new Date();
                                                    const isToday =
                                                        date.getDate() === today.getDate() &&
                                                        date.getMonth() === today.getMonth() &&
                                                        date.getFullYear() === today.getFullYear();

                                                    return isToday
                                                        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
                                                })()}
                                            </span>
                                        </div>
                                            {isAdmin && (
                                                <Button
                                                    variant="outline-light"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleDeleteClick(comment)}
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
                            ))
                        )}
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