import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoPequeño from '../assets/LogoPequeño.png'; 

const CustomNavbar = () => {
  return (
    <Navbar 
      bg="custom" 
      expand="lg" 
      className="px-3 py-1" 
      style={{ 
        backgroundColor: '#000842',
      }}
    >
      <Navbar.Brand href="#home" className="d-flex align-items-center">
        <img
          src={LogoPequeño}
          alt="Logo"
          className="d-inline-block align-top"
          style={{ 
            height: '35px',
            width: 'auto',
            maxWidth: '100%'
          }}
        />
      </Navbar.Brand>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-white">
        <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
      </Navbar.Toggle>
      
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto ms-lg-4">

          <div className="d-lg-none border-top border-secondary mt-2"></div>
          
          <Nav.Link href="#explore" className="text-white mx-2">Explorar</Nav.Link>
          <Nav.Link href="#analytics" className="text-white mx-2">Analíticas</Nav.Link>
          <Nav.Link href="#search" className="text-white mx-2">Buscar compañero</Nav.Link>
          <Nav.Link href="#chat" className="text-white mx-2">Chat</Nav.Link>
          
          <div className="d-lg-none border-top border-secondary mb-2"></div>
        </Nav>
        
        <Form className="d-flex ps-3 ps-lg-0">
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
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;