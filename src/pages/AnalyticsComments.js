import React, { useState, useEffect,useRef  } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Spinner, Dropdown  } from 'react-bootstrap';
import { FaChartBar, FaPaperPlane, FaTrash } from 'react-icons/fa';
import { useNavigate, useLocation} from 'react-router-dom';
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
    const usersPerPage = 15; 
    const { isAuthenticated, isAdmin, user, token } = useAuth();
    const socketRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);

    useEffect(() => {
        // Establece la conexión solo una vez al montar
        socketRef.current = io("https://uniliving-backend.onrender.com");

        return () => {
            // Cierra la conexión al desmontar el componente
            socketRef.current.disconnect();
        };
    }, []);

    const barriosZaragoza = [
        "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
        "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
        "Centro", "Las Fuentes", "Universidad", "San José",
        "Casablanca", "Torrero-La Paz", "Sur"
    ];

    // Función helper para ordenar comentarios
    const sortCommentsByDate = (commentsArray) => {
        return commentsArray.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
        });
    };

    useEffect(() => {
        setIsLoading(true);

        const fetchComments = async () => {
            try {
                let res;
                if (isAdmin) {
                    res = await axios.get('https://uniliving-backend.onrender.com/zones/comments/reported', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                } else if (selectedBarrio) {
                    console.log("Cambiando de barrio", selectedBarrio);
                    res = await axios.get(`https://uniliving-backend.onrender.com/zones/by-name/${encodeURIComponent(selectedBarrio)}/comments`);
                } else {
                    setComments([]);
                    return;
                }

                const sorted = sortCommentsByDate([...res.data.data]);
                setComments(sorted);
                setCurrentPage(1);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [selectedBarrio, isAdmin, token]);

    
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket || !selectedBarrio) return;

        // Unirse a la sala del barrio
        socket.emit('joinZone', selectedBarrio);

        const eventName = `zone:commentAdded:${selectedBarrio}`;

        const handleNewComment = (newComment) => {
            const liveComment = { ...newComment, isLive: true };

            setComments(prev => {
                if (prev.find(c => c._id === newComment._id)) return prev;
                const updatedComments = [liveComment, ...prev];
                return sortCommentsByDate(updatedComments);
            });
        };

        socket.on(eventName, handleNewComment);

        return () => {
            socket.off(eventName, handleNewComment);
            socket.emit('leaveZone', selectedBarrio);
        };
    }, [selectedBarrio]);

    // Función para manejar el clic en la foto del usuario
    const handleUserPhotoClick = (comment) => {

        if (!isAuthenticated) {
            return;
        }

        if (comment.isLive) {
            return;
        }

        if (user && comment.user && (comment.user._id === user.id || comment.user === user.id)) {
            return;
        }

        if (comment.user && (comment.user._id || comment.user)) {
            const userId = comment.user._id || comment.user;
            navigate(`/perfil/${userId}`);
        }
    };

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
            const response = await fetch(`https://uniliving-backend.onrender.com/zones/name/${encodeURIComponent(selectedBarrio)}/comment`, {
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

            const result = await response.json();
            
            // Emitir el comentario a través del socket para tiempo real
            if (socketRef.current && selectedBarrio) {
                socketRef.current.emit('newComment', {
                    zone: selectedBarrio,
                    comment: result.data || {
                        _id: Date.now().toString(), // ID temporal
                        content: newComment,
                        user: {
                            _id: user.id,
                            firstName: user.firstName || 'Usuario',
                            lastName: user.lastName || '',
                            profilePicture: user.profilePicture
                        },
                        createdAt: new Date().toISOString(),
                        isLive: true
                    }
                });
            }

            setNewComment('');

        } catch (error) {
            console.error('Fallo al enviar el comentario:', error.message);
            // Podrías mostrar una alerta al usuario si lo deseas
        }
    };


    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = async (confirmed = false) => {
        
        if (confirmed && selectedUser) {
            await handleDisableComment();
        }
        setShowModal(false);
        setSelectedUser(null);
    };


    const handleSearch = () => {
        navigate('/principal', { 
            state: { 
                barrio: selectedBarrio 
            } 
        });
    };

    const handleGraphics = () => {
        navigate('/analiticas-graficos', { state: { barrio: selectedBarrio } });
    };

    const handleBarrioChange = (e) => {
        const value = e.target.value;
        setSelectedBarrio(value === 'Selecciona un barrio de Zaragoza' ? '' : value);
    };

    const handleReportComment = async (commentId) => {
    try {
        await axios.put(
        `https://uniliving-backend.onrender.com/zones/comments/report`,
        {
            commentId: commentId,
            status: 'Reported',
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        }
        );

        setReportModalOpen(true); // Mostrar modal
    } catch (error) {
        console.error("Error al reportar comentario:", error);
        alert("No se pudo reportar el comentario.");
    }
    };

    const handleApproveComment = async (comment) => {
        console.log("Selected barrio:", comment.zone);
        try {
        await axios.put(
        `https://uniliving-backend.onrender.com/zones/${encodeURIComponent(comment.zone)}/comment`,
        {
            commentId: comment._id,
            status: 'Visible'
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            }
        }
        );
        setComments(prev =>
                prev.filter(c => c._id !== comment._id)
            );
    } catch (error) {
        console.error("Error al reportar comentario:", error);
        alert("No se pudo reportar el comentario.");
    }
    };

    const handleDisableComment = async () => {
        if (!token) return;

        try {
            await axios.put(
            `https://uniliving-backend.onrender.com/zones/${encodeURIComponent(selectedComment.zone)}/comment`,
            {
                commentId: selectedComment._id,
                status: 'Disabled'
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                }
            }
            );

            setComments(prev =>
                prev.filter(c => c._id !== selectedComment._id)
            );

            console.log("Comentario deshabilitado correctamente");
        } catch (error) {
            console.error("Error al deshabilitar comentario:", error);
        }
    };



    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentComments = comments.slice(indexOfFirst, indexOfLast);


    const commentsContainerMaxHeight =
        isAuthenticated && isAdmin
            ? 'calc(100vh - 230px)'
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
                {isAdmin ? (
                    <Container className="mt-3 mb-3">
                        <div className="d-flex justify-content-center">
                            <h2 className="text-center" style={{ color: '#000842', fontWeight: 'bold' }}>
                                Comentarios reportados
                            </h2>
                        </div>
                    </Container>
                ) : (
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
                )}
                
                {/* Modal de reporte */}
                {reportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 mx-5 mb-4" >
                        <div className="bg-white p-4 rounded-xl shadow-xl w-4/5 max-w-xs text-center border border-gray-200">
                        <h2 className="text-md font-semibold text-gray-800 mb-2">Comentario reportado</h2>
                        <p className="text-gray-600 text-sm">
                            Gracias por hacérnoslo saber. Revisaremos el comentario lo antes posible.
                        </p>
                        <button
                            onClick={() => setReportModalOpen(false)}
                            style={{
                            backgroundColor: '#000842',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '6px 16px',
                            width: 'auto',
                            maxWidth: 'none',
                            marginTop: '12px',
                            fontSize: '0.875rem'
                            }}
                        >
                            Entendido
                        </button>
                        </div>
                    </div>
                    )}
            
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
                        {isLoading ? (
                            <Col xs={12} className="text-center">
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Cargando comentarios...</span>
                                </Spinner>
                                <p className="mt-2 text-muted">Cargando comentarios...</p>
                            </Col>
                        ) : comments.length === 0 ? (
                            <Col xs={12}>
                                <p className="text-center text-muted">No hay comentarios disponibles.</p>
                            </Col>
                        ) : (
                            <>
                            <Col xs={12} className="text-end mb-2">
                                <h4 className="text-muted">{comments.length} comentarios</h4>
                            </Col>
                            
                            {currentComments.map(comment => (
                                <Col xs={12} key={comment._id} className="mb-4">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={comment.user.profilePicture || 'https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg'}
                                            alt={`${comment.user.firstName} ${comment.user.lastName}`}
                                            className="rounded-circle"
                                            style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                cursor: isAuthenticated && !comment.isLive && 
                                                       (!user || (comment.user._id !== user.id && comment.user !== user.id)) 
                                                       ? 'pointer' : 'default'
                                            }}
                                            onClick={() => handleUserPhotoClick(comment)}
                                        />

                                        <div
                                            className="d-flex align-items-start justify-content-between flex-grow-1 ms-3 px-3"
                                            style={{
                                                backgroundColor: '#D6EAFF',
                                                border: '0.5px solid #ddd',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                                                borderRadius: '10px',
                                                minHeight: '55px',
                                                width: '100%',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div className="d-flex flex-column">
                                            <span 
                                                className="fw-semibold"
                                                style={{
                                                    cursor: isAuthenticated && !comment.isLive && 
                                                           (!user || (comment.user._id !== user.id && comment.user !== user.id)) 
                                                           ? 'pointer' : 'default',
                                                    textDecoration: 'none',
                                                    color: 'inherit'
                                                }}
                                                onClick={() => handleUserPhotoClick(comment)}
                                            >
                                                {comment.isLive ? 'Recién escrito' : `${comment.user.firstName} ${comment.user.lastName}`}
                                            </span>

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
                                            {/* Botón Reportar a la derecha */}
                                        </div>
                                            {isAuthenticated && !isAdmin && comment.user?._id !== user?.id && !comment.isLive && (
                                                    <Dropdown align="end" className="ms-2 mt-3">
                                                        <Dropdown.Toggle
                                                            as="button"
                                                            bsPrefix="custom-toggle"
                                                                style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                fontSize: '1.5rem',
                                                                padding: 0,
                                                                color: '#555',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            &#x22EE; {/* tres puntos verticales */}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => handleReportComment(comment._id)}>
                                                                Reportar comentario
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                )}
                                           {isAdmin && (
                                            <div className="d-flex ms-2 mt-3" style={{ gap: '32px' }}>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    style={{
                                                        height: '31px',
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                    onClick={() => {
                                                        setSelectedComment(comment);
                                                        handleApproveComment(comment);
                                                    }}
                                                >
                                                    ✔
                                                </Button>
                                                <Button
                                                    variant="outline-light"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedComment(comment);
                                                        handleDeleteClick(comment);
                                                    }}
                                                    style={{
                                                        color: 'white',
                                                        borderRadius: '6px',
                                                        padding: '4px 8px',
                                                        backgroundColor: 'white',
                                                    }}
                                                >
                                                    <FaTrash style={{ color: 'red' }} />
                                                </Button>
                                            </div>
                                        )}

                                        </div>
                                    </div>
                                </Col>
                            ))
                        }
                            </>
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
                onHide={() => handleCloseModal(false)}
                title={selectedUser ? `Eliminar comentario de ${selectedUser.user.firstName}` : "Eliminar comentario"}
                bodyText={selectedUser ? `¿Estás seguro que deseas eliminar el comentario de ${selectedUser.user.firstName}?` : "¿Estás seguro que deseas eliminar el comentario?"}
                confirmButtonText="Eliminar comentario"
                onSave={() => handleCloseModal(true)}
            />
        </div>
    );
};

export default AnalyticsCommentsPage;