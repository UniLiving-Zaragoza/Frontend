import { useLocation, Link, useNavigate } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import Gallery from 'react-image-gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faTrain, faShoppingCart, faGlassCheers, faHospital, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../css/gallery.css';
import { useEffect } from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function DetallePiso() {
    const location = useLocation();
    const navigate = useNavigate();
    const piso = location.state?.piso;

    useEffect(() => {
        if (!piso) {
            navigate('/principal', { replace: true });
        }
    }, [piso, navigate]);

    if (!piso) {
        return null;
    }

    const images = piso.galeria?.map(url => ({
        original: url,
        thumbnail: url
    })) || [];

    return (
        <div className="App position-relative">
            <CustomNavbar />

            <Link
                to="/principal"
                className="position-absolute top-0 start-0 p-3 d-none d-md-block"
                style={{ marginTop: "60px", zIndex: 1000 }}
            >
                <FontAwesomeIcon icon={faTimes} size="2x" />
            </Link>


            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "80px", height: "95vh", margin: "2vh 4vw" }}>
                <div className="d-flex flex-column w-100 h-100 gap-3">
                    {/* Primera tarjeta con la galería */}
                    <Card className="w-100 border-dark bg-light p-3">
                        <Gallery items={images} showThumbnails={false} showFullscreenButton={false} showPlayButton={false} />
                        <Card.Body className="text-center">
                            <Card.Body className="text-center">
                                <Card.Title className="fs-4">{piso.direccion}</Card.Title>
                                <Card.Subtitle className="text-primary fs-5">{piso.precio}€ / mes</Card.Subtitle>
                                <Card.Text className="fs-6">{piso.habitaciones} hab | {piso.metros} m²</Card.Text>
                                <Card.Text className="fs-5">{piso.descripcion}</Card.Text>
                            </Card.Body>
                        </Card.Body>
                    </Card>

                    {/* Segunda tarjeta con sitios de interés */}
                    <Card className="w-100 border-dark p-4 bg-white">
                        <Card.Body className="p-0">
                            <Card.Title className="text-center fw-bold">Sitios de interés cercanos al piso</Card.Title>
                            <hr />
                            <ListGroup className="h-100">
                                <ListGroup.Item className="d-flex align-items-center p-3 border-bottom">
                                    <FontAwesomeIcon icon={faGraduationCap} size="2x" className="me-3" />
                                    <div className="w-100 d-flex justify-content-between">
                                        <p className="fs-5 fw-bold mb-0">{piso.sitiosInteres[0].nombre}</p>
                                        <p className="fs-5 fw-bold mb-0 text-end">{piso.sitiosInteres[0].distancia}</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center p-3 border-bottom">
                                    <FontAwesomeIcon icon={faGraduationCap} size="2x" className="me-3" />
                                    <div className="w-100 d-flex justify-content-between">
                                        <p className="fs-5 fw-bold mb-0">{piso.sitiosInteres[1].nombre}</p>
                                        <p className="fs-5 fw-bold mb-0 text-end">{piso.sitiosInteres[1].distancia}</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center p-3 border-bottom">
                                    <FontAwesomeIcon icon={faTrain} size="2x" className="me-3" />
                                    <div className="w-100 d-flex justify-content-between">
                                        <p className="fs-5 fw-bold mb-0">{piso.sitiosInteres[2].nombre}</p>
                                        <p className="fs-5 fw-bold mb-0 text-end">{piso.sitiosInteres[2].distancia}</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center p-3 border-bottom">
                                    <FontAwesomeIcon icon={faShoppingCart} size="2x" className="me-3" />
                                    <div className="w-100 d-flex justify-content-between">
                                        <p className="fs-5 fw-bold mb-0">{piso.sitiosInteres[3].nombre}</p>
                                        <p className="fs-5 fw-bold mb-0 text-end">{piso.sitiosInteres[3].distancia}</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center p-3 border-bottom">
                                    <FontAwesomeIcon icon={faGlassCheers} size="2x" className="me-3" />
                                    <div className="w-100 d-flex justify-content-between">
                                        <p className="fs-5 fw-bold mb-0">{piso.sitiosInteres[4].nombre}</p>
                                        <p className="fs-5 fw-bold mb-0 text-end">{piso.sitiosInteres[4].distancia}</p>
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex align-items-center p-3">
                                    <FontAwesomeIcon icon={faHospital} size="2x" className="me-3" />
                                    <div className="w-100 d-flex justify-content-between">
                                        <p className="fs-5 fw-bold mb-0">{piso.sitiosInteres[5].nombre}</p>
                                        <p className="fs-5 fw-bold mb-0 text-end">{piso.sitiosInteres[5].distancia}</p>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default DetallePiso;
