import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';

const data = [
    {
        chat: "Chat 1",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario1",
        Ultimo_mensaje: "Alo"
    },
    {
        chat: "Chat 2",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario2",
        Ultimo_mensaje: "Hola"
    },
    {
        chat: "Chat 3",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario3",
        Ultimo_mensaje: "No me interesa"
    },
    {
        chat: "Chat 4",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario4",
        Ultimo_mensaje: "Ofrezco 180 por la habitacion y me estoy arriesgando"
    },
    {
        chat: "Chat 5",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario5",
        Ultimo_mensaje: "buscas compañero?"
    },
    {
        chat: "Chat 6",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario6",
        Ultimo_mensaje: "Te voy a bloquear"
    },
    {
        chat: "Chat 7",
        foto: "https://via.placeholder.com/50",
        nombre_usuario: "Usuario6",
        Ultimo_mensaje: "Barsa >> Real Madrid"
    }
];

const ChatList = () => {
    return (
        <div className="App">
            <CustomNavbar />
            <Container className="text-center mt-5">
                <Row className="mb-3">
                    <Col>
                        <Button variant="primary" className="w-100 rounded-pill" style={{ backgroundColor: "#000842" }}>Emparejamientos</Button>
                    </Col>
                    <Col>
                        <Button variant="light" className="w-100 border border-dark rounded-pill"> Chat General</Button>
                    </Col>
                </Row>
                <Card className="p-3 mb-4" style={{ height: '80vh' }}>
                    {data.length === 0 ? (
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                            <Card.Text className="fs-4 text-center">
                                Aún no tienes ningun emparejamiento con el que empezar a hablar
                            </Card.Text>
                            <Button variant="primary" className="fs-3 py-3 px-5 rounded-pill mt-3" style={{ backgroundColor: "#000842" }}>¡Empieza a buscar!</Button>
                        </Card.Body>
                    ) : (
                        <div style={{ maxHeight: '77vh', overflowY: 'auto' }}>
                            {data.map((chat, index) => (
                                <Card key={index} className="mb-3 p-3 d-flex flex-row align-items-center">
                                    <img
                                        src={chat.foto}
                                        alt={chat.nombre_usuario}
                                        className="rounded-circle me-3"
                                        width={50}
                                        height={50}
                                    />
                                    <div className="d-flex flex-column text-start">
                                        <h5 className="mb-1">{chat.nombre_usuario}</h5>
                                        <p className="mb-0 text-muted">{chat.Ultimo_mensaje}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ChatList;
