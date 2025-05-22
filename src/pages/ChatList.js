import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import socket from '../socket';


const ChatList = () => {

    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user, token} = useAuth();

    const API_URL = 'https://uniliving-backend.onrender.com';
    useEffect(() => {
        const fetchChats = async () => {
            try {
                console.log("Fetching chats for user:", user.id);
                console.log("Token:", token);
                const res = await axios.get(`${API_URL}/privateChat/userChats/${user.id}`,  {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChats(res.data.chats);
            } catch (error) {
                console.error("Error al cargar chats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id && token) {
            fetchChats();
        }
    }, [user, token]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get(`${API_URL}/privateChat/userChats/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const allChats = res.data.chats;
                setChats(allChats);

                allChats.forEach(chat => {
                    console.log("Uniendo a chat_id", chat._id);
                    socket.emit("joinChat", chat._id);
                });

            } catch (err) {
                console.error("Error al cargar chats:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id && token) {
            fetchChats();
        }
    }, [user, token]);

    return (
        <div className="App">
            <CustomNavbar />
            <Container className="text-center mt-4">
                <Row className="mb-3">
                    <Col>
                        <Button variant="primary" className="w-100 rounded-pill" style={{ backgroundColor: "#000842" }}>
                            Emparejamientos
                        </Button>
                    </Col>
                    <Col>
                        <Button variant="light" className="w-100 border border-dark rounded-pill" onClick={() => navigate("/chat-global")}>
                            Chat General
                        </Button>
                    </Col>
                </Row>

                <Card className="p-3 mb-4" style={{ height: '75vh' }}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : chats.length === 0 ? (
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                            <Card.Text className="fs-4 text-center">
                                Aún no tienes ningún emparejamiento con el que empezar a hablar.
                            </Card.Text>
                            <Button
                                onClick={() => navigate("/buscar-compañero")}
                                variant="primary"
                                className="fs-3 py-3 px-5 rounded-pill mt-3"
                                style={{ backgroundColor: "#000842" }}
                            >
                                ¡Empieza a buscar!
                            </Button>
                        </Card.Body>
                    ) : (
                        <div style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                            {chats.map((chat, index) => {
                                const otherParticipant = chat.participants.find(p => p._id !== user.id);
                                const lastMessage = chat.messages[chat.messages.length - 1];

                                return (
                                    <Card
                                        key={index}
                                        className="mb-3 p-3 d-flex flex-row align-items-center"
                                        style={{ backgroundColor: "#D6EAFF", cursor: "pointer" }}
                                        onClick={() => navigate(`/chat-individual/${chat._id}`)}
                                    >
                                        <img
                                            src={(otherParticipant?.profilePicture || 'https://st2.depositphotos.com/19428878/44645/v/450/depositphotos_446453832-stock-illustration-default-avatar-profile-icon-social.jpg')}
                                            alt={`${otherParticipant?.firstName} ${otherParticipant?.lastName}`}
                                            className="rounded-circle me-3"
                                            width={50}
                                            height={50}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/perfil/${otherParticipant?._id}`);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        />
                                        <div className="d-flex flex-column text-start w-100">
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <h5 className="mb-1">
                                                    {otherParticipant?.firstName} {otherParticipant?.lastName}
                                                </h5>
                                                <small className="text-muted text-end">
                                                    {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </small>
                                            </div>
                                            <p className="mb-0 text-muted">
                                                {lastMessage?.content || 'Sin mensajes aún'}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ChatList;
