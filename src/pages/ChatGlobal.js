import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import ChatComponent from "../components/ChatComponent";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomModal from "../components/CustomModal";
import { useNavigate } from "react-router-dom";

const messages = [
    {
        id: 1,
        sender: "Lura",
        text: "Hola, ¿cómo estás?",
        time: "10:30 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png"
    },
    {
        id: 2,
        sender: "Pablo",
        text: "¡Hola! Estoy bien, gracias. ¿Y tú?",
        time: "10:32 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png"
    },
    {
        id: 3,
        sender: "Juan",
        text: "Bien también, ¿qué haces?",
        time: "10:35 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png"
    },
    {
        id: 1,
        sender: "Laura",
        text: "Bien también, ¿qué haces?",
        time: "10:35 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png"
    },
    {
        id: 2,
        sender: "Pablo",
        text: "Bien también, ¿qué haces?",
        time: "10:35 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png"
    }
];

const ChatGlobal = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleReportUser = (e, id, sender, text) => {
        setSelectedUser(id);
        setSelectedMessage(text);
        setSelectedUserName(sender);
        setShowMenu(!showMenu);
        // Obtener las coordenadas del clic
        const { clientX, clientY } = e;
        setMenuPosition({ x: clientX, y: clientY });
    };

    const reporte = () => {
        setShowMenu(false);
        handleShow();
    };

    const handleReport = () => {
        console.log(`Deshabilitar cuenta de usuario ${selectedUser}`); // Cambiar a reportar en el backend
        handleClose();
    }

    return (
        <div className="App">
            <CustomNavbar />
            <Container className="text-center mt-5">
                <Row className="mb-3">
                    <Col>
                        <Button variant="primary" className="w-100 rounded-pill" style={{ backgroundColor: "#000842" }} onClick={() => navigate("/lista-chats")}>Emparejamientos</Button>
                    </Col>
                    <Col>
                        <Button variant="light" className="w-100 border border-dark rounded-pill"> Chat General</Button>
                    </Col>
                </Row>
                <ChatComponent
                    dataMessages={messages}
                    icon={<BsThreeDotsVertical size={25} />}
                    onIconClick={handleReportUser}
                />
                {showMenu && (
                    <div
                        className="dropdown-menu show"
                        style={{
                            position: "absolute",
                            left: menuPosition.x + "px",
                            top: menuPosition.y + "px"
                        }}
                    >
                        <button className="dropdown-item" onClick={reporte}>
                            Reportar Usuario
                        </button>
                    </div>
                )}
                <div style={{ marginBottom: '20px' }}></div>
            </Container>
            <CustomModal
                show={show}
                onHide={handleClose}
                title={`Reportar usuario ${selectedUserName}`}
                bodyText={`Vas a reportar a ${selectedUserName} debido al siguiente mensaje "${selectedMessage}", ¿Continuar?`}
                confirmButtonText="Reportar"
                onSave={handleReport}
            />
        </div>
    );
};

export default ChatGlobal;
