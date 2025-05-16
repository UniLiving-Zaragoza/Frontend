import React, { useState } from 'react';
import { Filter, MessageCircle, RefreshCcw } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Marker } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Accordion, Button, Form } from 'react-bootstrap';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import InfoPiso from '../components/CustomModalHouse';
import L from 'leaflet';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const pisos = [
  {
    precio: 900,
    direccion: "Calle Pablo Ruiz Picasso, 12",
    coordenadas: [41.677, -0.886],
    foto: "https://imagenes.heraldo.es/files/image_990_556/files/fp/uploads/imagenes/2023/06/01/asi-es-casanate-la-promocion-de-viviendas-junto-a-la-estacion-delicias-18.r_d.2911-3340.jpeg",
    descripcion: "Piso amplio con balcón y buena iluminación.",
    habitaciones: 3,
    metros: 90,
    barrio: "Actur",
    galeria: [
      "https://imagenes.heraldo.es/files/image_990_556/files/fp/uploads/imagenes/2023/06/01/asi-es-casanate-la-promocion-de-viviendas-junto-a-la-estacion-delicias-18.r_d.2911-3340.jpeg",
      "https://imagenes.heraldo.es/files/image_990_556/files/fp/uploads/imagenes/2023/06/01/asi-es-casanate-la-promocion-de-viviendas-junto-a-la-estacion-delicias-18.r_d.2911-3340.jpeg",
      "https://imagenes.heraldo.es/files/image_990_556/files/fp/uploads/imagenes/2023/06/01/asi-es-casanate-la-promocion-de-viviendas-junto-a-la-estacion-delicias-18.r_d.2911-3340.jpeg"
    ],
    sitiosInteres: [
      { nombre: "Campus Río Ebro", distancia: "1.8 km" },
      { nombre: "Ciudad Universitaria", distancia: "3.2 km" },
      { nombre: "Estación Delicias", distancia: "3 km" },
      { nombre: "Supermercado", distancia: "100 m" },
      { nombre: "Casco histórico", distancia: "3 km" },
      { nombre: "Centro de Salud Actur Norte", distancia: "443 m" }
    ]
  },
  {
    precio: 750,
    direccion: "Avenida Ranillas, 25",
    coordenadas: [41.679, -0.890],
    foto: "https://static.fotocasa.es/images/anuncio/2023/06/04/178061581/3135683589.jpg?rule=web_360x270",
    descripcion: "Apartamento moderno cerca del tranvía.",
    habitaciones: 2,
    metros: 80,
    barrio: "Actur",
    galeria: [
      "https://static.fotocasa.es/images/anuncio/2023/06/04/178061581/3135683589.jpg?rule=web_360x270",
      "https://static.fotocasa.es/images/anuncio/2023/06/04/178061581/3135683589.jpg?rule=web_360x270",
      "https://static.fotocasa.es/images/anuncio/2023/06/04/178061581/3135683589.jpg?rule=web_360x270"
    ],
    sitiosInteres: [
      { nombre: "Campus Río Ebro", distancia: "1.5 km" },
      { nombre: "Ciudad Universitaria", distancia: "3 km" },
      { nombre: "Estación Delicias", distancia: "2 km" },
      { nombre: "Supermercado", distancia: "500 m" },
      { nombre: "Casco histórico", distancia: "3 km" },
      { nombre: "Centro de Salud Actur Norte", distancia: "500 m" }
    ]
  },
  {
    precio: 1100,
    direccion: "Calle Margarita Xirgú, 8",
    coordenadas: [41.674, -0.892],
    foto: "https://static.fotocasa.es/images/anuncio/2023/02/09/176740502/2832606199.jpg?rule=web_360x270",
    descripcion: "Ático con terraza y vistas al parque.",
    habitaciones: 4,
    metros: 120,
    barrio: "Actur",
    galeria: [
      "https://static.fotocasa.es/images/anuncio/2023/02/09/176740502/2832606199.jpg?rule=web_360x270",
      "https://static.fotocasa.es/images/anuncio/2023/02/09/176740502/2832606199.jpg?rule=web_360x270",
      "https://static.fotocasa.es/images/anuncio/2023/02/09/176740502/2832606199.jpg?rule=web_360x270"
    ],
    sitiosInteres: [
      { nombre: "Campus Río Ebro", distancia: "2.5 km" },
      { nombre: "Ciudad Universitaria", distancia: "3.5 km" },
      { nombre: "Estación Delicias", distancia: "1.5 km" },
      { nombre: "Supermercado", distancia: "230 m" },
      { nombre: "Casco histórico", distancia: "3.7 km" },
      { nombre: "Centro de Salud Actur Norte", distancia: "540 m" }
    ]
  }
];

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
  const [filteredPisos, setFilteredPisos] = useState(pisos);
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

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setFilteredPisos(
      pisos.filter(piso =>
        (!filters.habitaciones || piso.habitaciones === parseInt(filters.habitaciones)) &&
        (!filters.baños || piso.baños === parseInt(filters.baños)) &&
        (!filters.barrio || piso.barrio === filters.barrio) &&
        (!filters.precio || piso.precio <= parseInt(filters.precio)) &&
        (!filters.precioMin || piso.precio >= parseInt(filters.precioMin)) &&
        (!filters.tamaño || piso.metros >= parseInt(filters.tamaño)) &&
        (!filters.tamañoMax || piso.metros <= parseInt(filters.tamañoMax)) &&
        (!filters.furnished || piso.furnished?.toString() === filters.furnished) &&
        (!filters.parking || piso.parking?.toString() === filters.parking) &&
        (!filters.shared || piso.shared?.toString() === filters.shared)
      )
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
    setFilteredPisos(pisos);
  };  

  const { isAuthenticated } = useAuth();

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

      {/* Mapa centrado en el barrio del Actur */}
      <MapContainer
        center={[41.675, -0.889]}
        zoom={16}
        minZoom={10}
        maxZoom={18}
        maxBounds={[[41.55, -1.0], [41.75, -0.75]]} 
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
        {filteredPisos.map((piso, index) => (
          <Marker
            key={index}
            position={piso.coordenadas}
            icon={createIcon(piso.precio + '€')}
            eventHandlers={{ click: () => setSelectedPiso(piso) }}
          />
        ))}
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
                {/*HABRÍA QUE AÑADIR ALGÚN CAMPO CON LA INFORMACIÓN DE ZARAGOZA*/}
                <Form.Label>Barrio</Form.Label>
                <Form.Select name="barrio" value={filters.barriosZaragoza} onChange={handleFilterChange}>
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

    </div>
  );
};

export default Principal;