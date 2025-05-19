import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faTrain, faShoppingCart, faGlassCheers, faHospital, faHome, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import Gallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../css/gallery.css';

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

    // Preparar las imágenes para la galería
    const images = piso.galeria && piso.galeria.length > 0
        ? piso.galeria.map(url => ({
            original: url,
            thumbnail: url
        }))
        : [{ 
            original: 'https://via.placeholder.com/600x400?text=No+hay+imagen+disponible',
            thumbnail: 'https://via.placeholder.com/100x67?text=No+hay+imagen+disponible'
        }];

    const sitiosInteres = piso.sitiosInteres || [
        { nombre: "Campus Río Ebro", distancia: "No disponible" },
        { nombre: "Ciudad Universitaria", distancia: "No disponible" },
        { nombre: "Estación Delicias", distancia: "No disponible" },
        { nombre: "Supermercado", distancia: "No disponible" },
        { nombre: "Casco histórico", distancia: "No disponible" },
        { nombre: "Centro de Salud", distancia: "No disponible" }
    ];

    const sitioIcons = [
        faGraduationCap,
        faGraduationCap,
        faTrain,
        faShoppingCart,
        faGlassCheers,
        faHospital
    ];

    return (
        <div className="App position-relative">
            <CustomNavbar />

            <div className="d-flex justify-content-center" style={{ marginTop: "80px", margin: "3vh 6vw", minHeight: "80vh" }}>
                <div className="d-flex flex-column w-100 gap-3" style={{ marginBottom: "20px" }}>
                    {/* Primera tarjeta con la galería */}
                    <Card className="w-100 border-dark bg-light p-3"
                        style={{
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                        }}>
                        <Gallery
                            items={images}
                            showThumbnails={true}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            renderItem={(item) => (
                                <div style={{ textAlign: 'center' }}>
                                <img
                                    src={item.original}
                                    alt={item.originalAlt || ''}
                                    style={{
                                    maxHeight: '350px',
                                    width: 'auto',
                                    maxWidth: '100%',
                                    objectFit: 'contain',
                                    }}
                                />
                                </div>
                            )}
                        />
                        <Card.Body className="text-center">
                            <Card.Title className="fs-4">{piso.direccion}</Card.Title>
                            <Card.Subtitle className="fs-5">{piso.precio}€ por mes</Card.Subtitle>
                            
                            <div className="d-flex justify-content-center gap-2 my-2">
                                {piso.shared && <Badge bg="info">Compartido</Badge>}
                                {piso.furnished && <Badge bg="secondary">Amueblado</Badge>}
                                {piso.parking && <Badge bg="secondary">Parking</Badge>}
                                {piso.barrio && <Badge bg="primary">{piso.barrio}</Badge>}
                            </div>
                            
                            <Card.Text className="fs-6 mt-2">
                                <FontAwesomeIcon icon={faHome} className="me-2" />
                                {piso.habitaciones} habitaciones | {piso.metros} m² | {piso.baño || 1} baño{piso.baño > 1 ? 's' : ''}
                            </Card.Text>
                            
                            {piso.idealistaUrl && (
                                <a 
                                    href={piso.idealistaUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn btn-sm"
                                    style={{ backgroundColor: '#00acff', color: 'white' }}
                                >
                                    Ver en Idealista
                                </a>
                            )}
                            
                            <Card.Text className="fs-5 mt-3">{piso.descripcion}</Card.Text>
                        </Card.Body>
                    </Card>

                    {/* Segunda tarjeta con características adicionales */}
                    <Card className="w-100 border-dark p-4 bg-white mb-3"
                        style={{
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                        }}>
                        <Card.Body className="p-0">
                            <Card.Title className="text-center fw-bold">Características</Card.Title>
                            <hr />
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon 
                                            icon={piso.furnished ? faCheck : faTimes} 
                                            className={`me-2 ${piso.furnished ? 'text-success' : 'text-danger'}`} 
                                        />
                                        <span>Amueblado</span>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon 
                                            icon={piso.parking ? faCheck : faTimes} 
                                            className={`me-2 ${piso.parking ? 'text-success' : 'text-danger'}`} 
                                        />
                                        <span>Parking</span>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon 
                                            icon={piso.shared ? faCheck : faTimes} 
                                            className={`me-2 ${piso.shared ? 'text-success' : 'text-danger'}`} 
                                        />
                                        <span>Compartido</span>
                                    </div>
                                </div>
                            </div>
                            <Card.Title className="text-center fw-bold mt-4">Sitios de interés cercanos</Card.Title>
                            <hr />
                            <ListGroup className="h-100">
                                {sitiosInteres.map((sitio, index) => (
                                    <ListGroup.Item key={index} className="d-flex align-items-center p-3 border-bottom">
                                        <FontAwesomeIcon icon={sitioIcons[index]} size="2x" className="me-3" />
                                        <div className="w-100 d-flex justify-content-between">
                                            <p className="fs-5 fw-bold mb-0">{sitio.nombre}</p>
                                            <p className="fs-5 fw-bold mb-0 text-end">{sitio.distancia}</p>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-center mt-2">
                        <Link
                            to="/principal"
                            className="btn text-center"
                            style={{
                                backgroundColor: '#000842',
                                color: 'white',
                                borderRadius: '10px',
                                padding: '6px 16px',
                                marginTop: '0.5rem',
                                width: '130px',
                                zIndex: 9999,           
                                position: 'relative' 
                            }}
                        >
                            Atrás
                        </Link>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default DetallePiso;
