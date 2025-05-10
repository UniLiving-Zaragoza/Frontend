import React, { useState } from "react";
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../authContext';
import { BsThreeDotsVertical, BsTrash3Fill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CustomNavbar from '../components/CustomNavbar';
import ChatComponent from "../components/ChatComponent";
import CustomModal from "../components/CustomModal";
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatGlobal = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState(null); // 'reporte' o 'borrar'
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const { isAdmin } = useAuth();

    let messages = [
        {
            id: 1,
            sender: "Laura",
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
        },
        {
            id: 4,
            sender: "Ana",
            text: "¿Alguien conoce un piso económico cerca de la universidad?",
            time: "10:40 AM",
            fotoPerfil: "https://cdn-icons-png.flaticon.com/512/706/706830.png"
        },
        {
            id: 5,
            sender: "Diego",
            text: "Estoy buscando compañeros para compartir un piso de 3 habitaciones.",
            time: "10:42 AM",
            fotoPerfil: "https://cdn-icons-png.flaticon.com/512/219/219969.png"
        },
        {
            id: 6,
            sender: "Marina",
            text: "Yo vi uno por el centro, pero está un poco caro. ¿Alguna recomendación?",
            time: "10:45 AM",
            fotoPerfil: "https://cdn-icons-png.flaticon.com/512/219/219983.png"
        }
    ];

    // Modificar los ids directamente si el usuario es admin
    if (isAdmin) {
        console.log("entro");
        messages = messages.map(msg => msg.id === 1 ? { ...msg, id: 999 } : msg);
    }

    const handleReportUser = (e, id, sender, text) => {
        setSelectedUser(id);
        setSelectedMessage(text);
        setSelectedUserName(sender);
        setShowMenu(!showMenu);

        const { clientX, clientY } = e;
        setMenuPosition({ x: clientX, y: clientY });
    };

    const openDeleteModal = () => {
        setShowMenu(false);
        setModalType("borrar");
        setShow(true);
    };

    const openReportModal = () => {
        setShowMenu(false);
        setModalType("reporte");
        setShow(true);
    };

    const handleModalConfirm = () => {
        if (modalType === "reporte") {
            console.log(`Reportar mensaje de ${selectedUser} con el texto: "${selectedMessage}"`);
        } else if (modalType === "borrar") {
            console.log(`Comentario de ${selectedUserName} eliminado por admin`);
        }
        setShow(false);
    };

    return (
        <div className="App">
            {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
            <Container className="text-center mt-5">
                {!isAdmin && (
                    <Row className="mb-3">
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
                <ChatComponent
                    dataMessages={messages}
                    icon={
                        isAdmin ? (
                            <BsTrash3Fill size={25} color="red" />
                        ) : (
                            <BsThreeDotsVertical size={25} />
                        )
                    }
                    onIconClick={handleReportUser}
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
                    modalType === "reporte"
                        ? `Reportar usuario ${selectedUserName}`
                        : `Eliminar comentario de ${selectedUserName}`
                }
                bodyText={
                    modalType === "reporte"
                        ? `Vas a reportar a ${selectedUserName} debido al siguiente mensaje: "${selectedMessage}". ¿Continuar?`
                        : `Vas a eliminar el siguiente mensaje de ${selectedUserName}: "${selectedMessage}". ¿Deseas continuar?`
                }
                confirmButtonText={
                    modalType === "reporte" ? "Reportar" : "Eliminar"
                }
                onSave={handleModalConfirm}
            />
        </div>
    );
};

export default ChatGlobal;
