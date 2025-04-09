import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUsers, FaEnvelope, FaExclamationTriangle, FaCommentDots } from "react-icons/fa";
import { Link } from 'react-router-dom';
import CustomAdminNavbar from "../components/CustomNavbarAdmin";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const dataUsers = [
  { mes: "1", usuarios: 200 },
  { mes: "2", usuarios: 300 },
  { mes: "3", usuarios: 250 },
  { mes: "4", usuarios: 400 },
  { mes: "5", usuarios: 450 },
  { mes: "6", usuarios: 500 },
  { mes: "7", usuarios: 600 },
  { mes: "8", usuarios: 550 },
  { mes: "9", usuarios: 700 },
  { mes: "10", usuarios: 620 },
  { mes: "11", usuarios: 620 },
  { mes: "12", usuarios: 620 },
];

const dataMessages = [
  { mes: "1", mensajes: 200 },
  { mes: "2", mensajes: 300 },
  { mes: "3", mensajes: 250 },
  { mes: "4", mensajes: 400 },
  { mes: "5", mensajes: 450 },
  { mes: "6", mensajes: 500 },
  { mes: "7", mensajes: 600 },
  { mes: "8", mensajes: 550 },
  { mes: "9", mensajes: 700 },
  { mes: "10", mensajes: 620 },
  { mes: "11", mensajes: 620 },
  { mes: "12", mensajes: 620 },
];

const dataReports = [
  { mes: "1", reportes: 200 },
  { mes: "2", reportes: 300 },
  { mes: "3", reportes: 250 },
  { mes: "4", reportes: 400 },
  { mes: "5", reportes: 450 },
  { mes: "6", reportes: 500 },
  { mes: "7", reportes: 600 },
  { mes: "8", reportes: 550 },
  { mes: "9", reportes: 700 },
  { mes: "10", reportes: 620 },
  { mes: "11", reportes: 620 },
  { mes: "12", reportes: 620 },
];

const dataComments = [
  { mes: "1", comentarios: 200 },
  { mes: "2", comentarios: 300 },
  { mes: "3", comentarios: 250 },
  { mes: "4", comentarios: 400 },
  { mes: "5", comentarios: 450 },
  { mes: "6", comentarios: 500 },
  { mes: "7", comentarios: 600 },
  { mes: "8", comentarios: 550 },
  { mes: "9", comentarios: 700 },
  { mes: "10", comentarios: 620 },
  { mes: "11", comentarios: 620 },
  { mes: "12", comentarios: 620 },
];

sessionStorage.setItem("userRole", "admin"); // Simulando que el usuario es un admin. Cambiar por el valor real cuando se haga la autenticación.

const Dashboard = () => {
  return (
    <div className="App">
      <CustomAdminNavbar />
      <Container fluid className="mt-4">
        <Row>
          <Col md={6} lg={6} className="mb-4">
            <Card className="shadow-sm p-2">
              <Card.Header 
                as={Link} 
                to="/buscar-usuario-admin" 
                className="d-flex justify-content-between align-items-center"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <span> Usuarios Totales <span  className="fs-4 fw-bold align-self-center">40,689</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaUsers className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dataUsers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="usuarios" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={6} className="mb-4">
            <Card className="shadow-sm p-2">
              <Card.Header 
                as={Link} 
                to="/chat-global" 
                className="d-flex justify-content-between align-items-center"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <span> Mensajes Totales <span  className="fs-4 fw-bold align-self-center">10,293</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaEnvelope className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dataMessages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="mensajes" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={6} className="mb-4">
            <Card className="shadow-sm p-2">
              <Card.Header 
                as={Link} 
                to="/principal-admin" 
                className="d-flex justify-content-between align-items-center"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <span> Mensajes Reportados <span  className="fs-4 fw-bold align-self-center">936</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaExclamationTriangle className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dataReports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="reportes" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={6} className="mb-4">
            <Card className="shadow-sm p-2">
                <Card.Header 
                  as={Link} 
                  to="/analiticas-comentarios" 
                  className="d-flex justify-content-between align-items-center"
                  style={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                <span> Comentarios Totales <span  className="fs-4 fw-bold align-self-center">2,040</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaCommentDots className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dataComments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="comentarios" stroke="#d62728" />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
