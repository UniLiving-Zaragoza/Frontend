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
    console.log("Last Message:", lastMsg);
    console.log("User ID:", user.id);
    console.log("Last Message User ID:", lastMsg.userId);
    console.log("Previous Last Message User ID:", prevLastMsgId.current);
    console.log("Is live", lastMsg?.isLive);

    const isOwnLiveMessage =
        lastMsg?.isLive && lastMsg.userId === user.id && lastMsg.id !== prevLastMsgId.current;
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
                    {dataMessages.map((msg) => (
                        <Row
                            key={msg.id}
                            className={`d-flex ${msg.id === user.id ? "justify-content-end" : "justify-content-start"} mb-2`}
                        >
                            <Col xs="auto" className="d-flex align-items-center">
                                {msg.id !== user.id && (
                                    <img
                                        src={msg.fotoPerfil}
                                        alt={msg.sender}
                                        className="rounded-circle me-2"
                                        width={40}
                                        height={40}
                                    />
                                )}
                                <div>
                                    <div className={`text-${msg.id !== user.id ? "start" : "end"} text-muted`} style={{ fontSize: "0.8rem" }}>
                                        {msg.sender}
                                    </div>
                                    <Card
                                        className="p-2"
                                        style={{
                                            borderRadius: "15px",
                                            maxWidth: "75%",
                                            minWidth: "10ch",
                                            backgroundColor: msg.id !== user.id ? "#D6EAFF" : "#0056b3",
                                            color: msg.id !== user.id ? "#000" : "#fff",
                                            position: "relative"
                                        }}
                                    >
                                        <Card.Text className="mb-1">{msg.text}</Card.Text>
                                        <small className="d-block text-start" style={{ color: msg.id !== user.id ? "black" : "white", opacity: 0.7 }}>
                                            {formatDateTime(msg.sentDate)}
                                        </small>
                                        {icon && msg.id !== user.id && (
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
                                {msg.id === user.id && (
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
