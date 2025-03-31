import Modal from 'react-bootstrap/Modal';

function InfoPiso({ show, onHide, piso }) {
    if (!piso) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
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

