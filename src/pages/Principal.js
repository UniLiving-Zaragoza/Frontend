import React, { useState, useEffect } from 'react';
import { Filter, MessageCircle, RefreshCcw, X } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Accordion, Button, Form, Offcanvas, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import InfoPiso from '../components/CustomModalHouse';
import L from 'leaflet';
import Slider from 'rc-slider';
import axios from 'axios';
import 'rc-slider/assets/index.css';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

const barriosZaragoza = [
  "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
  "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
  "Centro", "Las Fuentes", "Universidad", "San José",
  "Casablanca", "Torrero-La Paz", "Sur"
];

const createIcon = (price) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background: #000842; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold;">${price}</div>`,
    iconSize: [50, 30]
  });
};

// Componente para manejar los clusters de marcadores
const ClusterLayer = ({ apartments, transformApartmentData, setSelectedPiso }) => {
  const map = useMap();
  
  useEffect(() => {
    const markerClusterGroup = L.markerClusterGroup({
      disableClusteringAtZoom: 16,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: function(zoom) {
        if (zoom < 13) return 80;
        if (zoom < 15) return 50;
        return 30;
      }
    });
    
    apartments.forEach((apartment) => {
      const transformedApartment = transformApartmentData(apartment);
      const marker = L.marker(
        transformedApartment.coordenadas,
        { icon: createIcon(transformedApartment.precio + '€') }
      ).on('click', () => setSelectedPiso(transformedApartment));
      
      markerClusterGroup.addLayer(marker);
    });
    
    map.addLayer(markerClusterGroup);
    
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [apartments, map, transformApartmentData, setSelectedPiso]);
  
  return null;
};

const Principal = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPiso, setSelectedPiso] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filters, setFilters] = useState({
    precio: '',
    precioMin: '',
    tamaño: '',
    tamañoMax: '',
    habitaciones: '',
    baños: '',
    barrio: '',
    furnished: '',
    parking: '',
    shared: ''
  });

  const API_URL = 'https://uniliving-backend.onrender.com';

  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/apartments`);
        setApartments(response.data);
        setFilteredApartments(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError('Error al cargar los apartamentos');
        setIsLoading(false);
      }
    };

    fetchApartments();
  }, [token]);

  useEffect(() => {
    let count = 0;
    if (filters.precio) count++;
    if (filters.precioMin) count++;
    if (filters.tamaño) count++;
    if (filters.tamañoMax) count++;
    if (filters.habitaciones) count++;
    if (filters.baños) count++;
    if (filters.barrio) count++;
    if (filters.furnished) count++;
    if (filters.parking) count++;
    if (filters.shared) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Función para limpiar caracteres corruptos
  const cleanText = (text) => {
    if (!text) return '';
    
    let cleaned = text.replace(/�/g, '');
    
    cleaned = cleaned.replace(/[\u{0080}-\u{FFFF}]/gu, (match) => {
      const normalizations = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'ñ': 'n', 'Ñ': 'N',
        '€': 'EUR'
      };
      
      return normalizations[match] || match;
    });
    
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  };

  const transformApartmentData = (apartment) => {
    return {
      id: apartment.id,
      precio: apartment.price,
      coordenadas: [apartment.latitude, apartment.longitude],
      foto: apartment.images && apartment.images.length > 0 ? apartment.images[0].url : 'https://via.placeholder.com/300',
      descripcion: cleanText(apartment.description) || 'Sin descripción',
      habitaciones: apartment.numRooms || 0,
      metros: apartment.size || 0,
      baño: apartment.numBathrooms || 0,
      barrio: cleanText(apartment.district) || '',
      galeria: apartment.images ? apartment.images.map(img => img.url) : [],
      idealistaUrl: apartment.idealistaUrl || '',
      furnished: apartment.furnished || false,
      parking: apartment.parking || false,
      shared: apartment.shared || false,
      sitiosInteres: [
        { nombre: "Campus Río Ebro", distancia: "Calculando..." },
        { nombre: "Ciudad Universitaria", distancia: "Calculando..." },
        { nombre: "Estación Delicias", distancia: "Calculando..." },
        { nombre: "Supermercado", distancia: "Calculando..." },
        { nombre: "Casco histórico", distancia: "Calculando..." },
        { nombre: "Centro de Salud", distancia: "Calculando..." }
      ]
    };
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setFilteredApartments(
      apartments.filter(apartment => {
        const transformedApartment = transformApartmentData(apartment);
        return (
          (!filters.habitaciones || transformedApartment.habitaciones === parseInt(filters.habitaciones)) &&
          (!filters.baños || apartment.numBathrooms === parseInt(filters.baños)) &&
          (!filters.barrio || transformedApartment.barrio === filters.barrio) &&
          (!filters.precio || transformedApartment.precio <= parseInt(filters.precio)) &&
          (!filters.precioMin || transformedApartment.precio >= parseInt(filters.precioMin)) &&
          (!filters.tamaño || transformedApartment.metros >= parseInt(filters.tamaño)) &&
          (!filters.tamañoMax || transformedApartment.metros <= parseInt(filters.tamañoMax)) &&
          (!filters.furnished || apartment.furnished?.toString() === filters.furnished) &&
          (!filters.parking || apartment.parking?.toString() === filters.parking) &&
          (!filters.shared || apartment.shared?.toString() === filters.shared)
        );
      })
    );
    setShowFilters(false);
  };  

  const resetFilters = () => {
    setFilters({
      precio: '',
      precioMin: '',
      tamaño: '',
      tamañoMax: '',
      habitaciones: '',
      baños: '',
      barrio: '',
      furnished: '',
      parking: '',
      shared: ''
    });
    setFilteredApartments(apartments);
  };

  return (
    <div className="App position-relative" style={{ height: '100vh', overflow: 'hidden' }}>
      <CustomNavbar />

      {/* Botón filtros */}
      <button
        className="btn position-absolute start-0 d-flex align-items-center"
        style={{
          backgroundColor: '#000842',
          color: 'white',
          borderColor: '#000842',
          zIndex: 1000,
          top: '56px',
          margin: '0.5rem',
          left: '0'
        }}
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="me-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <Badge 
            bg="danger" 
            className="ms-2"
            style={{ fontSize: '0.75rem' }}
          >
            {activeFiltersCount}
          </Badge>
        )}
      </button>

      {/* Mapa centrado en Zaragoza */}
      <MapContainer
        center={[41.65, -0.889]}
        zoom={13}
        minZoom={10}
        maxZoom={18}
        maxBounds={[[41.45, -1.15], [41.85, -0.65]]}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        style={{
          position: 'absolute',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
          height: '100%',
          width: '100%',
          zIndex: 1
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomleft" />

        {/* Marcadores de pisos con clustering */}
        {!isLoading && !error && (
          <ClusterLayer 
            apartments={filteredApartments} 
            transformApartmentData={transformApartmentData} 
            setSelectedPiso={setSelectedPiso}
          />
        )}
      </MapContainer>

      {/* Botón chat */}
      <Link to={isAuthenticated ? "/lista-chats" : "/login"}>
        <button
          className="btn btn-round position-absolute bottom-0 end-0 m-3 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: '#000842',
            color: 'white',
            borderColor: '#000842',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            zIndex: 1000
          }}
        >
          <MessageCircle size={30} />
        </button>
      </Link>

      {/* Panel de filtros lateral */}
      <Offcanvas 
        show={showFilters} 
        onHide={() => setShowFilters(false)} 
        placement="start"
        style={{ maxWidth: '330px' }}
      >
        <Offcanvas.Header closeButton style={{ backgroundColor: '#000842', color: 'white' }}>
          <Offcanvas.Title>Filtros de búsqueda</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span>Precio y Tamaño</span>
              </Accordion.Header>
              <Accordion.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Rango de precio: {filters.precioMin || 0}€ - {filters.precio || 2500}€</Form.Label>
                  <Slider
                    range
                    min={0}
                    max={2500}
                    step={50}
                    defaultValue={[filters.precioMin || 0, filters.precio || 2500]}
                    onChange={([min, max]) => setFilters({ ...filters, precioMin: min, precio: max })}
                  />
                </Form.Group>

                <Row>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label>Tamaño mín. (m²)</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="tamaño" 
                        min={0}
                        value={filters.tamaño} 
                        onChange={handleFilterChange}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label>Tamaño máx. (m²)</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="tamañoMax" 
                        min={0}
                        value={filters.tamañoMax} 
                        onChange={handleFilterChange}
                        size="sm"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <span>Características</span>
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label>Habitaciones</Form.Label>
                      <Form.Select 
                        name="habitaciones" 
                        value={filters.habitaciones} 
                        onChange={handleFilterChange}
                        size="sm"
                      >
                        <option value="">Cualquiera</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group>
                      <Form.Label>Baños</Form.Label>
                      <Form.Select 
                        name="baños" 
                        value={filters.baños} 
                        onChange={handleFilterChange}
                        size="sm"
                      >
                        <option value="">Cualquiera</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3+</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Form.Group className="mb-2">
                    <Form.Check 
                      type="checkbox" 
                      id="furnished-check"
                      name="furnished" 
                      label="Amueblado" 
                      checked={filters.furnished === 'true'} 
                      onChange={(e) => setFilters({ ...filters, furnished: e.target.checked ? 'true' : '' })} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Check 
                      type="checkbox" 
                      id="parking-check"
                      name="parking" 
                      label="Estacionamiento" 
                      checked={filters.parking === 'true'} 
                      onChange={(e) => setFilters({ ...filters, parking: e.target.checked ? 'true' : '' })} 
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Check 
                      type="checkbox" 
                      id="shared-check"
                      name="shared" 
                      label="Compartido" 
                      checked={filters.shared === 'true'} 
                      onChange={(e) => setFilters({ ...filters, shared: e.target.checked ? 'true' : '' })} 
                    />
                  </Form.Group>
                </div>
              </Accordion.Body>
            </Accordion.Item>
            
            <Accordion.Item eventKey="2">
              <Accordion.Header>
                <span>Ubicación</span>
              </Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Label>Barrio</Form.Label>
                  <Form.Select 
                    name="barrio" 
                    value={filters.barrio} 
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos los barrios</option>
                    {barriosZaragoza.map((barrio, index) => (
                      <option key={index} value={barrio}>
                        {barrio}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <div className="d-flex justify-content-center mt-3">
                  <Link to="/analiticas" style={{ color: 'blue', textDecoration: 'none' }}>
                    Ver datos de las zonas
                  </Link>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          
          <div className="d-grid gap-2 mt-4">
            <Button 
              variant="primary" 
              style={{ backgroundColor: "#000842", borderColor: "#000842" }} 
              onClick={applyFilters}
            >
              Aplicar filtros
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={resetFilters} 
              className="d-flex align-items-center justify-content-center"
            >
              <RefreshCcw size={16} className="me-2" />
              Restablecer filtros
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Indicador de filtros activos */}
      {activeFiltersCount > 0 && (
        <div 
          className="position-absolute start-0 bg-white p-2 shadow d-flex align-items-center"
          style={{
            zIndex: 999,
            top: '100px',
            margin: '0.5rem',
            left: '0',
            borderRadius: '5px',
            fontSize: '0.9rem'
          }}
        >
          <Badge bg="primary" style={{ backgroundColor: "#000842" }}>
            {filteredApartments.length} resultados
          </Badge>
          <span className="ms-2">{activeFiltersCount} filtros aplicados</span>
          <Button 
            variant="link" 
            className="p-0 ms-2" 
            onClick={resetFilters}
            style={{ color: '#000842' }}
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {/* Modal de piso */}
      {selectedPiso && (
        <InfoPiso
          show={true}
          onHide={() => setSelectedPiso(null)}
          piso={selectedPiso}
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 1002,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          Cargando apartamentos...
        </div>
      )}
    </div>
  );
};

export default Principal;