import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";

function ChatComponent({ dataMessages, icon, onIconClick }) {
    const [messages, setMessages] = useState(dataMessages);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg = {
            id: 1,
            sender: "Laura",
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            fotoPerfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png"
        };

        setMessages(prevMessages => [...prevMessages, newMsg]);
        setNewMessage("");
    };

    return (
        <Container className="mt-4">
            <Card className="p-3" style={{ height: "70vh", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <Row
                        key={index}
                        className={`d-flex ${msg.id !== 1 ? "justify-content-start" : "justify-content-end"} mb-2`}
                    >
                        <Col xs="auto" className="d-flex align-items-center">
                            {msg.id !== 1 && (
                                <img
                                    src={msg.fotoPerfil}
                                    alt={msg.sender}
                                    className="rounded-circle me-2"
                                    width={40}
                                    height={40}
                                />
                            )}
                            <div>
                                <div className={`text-${msg.id !== 1 ? "start" : "end"} text-muted`} style={{ fontSize: "0.8rem" }}>
                                    {msg.sender}
                                </div>
                                <Card
                                    className={`p-2 `}
                                    style={{
                                        borderRadius: "15px",
                                        maxWidth: "75%",
                                        minWidth: "10ch",
                                        display: "inline-block",
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        position: "relative",
                                        backgroundColor: msg.id !== 1 ? "#D6EAFF" : "#0056b3",
                                        color: msg.id !== 1 ? "#000" : "#fff"
                                    }}
                                >
                                    <Card.Text className="mb-1">{msg.text}</Card.Text>
                                    <small className=" d-block text-start" style={{ color: msg.id !== 1 ? "black" : "white", opacity: 0.7 }}>{msg.time}</small>

                                    {/* Icono de tres puntos */}
                                    {icon && msg.id !== 1 && (
                                        <div
                                            onClick={(e) => onIconClick(e, msg.id, msg.sender, msg.text)}
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                bottom: "10px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {icon}
                                        </div>
                                    )}
                                </Card>
                            </div>
                            {msg.id === 1 && (
                                <img
                                    src={msg.fotoPerfil}
                                    alt={msg.sender}
                                    className="rounded-circle"
                                    width={40}
                                    height={40}
                                />
                            )}
                        </Col>
                    </Row>
                ))}
            </Card>

            {/* Campo de texto para enviar mensajes, admin no envia mensajes asi que no le aparece este campo */}
            {sessionStorage.getItem("userRole") !== "admin" && (
                <Form className="mt-3 d-flex" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                    <Form.Control
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="me-2"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button variant="primary" type="submit" style={{ backgroundColor: "#000842" }}>Enviar</Button>
                </Form>
            )}
        </Container>
    );
}

export default ChatComponent;
