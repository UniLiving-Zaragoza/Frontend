import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import LogoTexto from "../assets/LogoTexto.png";
import Icono from "../assets/icono_png.png";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="App">
      <CustomNavbar />
      <Container className="text-center mt-5">
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "40px",
            gap: "20px",
            flexWrap: "wrap", 
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <img
            src={Icono}
            alt="UniLiving Icono"
            style={{
              flex: "1 1 175px", 
              maxWidth: "175px",
              width: "100%",
              height: "auto",
            }}
          />
          <img
            src={LogoTexto}
            alt="UniLiving"
            style={{
              flex: "2 1 200px", 
              maxWidth: "300px",
              width: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Botón de explorar */}
        <Link to="/principal">
          <Button
            variant="primary"
            size="lg"
            className="px-5 py-3 mb-5 fw-bold"
            style={{
              borderRadius: "30px",
              backgroundColor: "#000842",
              borderColor: "#000842",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              letterSpacing: "0.5px",
              fontSize: "1.1rem"
            }}
          >
            EXPLORAR
          </Button>
        </Link>

        {/* Área de información */}
        <Row className="g-4">
          <Col md={4}>
            <Card className="h-100" style={{ backgroundColor: "#D6EAFF" }}>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-center mb-3">🏠 Encuentra tu piso ideal en Zaragoza</Card.Title>
                <Card.Text className="flex-grow-1">
                  Explora cientos de pisos en alquiler adaptados a tus preferencias. Filtra por características del inmueble y elige la zona que más encaje contigo. Nuestra plataforma te ayuda a tomar decisiones informadas para encontrar tu próximo hogar con total confianza. 
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100" style={{ backgroundColor: "#D6EAFF" }}>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-center mb-3">📊 Analiza cada zona con datos reales y opiniones</Card.Title>
                <Card.Text className="flex-grow-1">
                  Conoce a fondo los barrios de Zaragoza antes de mudarte. Accede a estadísticas útiles, mapas interactivos y comentarios reales de otros usuarios sobre cada zona. Así, puedes elegir no solo el piso perfecto, sino también el entorno ideal para ti.                
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100" style={{ backgroundColor: "#D6EAFF" }}>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-center mb-3">🤝 Conecta con compañeros de piso compatibles</Card.Title>
                <Card.Text className="flex-grow-1">
                  ¿Buscas compartir piso? Encuentra personas con intereses y hábitos afines gracias a nuestro sistema de emparejamiento. Habla por chat privado o únete al chat general de Zaragoza para conectar, compartir y convivir mejor desde el primer día.                
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;