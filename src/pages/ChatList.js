import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const data = [
    {
        chat: "Chat 1",
        foto: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png",
        nombre_usuario: "Usuario2",
        Ultimo_mensaje: "Alo",
        id: 2,
        hora: "10:30 AM"
    },
    {
        chat: "Chat 2",
        foto: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png",
        nombre_usuario: "Usuario3",
        Ultimo_mensaje: "Hola",
        id: 3,
        hora: "10:25 AM"
    },
    {
        chat: "Chat 3",
        foto: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png",
        nombre_usuario: "Usuario4",
        Ultimo_mensaje: "No me interesa",
        id: 4,
        hora: "10:20 AM"
    },
    {
        chat: "Chat 4",
        foto: "https://upload.wikimedia.org/wikipedia/commons/5/59/4NumberFourInCircle.png",
        nombre_usuario: "Usuario5",
        Ultimo_mensaje: "Ofrezco 180 por la habitacion y me estoy arriesgando",
        id: 5,
        hora: "10:15 AM"
    },
    {
        chat: "Chat 5",
        foto: "https://static.vecteezy.com/system/resources/previews/026/468/774/non_2x/number-5-icon-circle-illustration-on-isolated-white-background-number-five-icon-free-vector.jpg",
        nombre_usuario: "Usuario6",
        Ultimo_mensaje: "buscas compañero?",
        id: 6,
        hora: "10:10 AM"
    },
    {
        chat: "Chat 6",
        foto: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png",
        nombre_usuario: "Usuario7",
        Ultimo_mensaje: "Te voy a bloquear",
        id: 7,
        hora: "10:05 AM"
    },
    {
        chat: "Chat 7",
        foto: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png",
        nombre_usuario: "Usuario8",
        Ultimo_mensaje: "Barsa >> Real Madrid",
        id: 8,
        hora: "10:00 AM"
    }
];

const ChatList = () => {
    const navigate = useNavigate()
    return (
        <div className="App">
            <CustomNavbar />
            <Container className="text-center mt-5">
                <Row className="mb-3">
                    <Col>
                        <Button variant="primary" className="w-100 rounded-pill" style={{ backgroundColor: "#000842" }}>Emparejamientos</Button>
                    </Col>
                    <Col>
                        <Button variant="light" className="w-100 border border-dark rounded-pill" onClick={() => navigate("/chat-global")}> Chat General</Button>
                    </Col>
                </Row>
                <Card className="p-3 mb-4" style={{ height: '75vh' }}>
                    {data.length === 0 ? (
                        <Card.Body className="d-flex flex-column justify-content-center align-items-center h-100">
                            <Card.Text className="fs-4 text-center">
                                Aún no tienes ningun emparejamiento con el que empezar a hablar
                            </Card.Text>
                            <Button variant="primary" className="fs-3 py-3 px-5 rounded-pill mt-3" style={{ backgroundColor: "#000842" }}>¡Empieza a buscar!</Button>
                        </Card.Body>
                    ) : (
                        <div style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                            {data.map((chat, index) => (
                                <Link to={`/chat-individual/${chat.id}`} key={index} style={{ textDecoration: 'none' }}>
                                    <Card className="mb-3 p-3 d-flex flex-row align-items-center" style={{ backgroundColor: "#D6EAFF" }}>
                                        <Link to={`/perfil/${chat.id}`} onClick={(e) => e.stopPropagation()}>
                                            <img
                                                src={chat.foto}
                                                alt={chat.nombre_usuario}
                                                className="rounded-circle me-3"
                                                width={50}
                                                height={50}
                                            />
                                        </Link>
                                        <div className="d-flex flex-column text-start w-100">
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <h5 className="mb-1">{chat.nombre_usuario}</h5>
                                                <small className="text-muted text-end">{chat.hora}</small>
                                            </div>
                                            <p className="mb-0 text-muted">{chat.Ultimo_mensaje}</p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
};

export default ChatList;
