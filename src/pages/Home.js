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
                <Card.Title className="fw-bold text-center mb-3">Área de información 1</Card.Title>
                <Card.Text className="flex-grow-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis hendrerit tellus vitae odio pellentesque, vel cursus urna pellentesque. Fusce vel sagittis nisl. Nulla ultricies risus sed magna euismod, vel efficitur lectus molestie. In hac habitasse platea dictumst. Sed blandit arcu.                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100" style={{ backgroundColor: "#D6EAFF" }}>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-center mb-3">Área de información 2</Card.Title>
                <Card.Text className="flex-grow-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque metus magna, ornare a pretium eget, efficitur consectetur quam. Curabitur feugiat semper lacus, non eleifend nibh vulputate id. Etiam id nisi.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100" style={{ backgroundColor: "#D6EAFF" }}>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-center mb-3">Área de información 3</Card.Title>
                <Card.Text className="flex-grow-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris a augue sed dui varius eleifend vel sit amet mauris. Sed consequat enim erat, in scelerisque massa congue eu. Vestibulum fringilla purus eu tristique blandit. Suspendisse ut venenatis neque, ut faucibus odio. Sed tempor condimentum commodo. Aliquam erat volutpat. Curabitur nec egestas enim. Aenean hendrerit imperdiet lacinia.
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