import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGraduationCap, faTrain, faShoppingCart, faGlassCheers, faHospital, faHome, 
    faCheck, faTimes, faExternalLinkAlt, faChild, faSchool, faBook, 
    faNotesMedical, faPrescriptionBottleAlt, faBus, faPlane, faShoppingBag,
    faDumbbell, faUtensils, faTree, faFilm, faLandmark, faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { Card, ListGroup, Badge, Spinner } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import Gallery from 'react-image-gallery';
import axios from 'axios';
import 'react-image-gallery/styles/css/image-gallery.css';
import '../css/gallery.css';

function DetallePiso() {
    const location = useLocation();
    const navigate = useNavigate();
    const piso = location.state?.piso;
    const [sitiosInteres, setSitiosInteres] = useState([]);
    const [loadingPOI, setLoadingPOI] = useState(false);
    const [errorPOI, setErrorPOI] = useState(null);
    
    const API_URL = 'https://uniliving-backend.onrender.com';

    useEffect(() => {
        if (!piso) {
            navigate('/principal', { replace: true });
            return;
        }
        
        const fetchNearbyEquipments = async () => {
            if (!piso.coordenadas || !piso.coordenadas[0] || !piso.coordenadas[1]) return;
            
            try {
                setLoadingPOI(true);
                setErrorPOI(null);
                
                const response = await axios.get(`${API_URL}/apartments/equipamientos-cercanos`, {
                    params: {
                        lat: piso.coordenadas[0],
                        lon: piso.coordenadas[1]
                    }
                });
                
                if (response.data) {

                    const poiCategories = Object.keys(response.data);
                    
                    let allPOIs = [];
                    
                    poiCategories.forEach(category => {
                        if (Array.isArray(response.data[category]) && response.data[category].length > 0) {

                            const closestPOI = response.data[category][0];
                            
                            allPOIs.push({
                                nombre: closestPOI.title,
                                distancia: `${(closestPOI.distance*1000).toFixed(2)} km`,
                                enlace: closestPOI.link || closestPOI.url,
                                categoria: category,
                                coordenadas: closestPOI.geometry ? closestPOI.geometry.coordinates : null
                            });
                        }
                    });
                    
                    allPOIs.sort((a, b) => {
                        const distA = parseFloat(a.distancia);
                        const distB = parseFloat(b.distancia);
                        return distA - distB;
                    });
                    
                    allPOIs = allPOIs.slice(0, 10);
                    
                    setSitiosInteres(allPOIs);
                }
                
                setLoadingPOI(false);
            } catch (error) {
                console.error('Error fetching nearby equipments:', error);
                setErrorPOI('No se pudieron cargar los sitios de interés cercanos');
                setLoadingPOI(false);
            }
        };
        
        fetchNearbyEquipments();
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

    // Función para obtener el icono según la categoría
    const getCategoryIcon = (category) => {

        if (category === 'Universitaria' || category.includes('Universidad')) {
            return faGraduationCap;
        }
        if (category === 'Educación Infantil' || category.includes('Infantil')) {
            return faChild;
        }
        if (category === 'Educación Secundaria' || category.includes('Secundaria') || category.includes('Instituto')) {
            return faSchool;
        }
        if (category === 'Bibliotecas' || category.includes('Biblioteca')) {
            return faBook;
        }
        if (category === 'Hospitales' || category.includes('Hospital')) {
            return faHospital;
        }
        if (category === 'Centros de Salud' || category.includes('Salud') || category.includes('Médico')) {
            return faNotesMedical;
        }
        if (category === 'Farmacias' || category.includes('Farmacia')) {
            return faPrescriptionBottleAlt;
        }
        if (category === 'Transporte Urbano' || category.includes('Bus') || category.includes('Autobús')) {
            return faBus;
        }
        if (category.includes('Metro') || category.includes('Tren') || category.includes('Cercanías')) {
            return faTrain;
        }
        if (category.includes('Aeropuerto')) {
            return faPlane;
        }
        if (category === 'Supermercados Pequeños' || category === 'Supermercados Medianos' || 
            category.includes('Supermercado') || category.includes('Tienda')) {
            return faShoppingCart;
        }
        if (category.includes('Centro Comercial') || category.includes('Mall')) {
            return faShoppingBag;
        }
        if (category === 'Fitness' || category.includes('Gimnasio') || category.includes('Deporte')) {
            return faDumbbell;
        }
        if (category.includes('Restaurante') || category.includes('Bar') || category.includes('Café')) {
            return faUtensils;
        }
        if (category.includes('Parque') || category.includes('Jardín')) {
            return faTree;
        }
        if (category.includes('Cine') || category.includes('Teatro')) {
            return faFilm;
        }
        if (category.includes('Museo') || category.includes('Galería')) {
            return faLandmark;
        }
        if (category.includes('Ocio') || category.includes('Entretenimiento')) {
            return faGlassCheers;
        }
        
        // Icono por defecto para categorías no especificadas
        return faMapMarkerAlt;
    };

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
                            <Card.Subtitle className="fs-4 mt-2 mb-4">{piso.precio}€ por mes</Card.Subtitle>
                            
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
                            
                            <div className="mt-4">
                                <hr />
                                <Card.Text className="fs-6">{piso.descripcion}</Card.Text>
                            </div>
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
                                    <div className="d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon 
                                            icon={piso.furnished ? faCheck : faTimes} 
                                            className={`me-2 ${piso.furnished ? 'text-success' : 'text-danger'}`} 
                                        />
                                        <span>Amueblado</span>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="d-flex align-items-center justify-content-center">
                                        <FontAwesomeIcon 
                                            icon={piso.parking ? faCheck : faTimes} 
                                            className={`me-2 ${piso.parking ? 'text-success' : 'text-danger'}`} 
                                        />
                                        <span>Parking</span>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="d-flex align-items-center justify-content-center">
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
                            
                            {loadingPOI ? (
                                <div className="d-flex justify-content-center p-4">
                                    <Spinner animation="border" role="status" variant="primary">
                                        <span className="visually-hidden">Cargando...</span>
                                    </Spinner>
                                </div>
                            ) : errorPOI ? (
                                <div className="alert alert-warning text-center">{errorPOI}</div>
                            ) : sitiosInteres.length === 0 ? (
                                <div className="alert alert-info text-center">No se encontraron sitios de interés cercanos</div>
                            ) : (
                                <ListGroup className="h-100">
                                    {sitiosInteres.map((sitio, index) => (
                                        <ListGroup.Item key={index} className="d-flex align-items-center p-3 border-bottom">
                                            <div className="icon-container" style={{ width: '40px', display: 'flex', justifyContent: 'center' }}>
                                                <FontAwesomeIcon icon={getCategoryIcon(sitio.categoria)} size="2x" />
                                            </div>
                                            <div className="w-100 ms-3 d-flex justify-content-between align-items-center">
                                                <div>
                                                    <p className="fs-5 fw-bold mb-0">{sitio.nombre}</p>
                                                    {sitio.enlace && (
                                                        <a 
                                                            href={sitio.enlace} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-primary"
                                                            style={{ fontSize: '0.85rem' }}
                                                        >
                                                            Más información <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                                                        </a>
                                                    )}
                                                </div>
                                                <p className="fs-5 mb-0 text-end">{sitio.distancia}</p>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
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
