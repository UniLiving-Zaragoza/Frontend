import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, InputGroup, Button, Pagination } from "react-bootstrap";
import { FaSearch, FaUser } from "react-icons/fa";
import CustomAdminNavbar from "../components/CustomNavbarAdmin";


const SearchUsers = () => {
  return (
    <div className="App">
      <CustomAdminNavbar />
      <Container className="mt-4">
        {/* Barra de búsqueda */}
        <Row className="justify-content-center mb-3">
          <Col md={8}>
            <InputGroup>
              <Form.Control type="text" placeholder="Persona" />
              <Button variant="dark">
                <FaSearch />
              </Button>
            </InputGroup>
          </Col>
        </Row>

        
      </Container>
    </div>
  );
};

export default SearchUsers;
