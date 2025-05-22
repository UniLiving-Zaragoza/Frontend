import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import CustomNavbar from "../components/CustomNavbar";
import ChatComponent from "../components/ChatComponent";
import { useAuth } from "../authContext";
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
    const limit = 5;


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
                    fotoPerfil: newMessage.user.profilePicture || 'https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360',
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
                fotoPerfil: msg.user.profilePicture || 'https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360',
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

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleSendMessage = async () => {
        try {
            const res = await axios.post(`${API_URL}/messages`, {
                content: newMessage,
                userId: user.id,
                privateChat: chatId,
                generalChat: false
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Añadir localmente optimista
            const sentMsg = res.data; // o adapta según respuesta real
            setMessages(prev => [...prev, {
                id: sentMsg._id,
                text: sentMsg.content,
                sentDate: sentMsg.sentDate,
                userId: user.id,
                fotoPerfil: user.profilePicture || 'https://img.freepik.com/vector-premium/ilustracion-plana-vectorial-escala-gris-profilo-usuario-avatar-imagen-perfil-icono-persona-profilo-negocio-mujer-adecuado-profiles-redes-sociales-iconos-protectores-pantalla-como-plantillax9_719432-1339.jpg?w=360',
                sender: `${user.firstName} ${user.lastName}`,
                isLive: true
            }]);

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


    useEffect(() => {
        setPage(1);
        fetchMessages(1);
    }, [fetchMessages])

    return (
        <div className="App">
            <CustomNavbar />
            <Container className="mt-4">
                <Row className="mb-3">
                    <Col>
                        <Button
                            variant="primary"
                            className="w-100 rounded-pill"
                            style={{ backgroundColor: "#000842" }} onClick={() => navigate("/lista-chats")}>
                            Volver a chats
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="light" className="w-100 border border-dark rounded-pill" onClick={() => navigate("/chat-global")}>
                            Chat General
                        </Button>
                    </Col>
                </Row>

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
            </Container>
        </div>
    );
};

export default ChatIndividual;
