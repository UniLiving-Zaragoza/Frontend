import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import { FaUser } from 'react-icons/fa';
import LogoPequeño from '../assets/LogoPequeño.png';

const CustomNavbar = () => {

  const { isAuthenticated } = useAuth();

  return (
    <Navbar
      bg="custom"
      expand="lg"
      className="px-3 py-1"
      style={{ backgroundColor: '#000842', zIndex: 1050 }}
    >
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
        <img
          src={LogoPequeño}
          alt="Logo"
          className="d-inline-block align-top"
          style={{ height: '35px', width: 'auto', maxWidth: '100%' }}
        />
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-white">
        <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
      </Navbar.Toggle>

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto ms-lg-4">
          <div className="d-lg-none border-top border-secondary mt-2"></div>

          {/* Enlaces de navegación*/}
          <Nav.Link as={Link} to={isAuthenticated ? "/principal" : "/principal"} className="text-white mx-2">
            Explorar
          </Nav.Link>
          <Nav.Link as={Link} to={isAuthenticated ? "/analiticas" : "/analiticas"} className="text-white mx-2">
            Analíticas
          </Nav.Link>
          <Nav.Link as={Link} to={isAuthenticated ? "/buscar-compañero" : "/login"} className="text-white mx-2">
            Buscar compañero
          </Nav.Link>
          <Nav.Link as={Link} to={isAuthenticated ? "/lista-chats" : "/login"} className="text-white mx-2">
            Chat
          </Nav.Link>

          <div className="d-lg-none border-top border-secondary mb-2"></div>
        </Nav>

        <Form className="d-flex ps-3 ps-lg-0">
          {isAuthenticated ? (
            <Link to="/perfil" className="d-flex align-items-center"
            >
              <div
                style={{
                  height: '35px',
                  width: '35px',
                  borderRadius: '50%',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                <FaUser size={20} />
              </div>
            </Link>
          ) : (
            <Button
              as={Link}
              to="/login"
              variant="light"
              size="sm"
              className="text-dark fw-bold mt-3 mt-lg-0 mb-2 mb-lg-0 ms-lg-2"
              style={{ minWidth: '120px', borderRadius: "25px" }}
            >
              Iniciar sesión
            </Button>
          )}
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;