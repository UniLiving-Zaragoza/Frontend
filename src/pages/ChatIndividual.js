import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { BsTrash } from 'react-icons/bs';
import { useAuth } from "../authContext";
import axios from "axios";
import CustomNavbar from "../components/CustomNavbar";
import ChatComponent from "../components/ChatComponent";
import CustomModal from "../components/CustomModal";
import socket from '../socket'; // usa la instancia compartida



const ChatIndividual = () => {
    const API_URL = 'https://uniliving-backend.onrender.com';
    const { id: chatId } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [otherParticipant, setOtherParticipant] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingChat, setDeletingChat] = useState(false);
    const limit = 10;

    // Función para obtener el otro participante
    const fetchChatInfo = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/privateChat/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const otherUser = res.data.participants.find(p => p._id !== user.id);
            setOtherParticipant(otherUser);
        } catch (err) {
            console.error("Error obteniendo información del chat:", err);
        }
    }, [chatId, token, user.id]);

    // Join a la sala del chat y escuchar nuevos mensajes
    useEffect(() => {
        if (!chatId) return;

        socket.connect(); // Asegúrate de conectar si aún no está
        socket.emit("joinChat", chatId);

        socket.on("messageReceived", (newMessage) => {
            if (newMessage.privateChat !== chatId) return;

            setMessages((prevMessages) => {
                if (prevMessages.some(msg => msg.id === newMessage._id)) {
                    return prevMessages;
                }

                const newMsg = {
                    id: newMessage._id,
                    sender: `${newMessage.user.firstName} ${newMessage.user.lastName}`,
                    text: newMessage.content,
                    sentDate: newMessage.sentDate,
                    userId: newMessage.user, // Si `user` ya es el objeto completo
                    fotoPerfil: newMessage.user.profilePicture || 'https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg',
                    isLive: true
                };

                return [...prevMessages, newMsg];
            });
        });

        return () => {
            socket.off("messageReceived");
            socket.disconnect();
        };
    }, [chatId]);
    

    // Cargar mensajes paginados
    const fetchMessages = useCallback(async (pageToFetch) => {
        try {
            const res = await axios.get(`${API_URL}/privateChat/${chatId}/messages/`, {
                params: { page: pageToFetch, limit },
                headers: { Authorization: `Bearer ${token}` }
            });

            // Mapeo igual...
            const mappedMessages = res.data.messages.map(msg => ({
                id: msg._id,
                text: msg.content,
                sentDate: msg.sentDate,
                userId: msg.user._id,
                fotoPerfil: msg.user.profilePicture || 'https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg',
                sender: `${msg.user.firstName} ${msg.user.lastName}`,
                isLive: false
            }));

            setMessages(prev => {
                const existingIds = new Set(prev.map(msg => msg.id));
                const uniqueNew = mappedMessages.filter(msg => !existingIds.has(msg.id));
                return [...uniqueNew.reverse(), ...prev];
            });

            setHasMore(mappedMessages.length === limit);
            setPage(pageToFetch + 1);
        } catch (err) {
            console.error("Error cargando mensajes:", err);
        } finally {
            setLoading(false);
        }
    }, [chatId, token]);

    const handleSendMessage = async () => {
        try {
             await axios.post(`${API_URL}/messages`, {
                content: newMessage,
                userId: user.id,
                privateChat: chatId,
                generalChat: false
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMessage('');
        } catch (err) {
            console.error("Error enviando mensaje:", err);
        }
    };

    const loadMoreMessages = async () => {
        setLoadingMore(true);
        await fetchMessages(page);
        setLoadingMore(false);
    };

    // Función para eliminar el chat
    const handleDeleteChat = async () => {
        setDeletingChat(true);
        try {
            await axios.delete(`${API_URL}/privateChat/${chatId}`, {userId: user.id}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Desconectar del socket del chat
            socket.emit("leaveChat", chatId);
            
            navigate("/lista-chats");
        } catch (err) {
            console.error("Error eliminando chat:", err);
            alert("Error al eliminar el chat. Por favor, inténtalo de nuevo.");
        } finally {
            setDeletingChat(false);
            setShowDeleteModal(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchMessages(1);
        fetchChatInfo();
    }, [fetchMessages, fetchChatInfo])

    return (
        <div className="App">
            <CustomNavbar />
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <Button
                            variant="primary"
                            className="w-100 rounded-pill"
                            style={{ backgroundColor: "#000842" }} 
                            onClick={() => navigate("/lista-chats")}
                        >
                            Volver a chats
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            variant="light" 
                            className="w-100 border border-dark rounded-pill" 
                            onClick={() => navigate("/chat-global")}
                        >
                            Chat General
                        </Button>
                    </Col>
                </Row>

                {/* Etiqueta del chat individual */}
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border rounded bg-light mb-3 shadow-sm">
                    <strong>
                        {otherParticipant 
                            ? `Chat con ${otherParticipant.firstName} ${otherParticipant.lastName}`
                            : ''
                        }
                    </strong>
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={deletingChat}
                        className="d-flex align-items-center"
                        style={{ border: 'none', backgroundColor: 'transparent' }}
                    >
                        {deletingChat ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <BsTrash size={20} color="#dc3545" />
                        )}
                    </Button>
                </div>

                {loadingMore && (
                    <div className="d-flex justify-content-center my-3">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {loading ? (
                    <div className="d-flex justify-content-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                
                    <ChatComponent
                        dataMessages={messages}
                        onSendMessage={handleSendMessage}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        loadMoreMessages={loadMoreMessages}
                        hasMore={hasMore} 
                        icon={null} // Si quieres pasar icono de reporte, hazlo
                    />
                )}

                {/* Modal de confirmación para eliminar chat */}
                <CustomModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    title="Eliminar Chat"
                    bodyText={`¿Estás seguro de que quieres eliminar este chat con ${otherParticipant?.firstName} ${otherParticipant?.lastName}? Esta acción no se puede deshacer y se perderán todos los mensajes.`}
                    confirmButtonText="Eliminar Chat"
                    onSave={handleDeleteChat}
                />
            </Container>
        </div>
    );
};

export default ChatIndividual;
