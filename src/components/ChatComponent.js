import React, { useRef, useEffect} from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { useAuth } from "../authContext";
import InfiniteScroll from "react-infinite-scroll-component";
import "bootstrap/dist/css/bootstrap.min.css";

function ChatComponent({ dataMessages, icon, onIconClick, onSendMessage, newMessage, setNewMessage, loadMoreMessages, hasMore }) {
    const chatContainerRef = useRef(null);
    const { isAdmin, user } = useAuth();
    const hasScrolledInitially = useRef(false);
    const prevLastMsgId = useRef(null);


    const formatDateTime = (dateString) => {
        const messageDate = new Date(dateString);
        const today = new Date();
        const isToday = messageDate.toDateString() === today.toDateString();
        return isToday
            ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : messageDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    // Solo hacemos scroll abajo si es el primer render o se añade un nuevo mensaje propio
    useEffect(() => {
    if (!chatContainerRef.current || dataMessages.length === 0) return;
    const lastMsg = dataMessages[dataMessages.length - 1]; // recuerda: column-reverse → primero es el último
    const isFirstLoad = !hasScrolledInitially.current;

    const isOwnLiveMessage =
        lastMsg?.isLive && lastMsg.userId._id === user.id && lastMsg.id !== prevLastMsgId.current;
    if (isFirstLoad || isOwnLiveMessage) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        hasScrolledInitially.current = true;
    }

    prevLastMsgId.current = lastMsg.userId;
}, [dataMessages, user.id]);


    return (
        <Container className="mt-4">
            <div
                id="scrollableDiv"
                ref={chatContainerRef}
                style={{
                    height: isAdmin ? "65vh" : "57vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column-reverse", // Mostrar el último mensaje abajo
                    position: "relative"
                }}
            >
                <InfiniteScroll
                    dataLength={dataMessages.length}
                    next={loadMoreMessages}
                    hasMore={hasMore}
                    scrollableTarget="scrollableDiv"
                    inverse={true} // IMPORTANTE: permite cargar más al llegar arriba
                    
                >
                    {dataMessages.map((msg) => {
                    const senderId = typeof msg.userId === 'object' ? msg.userId._id : msg.userId;
                    const isOwnMessage = senderId === user.id;

                    return (
                        <Row
                            key={msg.id}
                            className={`d-flex ${isOwnMessage ? "justify-content-end" : "justify-content-start"} mb-2`}
                        >
                            <Col xs="auto" className="d-flex align-items-center">
                                {/* Imagen de perfil al principio si NO es tu mensaje */}
                                {!isOwnMessage && (
                                    <img
                                        src={msg.fotoPerfil}
                                        alt={msg.sender}
                                        className="rounded-circle me-2"
                                        width={40}
                                        height={40}
                                    />
                                )}

                                <div>
                                    {/* Nombre del emisor */}
                                    <div
                                        className={`text-${isOwnMessage ? "end" : "start"} text-muted`}
                                        style={{ fontSize: "0.8rem" }}
                                    >
                                        {msg.sender}
                                    </div>

                                    {/* Burbuja del mensaje */}
                                    <Card
                                        className="p-2"
                                        style={{
                                            borderRadius: "15px",
                                            maxWidth: "100%",
                                            minWidth: "20ch",
                                            backgroundColor: isOwnMessage ? "#0056b3" : "#D6EAFF",
                                            color: isOwnMessage ? "#fff" : "#000",
                                            position: "relative",
                                        }}
                                    >
                                        <Card.Text
                                            className="mb-1"
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {msg.text}
                                        </Card.Text>
                                        <small
                                            className={`d-block ${isOwnMessage ? "text-end" : "text-start"}`}
                                            style={{ color: isOwnMessage ? "white" : "black", opacity: 0.7 }}
                                        >
                                            {formatDateTime(msg.sentDate)}
                                        </small>

                                        {/* {icon && !isOwnMessage && (
                                            <div
                                                onClick={(e) => onIconClick(e, senderId, msg.sender, msg.text)}
                                                style={{
                                                    position: "absolute",
                                                    right: "10px",
                                                    bottom: "10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {icon}
                                            </div>
                                        )} */}
                                        
                                    </Card>
                                </div>

                                {/* Imagen de perfil al final si ES tu mensaje */}
                                {isOwnMessage && (
                                    <img
                                        src={msg.fotoPerfil}
                                        alt={msg.sender}
                                        className="rounded-circle ms-2"
                                        width={40}
                                        height={40}
                                    />
                                )}
                            </Col>
                        </Row>
                    );
                })}
                </InfiniteScroll>
            </div>

            {!isAdmin && (
                <Form className="mt-3 d-flex" onSubmit={(e) => { e.preventDefault(); onSendMessage(); }}>
                    <Form.Control
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="me-2"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button variant="primary" type="submit" style={{ backgroundColor: "#000842" }}>
                        Enviar
                    </Button>
                </Form>
            )}
        </Container>
    );
}

export default ChatComponent;
