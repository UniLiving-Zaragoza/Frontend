import React, { useState } from "react";
import { Container } from 'react-bootstrap';
import { BsTrash3Fill } from "react-icons/bs";
import { useAuth } from "../authContext";
import CustomNavbar from '../components/CustomNavbar';
import ChatComponent from "../components/ChatComponent";
import CustomModal from "../components/CustomModal";
import CustomNavbarAdmin from "../components/CustomNavbarAdmin";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatReports = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [show, setShow] = useState(false);
    const [showApprove, setShowApprove] = useState(false);

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
        messages = messages.map(msg => msg.id === 1 ? { ...msg, id: 999 } : msg);
    }

    const handleMenu = (e, id, sender, text) => {
        setSelectedUser(id);
        setSelectedMessage(text);
        setSelectedUserName(sender);
        setShowMenu(!showMenu);

        const { clientX, clientY } = e;
        setMenuPosition({ x: clientX, y: clientY });
    };

    const openDeleteModal = () => {
        setShowMenu(false);
        setShow(true);
    };

    const openApproveModal = () => {
        setShowMenu(false);
        setShowApprove(true);
    };

    const handleModalConfirm = () => {
        console.log(`Comentario de ${selectedUser} con texto ${selectedMessage} eliminado por admin`);
        setShow(false);
    };

    const handleModalApprove = () => {
        console.log(`Comentario de ${selectedUser} con texto ${selectedMessage} aprobado por admin`);
        setShow(false);
    }

    return (
        <div className="App">
            {isAdmin ? <CustomNavbarAdmin /> : <CustomNavbar />}
            <Container className="text-center mt-5">
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border rounded bg-light mb-3 shadow-sm">
                    <strong>Mensajes reportados</strong>
                </div>
                <ChatComponent
                    dataMessages={messages}
                    icon={<BsTrash3Fill size={25} color="red" />}
                    onIconClick={handleMenu}
                />
                {showMenu && (
                    <div
                        className="dropdown-menu show"
                        style={{
                            position: "absolute",
                            left: menuPosition.x + "px",
                            top: menuPosition.y + "px",
                            zIndex: 1000
                        }}>
                        <button className="dropdown-item" onClick={openDeleteModal}>
                            Eliminar mensaje
                        </button>
                        <button className="dropdown-item" onClick={openApproveModal}>
                            Aprobar mensaje
                        </button>
                    </div>
                )}
                <div style={{ marginBottom: '20px' }}></div>
            </Container>

            <CustomModal
                show={show}
                onHide={() => setShow(false)}
                title={`Eliminar comentario de ${selectedUserName}`}
                bodyText={`Vas a eliminar el siguiente mensaje de ${selectedUserName}: "${selectedMessage}". ¿Deseas continuar?`}
                confirmButtonText={"Eliminar"}
                onSave={handleModalConfirm}
            />

            <CustomModal
                show={showApprove}
                onHide={() => setShowApprove(false)}
                title={`Aprobar comentario de ${selectedUserName}`}
                bodyText={`Vas a aprobar el siguiente mensaje de ${selectedUserName}: "${selectedMessage}". ¿Deseas continuar?`}
                confirmButtonText={"Aprobar"}
                onSave={handleModalApprove}
            />
        </div>
    );
};

export default ChatReports;
