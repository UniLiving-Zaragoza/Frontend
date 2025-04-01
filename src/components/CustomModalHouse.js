import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

function InfoPiso({ show, onHide, piso }) {
    const navigate = useNavigate();
    if (!piso) return null;

    const handleRedirect = () => {
        navigate('/detalles-piso', { state: { piso } });
    };
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body onClick={handleRedirect} style={{ cursor: 'pointer' }}>
                <div className="d-flex flex-column align-items-center">
                    <img src={piso.foto} alt="Imagen del piso" className="img-fluid mb-3" />
                    <h3 className="text-center">Piso en {piso.direccion}</h3>
                    <h4 className="text-center">{piso.precio}€ / mes</h4>
                    <p className="text-center">{piso.descripcion}</p>
                    <p className="text-center">{piso.habitaciones} hab • {piso.metros} m²</p>
                </div>
            </Modal.Body>

        </Modal>
    );
}

export default InfoPiso;

