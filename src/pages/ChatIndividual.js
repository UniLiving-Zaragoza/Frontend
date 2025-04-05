import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Row, Col } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import ChatComponent from "../components/ChatComponent";
import { BsThreeDotsVertical } from "react-icons/bs";
import CustomModal from "../components/CustomModal";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaUserSlash } from "react-icons/fa";


const messages = [
    {
        id: 1,
        sender: "Laura",
        text: "Hola, ¿cómo estás?",
        time: "10:30 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png"
    },
    {
        sender: `Usuario`,
        text: "¡Hola! Busco piso en el actur",
        time: "10:32 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png"
    },
    {
        sender: `Usuario`,
        text: "¿qué te parece este?",
        time: "10:35 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png"
    },
    {
        id: 1,
        sender: "Laura",
        text: "Se pasa un poco de precio, ¿no?",
        time: "10:35 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png"
    },
    {
        sender: `Usuario`,
        text: "Un poco, pero está bien ubicado",
        time: "10:35 AM",
        fotoPerfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png"
    }
];

const ChatIndividual = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showDissable, setShowDissable] = useState(false);
    const handleShowReport = () => setShowReport(true);
    const handleCloseReport = () => setShowReport(false);
    const handleShowDelete = () => setShowDelete(true);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDissable = () => setShowDissable(true);
    const handleCloseDissable = () => setShowDissable(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const { id } = useParams();

    // Modificar directamente los mensajes
    for (let i = 0; i < messages.length; i++) {
        if (!messages[i].id || messages[i].id !== 1) {
            messages[i].id = parseInt(id);
            messages[i].sender = `Usuario${id}`;
        }
    }



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
        handleShowReport();
    };

    const handleReport = () => {
        console.log(`Reportar cuenta de usuario ${selectedUser}`); // Cambiar a reportar en el backend
        handleCloseReport();
    }

    const handleDelete = () => {
        console.log(`Borrar chat con Usuario${id}`); // Cambiar a borrar en el backend
        handleCloseDelete();
    }

    const handleBlock = () => {
        console.log(`Bloquear a Usuario${id}`); // Cambiar a bloquear en el backend
        handleCloseDissable();
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
                        <Button variant="light" className="w-100 border border-dark rounded-pill" onClick={() => navigate("/chat-global")}> Chat General</Button>
                    </Col>
                </Row>
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border rounded bg-light mb-3 shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                        <FaArrowLeft
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate("/lista-chats")}
                        />
                        <strong>Usuario{id}</strong>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <FaTrash
                            style={{ color: "red", cursor: "pointer" }}
                            onClick={() => handleShowDelete()}
                        />
                        <FaUserSlash
                            style={{ color: "gray", cursor: "pointer" }}
                            onClick={() => handleShowDissable()}
                        />
                    </div>
                </div>
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
                show={showReport}
                onHide={handleCloseReport}
                title={`Reportar usuario ${selectedUserName}`}
                bodyText={`Vas a reportar a ${selectedUserName} debido al siguiente mensaje "${selectedMessage}", ¿Continuar?`}
                confirmButtonText="Reportar"
                onSave={handleReport}
            />

            <CustomModal
                show={showDelete}
                onHide={handleCloseDelete}
                title={`Eliminar chat con Usuario${id}`}
                bodyText={`¿Estás seguro que deseas eliminar el chat con Usuario${id}? Perderás el contacto con la persona`}
                confirmButtonText="Eliminar chat"
                onSave={handleDelete}
            />

            <CustomModal
                show={showDissable}
                onHide={handleCloseDissable}
                title={`Bloquear a Usuario${id}`}
                bodyText={`¿Estás seguro que deseas bloquear a Usuario${id}? Se eliminará el chat y ya no se te volverá a emparejar con él al buscar un nuevo compañero`}
                confirmButtonText="Bloquear persona"
                onSave={handleBlock}
            />
        </div>
    );
};

export default ChatIndividual;
