import React from 'react';
import { Link } from 'react-router-dom';

function Unauthorized() {
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100 bg-white">
      <div className="text-center">
        {/* Mensaje de error */}
        <h1 className="fs-4 text-dark mb-2">
            <span className="fw-medium">403.</span> Acceso denegado
        </h1>
        <p className="text-secondary">
            No tienes permisos para acceder a esta sección. 
        </p>

        {/* Boton para volver al incio */}
        <div className="mt-4">
          <Link to="/" className="text-decoration-none text-primary">
            Volver a la página principal
          </Link>
        </div>

      </div>
    </div>
  );  
}

export default Unauthorized;
