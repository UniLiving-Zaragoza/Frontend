import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { Filter, MessageCircle, RefreshCcw } from 'lucide-react';
import InfoPiso from '../components/CustomModalHouse';
import { MapContainer, TileLayer, ZoomControl, Marker } from 'react-leaflet';
import L from 'leaflet';
import CustomNavbar from '../components/CustomNavbar';
import { Accordion, Button, Form } from 'react-bootstrap';

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
  const [filters, setFilters] = useState({ precio: '', tamaño: '', habitaciones: '', barrio: '' });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setFilteredPisos(
      pisos.filter(piso =>
        (!filters.habitaciones || piso.habitaciones === parseInt(filters.habitaciones)) &&
        (!filters.barrio || piso.barrio === filters.barrio) &&
        (!filters.precio || piso.precio <= parseInt(filters.precio)) &&
        (!filters.tamaño || piso.metros >= parseInt(filters.tamaño))
      )
    );
  };

  const resetFilters = () => {
    setFilters({ precio: '', tamaño: '', habitaciones: '', barrio: '' });
    setFilteredPisos(pisos);
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

      {/* Mapa centrado en el barrio del Actur */}
      <MapContainer
        center={[41.675, -0.889]}
        zoom={16}
        zoomControl={false}
        style={{
          height: 'calc(100vh - 56px)',
          width: '100%',
          position: 'absolute',
          top: '56px',
          zIndex: 1,
          left: 0,
          right: 0
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
      <button
        className="btn btn-round position-absolute bottom-0 end-0 m-3 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: '#000842',
          color: 'white',
          borderColor: '#000842',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          zIndex: 1000
        }}
      >
        <MessageCircle size={30} />
      </button>

      {/* Filtros */}
      {showFilters && (
        <div className="position-absolute start-0 bg-white p-3 shadow" style={{ zIndex: 1001, top: '100px', margin: '0.5rem', left: '0' }}>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Datos del Piso</Accordion.Header>
              <Accordion.Body>
                <Form>
                  <Form.Group>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control type="number" name="precio" value={filters.precio} onChange={handleFilterChange} placeholder="Precio máximo" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Tamaño</Form.Label>
                    <Form.Control type="number" name="tamaño" value={filters.tamaño} onChange={handleFilterChange} placeholder="Tamaño mínimo" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Habitaciones</Form.Label>
                    <Form.Control type="number" name="habitaciones" value={filters.habitaciones} onChange={handleFilterChange} placeholder="Número de habitaciones" />
                  </Form.Group>
                </Form>
                {/* En el futuro, añadir más filtros */}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Datos de la Ciudad</Accordion.Header>
              <Accordion.Body>
                <Form.Group>
                  <Form.Label>Barrio</Form.Label>
                  <Form.Select name="barrio" value={filters.barrio} onChange={handleFilterChange}>
                    <option value="">Selecciona un barrio</option>
                    <option value="Actur">Actur</option>
                    <option value="Delicias">Delicias</option>
                    <option value="Centro">Centro</option>
                  </Form.Select>
                </Form.Group>
                {/* En el futuro, añadir más filtros */}
              </Accordion.Body>
            </Accordion.Item>
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