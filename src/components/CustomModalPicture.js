import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function CustomModal({ title, confirmButtonText, onSave, show, onHide }) {
    const [newPhoto, setNewPhoto] = useState('');

    const handleSave = () => {
        if (onSave) {
            onSave(newPhoto);
        }
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="mb-3">
                    <strong>Nueva foto de perfil:</strong>
                    <Form.Control
                        type="text"
                        placeholder="Introduce el enlace de la nueva foto"
                        value={newPhoto}
                        onChange={(e) => setNewPhoto(e.target.value)}
                    />
                    {newPhoto && (
                        <div className="text-center mt-3">
                            <img src={newPhoto} alt="Previsualización" className="rounded" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" style={{ backgroundColor: "#000842" }} onClick={handleSave}>
                    {confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CustomModal;
