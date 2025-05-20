import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaUsers, FaEnvelope, FaExclamationTriangle, FaCommentDots } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomAdminNavbar from "../components/CustomNavbarAdmin";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = 'https://uniliving-backend.onrender.com';

// Mapeo de números de mes a nombres abreviados
const monthNames = {
  "1": "Ene",
  "2": "Feb",
  "3": "Mar",
  "4": "Abr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Ago",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dic"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const fullMonthNames = {
      "1": "Enero",
      "2": "Febrero",
      "3": "Marzo",
      "4": "Abril",
      "5": "Mayo",
      "6": "Junio",
      "7": "Julio",
      "8": "Agosto",
      "9": "Septiembre",
      "10": "Octubre",
      "11": "Noviembre",
      "12": "Diciembre"
    };
    
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p className="label">{`${fullMonthNames[label]}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    total: 0,
    monthlyData: []
  });
  const [messageStats, setMessageStats] = useState({
    total: 0,
    reported: 0,
    monthlyData: []
  });
  const [commentStats, setCommentStats] = useState({
    total: 0,
    monthlyData: []
  });

  const { token } = useAuth();

  useEffect(() => {
    const fetchAllStats = async () => {
      setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Extraer las estadísticas de la API
        const [usersResponse, messagesResponse, commentsResponse] = await Promise.all([
          axios.get(`${API_URL}/admin/stats/users`, config),
          axios.get(`${API_URL}/admin/stats/messages`, config),
          axios.get(`${API_URL}/admin/stats/zone-comments`, config)
        ]);

        // Procesar datos de usuarios
        const userData = usersResponse.data;
        console.log(userData)
        setUserStats({
          total: userData.totalStats[0]?.total || 0,
          monthlyData: processMonthlyData(userData.monthlyStats, 'usuarios')
        });

        // Procesar datos de mensajes
        const messageData = messagesResponse.data;
        const reportedCount = messageData.totalStats[0]?.byStatus.find(item => item.status === 'Reported')?.count || 0;
        setMessageStats({
          total: messageData.totalStats[0]?.total || 0,
          reported: reportedCount,
          monthlyData: processMonthlyData(messageData.monthlyStats, 'mensajes')
        });

        // Procesar datos de comentarios
        const commentData = commentsResponse.data;
        setCommentStats({
          total: commentData.totalStats[0]?.total || 0,
          monthlyData: processMonthlyData(commentData.monthlyStats, 'comentarios')
        });

      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStats();
  }, [token]);

  // Función para procesar datos mensuales
  const processMonthlyData = (monthlyStats, dataKey) => {
    if (!monthlyStats || !Array.isArray(monthlyStats)) return [];

    const monthsData = {};
    
    for (let i = 1; i <= 12; i++) {
      monthsData[i] = { 
        mes: i.toString(), 
        mesNombre: monthNames[i.toString()],
        [dataKey]: 0 
      };
    }

    monthlyStats.forEach(stat => {
      const month = stat._id.month;
      monthsData[month] = {
        mes: month.toString(),
        mesNombre: monthNames[month.toString()],
        [dataKey]: stat.total
      };
    });

    return Object.values(monthsData).sort((a, b) => parseInt(a.mes) - parseInt(b.mes));
  };

  const formatXAxis = (value) => {
    return monthNames[value] || value;
  };

  if (isLoading) {
    return (
      <div className="App">
        <CustomAdminNavbar />
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

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
                <span> Usuarios Totales <span className="fs-4 fw-bold align-self-center">{userStats.total.toLocaleString()}</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaUsers className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userStats.monthlyData} margin={{ right: 35, top: 10  }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      tickFormatter={formatXAxis}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="usuarios" 
                      stroke="#8884d8" 
                      name="Usuarios"
                    />
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
                <span> Mensajes Totales <span className="fs-4 fw-bold align-self-center">{messageStats.total.toLocaleString()}</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaEnvelope className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={messageStats.monthlyData} margin={{ right: 35, top: 10  }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      tickFormatter={formatXAxis}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="mensajes" 
                      stroke="#82ca9d" 
                      name="Mensajes"
                    />
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
                <span> Comentarios Totales <span className="fs-4 fw-bold align-self-center">{commentStats.total.toLocaleString()}</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaCommentDots className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={commentStats.monthlyData} margin={{ right: 35, top: 10  }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      tickFormatter={formatXAxis}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="comentarios" 
                      stroke="#d62728" 
                      name="Comentarios"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={6} className="mb-4">
            <Card className="shadow-sm p-2">
              <Card.Header 
                as={Link} 
                to="/reportes-admin" 
                className="d-flex justify-content-between align-items-center"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                <span> Mensajes Reportados <span className="fs-4 fw-bold align-self-center">{messageStats.reported.toLocaleString()}</span></span>
                <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                    <FaExclamationTriangle className="align-middle" />
                </span>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={messageStats.monthlyData.map(item => ({
                    mes: item.mes,
                    mesNombre: item.mesNombre,
                    reportes: Math.round(item.mensajes * (messageStats.reported / messageStats.total || 0))
                  }))} margin={{ right: 35, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      tickFormatter={formatXAxis}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="reportes" 
                      stroke="#ff7300" 
                      name="Reportes"
                    />
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
