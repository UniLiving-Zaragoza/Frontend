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
                    <img 
                        src={piso.foto} 
                        alt="Imagen del piso" 
                        className="img-fluid mb-3" 
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                    />
                    <h3 className="text-center">{piso.nombre}</h3>
                    <h4 className="text-center">{piso.precio}€ / mes</h4>
                    <p className="text-center">{piso.descripcion && piso.descripcion.length > 100 
                        ? piso.descripcion.substring(0, 100) + '...' 
                        : piso.descripcion}</p>
                    <p className="text-center">{piso.habitaciones} hab • {piso.metros} m²</p>
                    {piso.shared && <div className="badge bg-info mb-2">Compartido</div>}
                    <div className="d-flex gap-2 mb-1">
                        {piso.furnished && <div className="badge bg-secondary">Amueblado</div>}
                        {piso.parking && <div className="badge bg-secondary">Parking</div>}
                    </div>
                </div>
            </Modal.Body>

        </Modal>
    );
}

export default InfoPiso;

