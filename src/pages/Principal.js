import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { Filter, MessageCircle } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import CustomNavbar from '../components/CustomNavbar';

const Principal = () => {
  const [showFilters, setShowFilters] = useState(false);

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

      {/* Mapa provisional */}
      <MapContainer 
        center={[0, 0]} 
        zoom={3} 
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
        <div 
          className="position-absolute start-0 bg-white p-3 shadow"
          style={{ 
            zIndex: 1001,
            top: '100px', 
            margin: '0.5rem',
            left: '0'
          }}
        >
          <p>Opciones de filtro</p>
        </div>
      )}
    </div>
  );
};

export default Principal;