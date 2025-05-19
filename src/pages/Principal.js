import React, { useState, useEffect } from 'react';
import { Filter, MessageCircle, RefreshCcw } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Marker } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Accordion, Button, Form } from 'react-bootstrap';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import InfoPiso from '../components/CustomModalHouse';
import L from 'leaflet';
import Slider from 'rc-slider';
import axios from 'axios';
import 'rc-slider/assets/index.css';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const Principal = () => {

  const [showFilters, setShowFilters] = useState(false);
  const [selectedPiso, setSelectedPiso] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [filteredApartments, setFilteredApartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await axios.get(`${API_URL}/apartments`, config);
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

  const transformApartmentData = (apartment) => {
    return {
      id: apartment.id,
      precio: apartment.price,
      direccion: apartment.description?.split('.')[0] || 'Dirección no disponible',
      coordenadas: [apartment.latitude, apartment.longitude],
      foto: apartment.images && apartment.images.length > 0 ? apartment.images[0].url : 'https://via.placeholder.com/300',
      descripcion: apartment.description || 'Sin descripción',
      habitaciones: apartment.numRooms || 0,
      metros: apartment.size || 0,
      baño: apartment.numBathrooms || 0,
      barrio: apartment.district || '',
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
        className="btn position-absolute start-0"
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

        {/* Marcadores de pisos */}
        {isLoading ? (
          <div className="loading-overlay">Cargando apartamentos...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          filteredApartments.map((apartment, index) => {
            const transformedApartment = transformApartmentData(apartment);
            return (
              <Marker
                key={apartment.id || index}
                position={transformedApartment.coordenadas}
                icon={createIcon(transformedApartment.precio + '€')}
                eventHandlers={{ click: () => setSelectedPiso(transformedApartment) }}
              />
            );
          })
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

      {/* Filtros */}
      {showFilters && (
        <div
        className="position-absolute start-0 bg-white p-3 shadow"
        style={{
          zIndex: 1001,
          top: '100px',
          margin: '0.5rem',
          left: '0',
          width: '300px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          borderRadius: '10px'
        }}
        >      
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <span style={{ marginRight: "15px" }}>Datos del Piso</span>
              </Accordion.Header>
              <Accordion.Body>
                <Form>

                <Form.Group>
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

                <Form.Group className="mt-2">
                  <Form.Label>Tamaño mínimo</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="tamaño" 
                    min={0}
                    value={filters.tamaño} 
                    onChange={handleFilterChange} 
                    placeholder="Tamaño mínimo (m²)" 
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Tamaño máximo</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="tamañoMax" 
                    min={0}
                    value={filters.tamañoMax} 
                    onChange={handleFilterChange} 
                    placeholder="Tamaño máximo (m²)" 
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Habitaciones</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="habitaciones" 
                    min={0}
                    value={filters.habitaciones} 
                    onChange={handleFilterChange} 
                    placeholder="Número de habitaciones" 
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Label>Baños</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="baños" 
                    min={0}
                    value={filters.baños} 
                    onChange={handleFilterChange} 
                    placeholder="Número de baños" 
                  />
                </Form.Group>

                <Form.Group className="mt-2">
                  <Form.Check 
                    type="checkbox" 
                    id="furnished-check"
                    name="furnished" 
                    label="Amueblado" 
                    checked={filters.furnished === 'true'} 
                    onChange={(e) => setFilters({ ...filters, furnished: e.target.checked ? 'true' : '' })} 
                  />
                </Form.Group>

                <Form.Group className="mt-1">
                  <Form.Check 
                    type="checkbox" 
                    id="parking-check"
                    name="parking" 
                    label="Estacionamiento" 
                    checked={filters.parking === 'true'} 
                    onChange={(e) => setFilters({ ...filters, parking: e.target.checked ? 'true' : '' })} 
                  />
                </Form.Group>

                <Form.Group className="mt-1">
                  <Form.Check 
                    type="checkbox" 
                    id="shared-check"
                    name="shared" 
                    label="Compartido" 
                    checked={filters.shared === 'true'} 
                    onChange={(e) => setFilters({ ...filters, shared: e.target.checked ? 'true' : '' })} 
                  />
                </Form.Group>

                </Form>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>
                <span style={{ marginRight: "15px" }}>Datos de la Ciudad</span>
              </Accordion.Header>
              <Accordion.Body>
              <Form.Group>
                <Form.Label>Barrio</Form.Label>
                <Form.Select name="barrio" value={filters.barrio} onChange={handleFilterChange}>
                  <option value="">Selecciona un barrio</option>
                  {barriosZaragoza.map((barrio, index) => (
                    <option key={index} value={barrio}>
                      {barrio}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <div className="d-flex justify-content-center mt-3">
              <Link to="/analiticas" style={{ color: 'blue', textDecoration: 'none' }}>
                Ver datos de las zonas
              </Link>
            </div>
          </Accordion>
          <div className="d-flex justify-content-between mt-3">
            <Button variant="primary" style={{ backgroundColor: "#000842" }} onClick={applyFilters}>Aplicar</Button>
            <Button variant="secondary" style={{ backgroundColor: "#000842" }} onClick={resetFilters}>
              <RefreshCcw size={20} />
            </Button>
          </div>
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