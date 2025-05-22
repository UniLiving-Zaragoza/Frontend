import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '../authContext';
import { BsThreeDotsVertical, BsTrash3Fill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import socket from '../socket'; // usa la instancia compartida
import CustomNavbar from '../components/CustomNavbar';
import ChatComponent from "../components/ChatComponent";
import CustomModal from "../components/CustomModal";
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = 'https://uniliving-backend.onrender.com';

const ChatGlobal = () => {
    const navigate = useNavigate();
    const { isAdmin, user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingData, setFetchingData] = useState(false);
    const limit = 10;

    const sortMessages = (msgs) => {
        return [...msgs].sort((a, b) => new Date(a.sentDate) - new Date(b.sentDate));
    };

    useEffect(() => {
        socket.connect();
        socket.emit('joinChat', 'generalChat');

        socket.on('messageReceived', (newMessage) => {
            setMessages((prevMessages) => {
                if (prevMessages.some(msg => msg.id === newMessage._id)) {
                    return prevMessages;
                }
                const newMsg = {
                    id: newMessage._id,
                    sender: (newMessage.user.firstName + ' ' + newMessage.user.lastName) ,
                    text: newMessage.content,
                    sentDate: newMessage.sentDate,
                    userId: newMessage.user,
                    fotoPerfil: newMessage.user.profilePicture || 'https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg',
                    isLive: true
                };
                return sortMessages([...prevMessages, newMsg]);
            });
        });

        return () => {
            socket.off('messageReceived');
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            setFetchingData(true);
            try {
                const response = await axios.get(`${API_URL}/general/messages/paginated`, {
                    params: { page, limit },
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                const fetchedMessages = response.data.map(msg => ({
                    id: msg._id,
                    sender: msg.user.firstName || 'Unknown',
                    text: msg.content,
                    sentDate: msg.sentDate,
                    fotoPerfil: msg.user.profilePicture || 'https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg',
                    userId: msg.user._id,
                    isLive: false
                }));
                setFetchingData(false);
                setMessages((prevMessages) => {
                    const newMessages = fetchedMessages.filter(
                        newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id)
                    );
                    return sortMessages([...prevMessages, ...newMessages]);
                });
                setHasMore(response.data.length === limit);
            } catch (error) {
                console.error('Error al obtener mensajes:', error);
            }
        };

        fetchMessages();
    }, [page, user.token]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await axios.post(`${API_URL}/messages`, {
                content: newMessage,
                userId: user.id,
                generalChat: true
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    };

    const handleReportUser = (e, id, sender, text) => {
        setSelectedMessageId(id);
        setSelectedMessage(text);
        setSelectedUserName(sender);
        setShowMenu(!showMenu);
        const { clientX, clientY } = e;
        setMenuPosition({ x: clientX, y: clientY });
    };

    const openDeleteModal = () => {
        setShowMenu(false);
        setModalType('borrar');
        setShow(true);
    };

    const openReportModal = () => {
        setShowMenu(false);
        setModalType('reporte');
        setShow(true);
    };
    //TODO: Cambiar correctamente las URLs de los reportes y eliminaciones
    const handleModalConfirm = async () => {
        if (modalType === 'reporte') {
            try {
                await axios.post(`${API_URL}/reports`, {
                    messageId: selectedMessageId,
                    userId: user._id,
                    reason: 'Contenido inapropiado'
                }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                console.log(`Reporte enviado para el mensaje: "${selectedMessage}"`);
            } catch (error) {
                console.error('Error al enviar reporte:', error);
            }
        } else if (modalType === 'borrar') {
            try {
                await axios.delete(`${API_URL}/messages/${selectedMessageId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMessages(prevMessages => prevMessages.filter(msg => msg.id !== selectedMessageId));
                console.log(`Comentario de ${selectedUserName} eliminado por admin`);
            } catch (error) {
                console.error('Error al eliminar mensaje:', error);
            }
        }
        setShow(false);
    };

    const loadMoreMessages = () => {
        if (hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className="App">
            {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
            <Container className="mt-4">
                {!isAdmin && (
                    <Row className="mb-3 text-center">
                        <Col>
                            <Button
                                variant="primary"
                                className="w-100 rounded-pill"
                                style={{ backgroundColor: "#000842" }}
                                onClick={() => navigate("/lista-chats")}
                            >
                                Emparejamientos
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                variant="light"
                                className="w-100 border border-dark rounded-pill"
                            >
                                Chat General
                            </Button>
                        </Col>
                    </Row>
                )}
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border rounded bg-light mb-3 shadow-sm">
                    <strong>Chat general</strong>
                </div>
                {fetchingData && (
                    <div className="d-flex justify-content-center py-2">
                        <Spinner animation="border" variant="primary" size="sm" />
                    </div>
                )}
                <ChatComponent
                    dataMessages={messages}
                    icon={isAdmin ? <BsTrash3Fill size={25} color="red" /> : <BsThreeDotsVertical size={25} />}
                    onIconClick={handleReportUser}
                    onSendMessage={handleSendMessage}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    loadMoreMessages={loadMoreMessages}
                    hasMore={hasMore}
                />
                {showMenu && (
                    <div
                        className="dropdown-menu show"
                        style={{
                            position: "absolute",
                            left: menuPosition.x + "px",
                            top: menuPosition.y + "px",
                            zIndex: 1000
                        }}
                    >
                        {isAdmin ? (
                            <button className="dropdown-item" onClick={openDeleteModal}>
                                Eliminar mensaje
                            </button>
                        ) : (
                            <button className="dropdown-item" onClick={openReportModal}>
                                Reportar Usuario
                            </button>
                        )}
                    </div>
                )}
                <div style={{ marginBottom: '20px' }}></div>
            </Container>

            <CustomModal
                show={show}
                onHide={() => setShow(false)}
                title={
                    modalType === 'reporte'
                        ? `Reportar usuario ${selectedUserName}`
                        : `Eliminar comentario de ${selectedUserName}`
                }
                bodyText={
                    modalType === 'reporte'
                        ? `Vas a reportar a ${selectedUserName} debido al siguiente mensaje: "${selectedMessage}". ¿Continuar?`
                        : `Vas a eliminar el siguiente mensaje de ${selectedUserName}: "${selectedMessage}". ¿Deseas continuar?`
                }
                confirmButtonText={modalType === 'reporte' ? 'Reportar' : 'Eliminar'}
                onSave={handleModalConfirm}
            />
        </div>
    );
};

export default ChatGlobal;