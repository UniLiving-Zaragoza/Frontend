import React, { useState, useEffect } from 'react';
import { Container, Button, Card, Row, Col, Form, Spinner, Modal } from 'react-bootstrap';
import {  FaChartLine, FaComments,FaQuestionCircle  } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,LineChart, Line, Cell } from 'recharts';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomNavbar from '../components/CustomNavbar';
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";

const barriosZaragoza = [
    "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
    "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
    "Centro", "Las Fuentes", "Universidad", "San José",
    "Casablanca", "Torrero-La Paz", "Sur"
];

const AnalyticsGraphicsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const initialBarrio = location.state?.barrio || '';
    const [selectedBarrio, setSelectedBarrio] = useState(initialBarrio);
    const [barrioData, setBarrioData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);



    useEffect(() => {
    if (!selectedBarrio) return;

    setLoading(true);

    fetch(`https://uniliving-backend.onrender.com/publicData/demografia-distrito?distrito=${encodeURIComponent(selectedBarrio)}`)
        .then(res => {
            if (!res.ok) throw new Error("Error al cargar datos");
            return res.json();
        })
        .then(data => {
            setBarrioData(data.data);
        })
        .catch(err => console.error(err))
        .finally(() => {
            setLoading(false);
        });
    }, [selectedBarrio]);

    const handleSearch = () => {
        navigate('/principal');
    };

    const handleCommets = () => {
        if (selectedBarrio) {
            navigate('/analiticas-comentarios', { state: { barrio: selectedBarrio } });
        }
    };

    const handleBarrioChange = (e) => {
        const value = e.target.value;
        setSelectedBarrio(value === 'Selecciona un barrio de Zaragoza' ? '' : value);
    };

    const searchButtonText = selectedBarrio ? 
        `Buscar piso en ${selectedBarrio}` : 
        'Buscar piso en toda Zaragoza';

    const resumenData = barrioData ? [
        { name: 'Edad Media', value: barrioData.edadMedia },
        { name: 'Personas/Hogar', value: barrioData.personasPorHogar },
        { name: '% Extranjera', value: barrioData.porcentajeExtranjera },
        { name: '% Mayores 65', value: barrioData.porcentajeMayores },
        { name: '% Menores 18', value: barrioData.porcentajeJovenes },
    ] : [];

    const indicesData = barrioData ? [
        { name: 'Envejecimiento', value: barrioData.indiceEnvejecimiento },
        { name: 'Dependencia', value: barrioData.indiceDependencia },
        { name: 'Reemplazo', value: barrioData.indiceReemplazo },
        { name: 'Maternidad', value: barrioData.indiceMaternidad },
    ] : [];


    let resumenTexto = "";

    if (barrioData) {
        const { edadMedia, indiceEnvejecimiento, indiceDependencia, porcentajeExtranjera } = barrioData;

        if (edadMedia > 47) {
            resumenTexto += `La población del barrio es mayor en promedio, con una edad media de ${edadMedia.toFixed(1)} años. `;
        } else {
            resumenTexto += `Es un barrio con población joven, con una edad media de ${edadMedia.toFixed(1)} años. `;
        }

        if (indiceEnvejecimiento > 150) {
            resumenTexto += `Tiene un índice de envejecimiento alto (${indiceEnvejecimiento.toFixed(1)}), lo que indica una proporción significativa de mayores de 65 años. `;
        }

        if (indiceDependencia > 50) {
            resumenTexto += `La carga de dependencia es considerable (${indiceDependencia.toFixed(1)}), es decir, hay muchas personas que no están en edad laboral. `;
        }

        if (porcentajeExtranjera > 12) {
            resumenTexto += `Es un barrio con diversidad, ya que el ${porcentajeExtranjera.toFixed(1)}% de la población es extranjera.`;
        }
    }

    return (
        <div className="App position-relative d-flex flex-column" style={{ height: '100vh' }}>
            <CustomNavbar />
            <Container fluid className="flex-grow-1 d-flex flex-column">
                <Container className="mt-3 mb-1">
                    <div className="d-flex justify-content-center">
                        <div style={{ width: '80%', maxWidth: '700px' }}>
                            <Form.Select 
                                aria-label="Selector de barrios" 
                                className="mb-3 shadow-sm"
                                onChange={handleBarrioChange}
                                value={selectedBarrio || 'Selecciona un barrio de Zaragoza'}
                            >
                                <option>Selecciona un barrio de Zaragoza</option>
                                {barriosZaragoza.map((barrio, index) => (
                                    <option key={index} value={barrio}>{barrio}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </Container>

                <div className="flex-grow-1 overflow-auto p-3 mx-3"
                    style={{
                        minHeight: '200px',
                        maxHeight: 'calc(100vh - 210px)',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }}>
                    <Row>
                    {!loading && barrioData && (
                            <>
                                <Container className="mb-3">
                                    <Card className="shadow-sm p-3">
                                        <Card.Body className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-4">
                                                <strong>{selectedBarrio}</strong>
                                            </h5>
                                            <div className="d-flex align-items-center">
                                                <span className="text-muted me-2">
                                                    Población total: <h3>{barrioData.totalPoblacion.toLocaleString()}</h3>
                                                </span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Container>

                                <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered>
                                    <Modal.Header closeButton>
                                        <Modal.Title>¿Qué significan los indicadores?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <ul>
                                            <li><strong>Edad media:</strong> Edad promedio de los residentes.</li>
                                            <li><strong>Personas por hogar:</strong> Promedio de habitantes por vivienda.</li>
                                            <li><strong>% Extranjeros:</strong> Porcentaje de residentes nacidos en el extranjero.</li>
                                            <li><strong>% Mayores/Menores:</strong> Porcentaje de mayores de 65 y menores de 18.</li>
                                            <li><strong>Índice de envejecimiento:</strong> Relación entre mayores de 65 y menores de 16.</li>
                                            <li><strong>Índice de dependencia:</strong> Proporción de población dependiente (menores y mayores) respecto a edad laboral.</li>
                                            <li><strong>Índice de reemplazo:</strong> Capacidad generacional de sustituir población activa.</li>
                                            <li><strong>Índice de maternidad:</strong> Número medio de hijos por mujer.</li>
                                        </ul>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowInfoModal(false)}>Cerrar</Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        )}
                        <Col md={12} className="mb-4">
                            <Card className="shadow-sm p-2">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span className="fs-4 fw-bold align-self-center">Índices demográficos</span>
                                    <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                                        <FaChartLine className="align-middle" />
                                    </span>
                                    <FaQuestionCircle 
                                                    role="button" 
                                                    size={30} 
                                                    className="text-primary" 
                                                    onClick={() => setShowInfoModal(true)} 
                                                    title="Información sobre los indicadores"
                                    />
                                </Card.Header>
                                <Card.Body>
                                    {loading ? (
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
                                            <Spinner animation="border" role="status" variant="primary">
                                                <span className="visually-hidden">Cargando...</span>
                                            </Spinner>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Gráfico 1: Indicadores básicos */}
                                            <div className="mb-5">
                                                <h6 className="fw-bold text-center mb-3">Indicadores de población</h6>
                                                <ResponsiveContainer width="100%" height={300}>
                                                    <BarChart data={resumenData}>
                                                        <CartesianGrid stroke="#e6e6e6" strokeDasharray="3 3" />
                                                        <XAxis 
                                                            dataKey="name" 
                                                            tick={{ fill: '#444', fontSize: 20, fontWeight: 'bold' }} 
                                                            axisLine={false} 
                                                            tickLine={false} 
                                                        />
                                                        <YAxis 
                                                            tick={{ fill: '#444', fontSize: 12 }} 
                                                            axisLine={false} 
                                                            tickLine={false} 
                                                        />
                                                        <Tooltip 
                                                            contentStyle={{ 
                                                                backgroundColor: '#fff', 
                                                                border: '1px solid #ccc', 
                                                                borderRadius: 6, 
                                                                fontSize: 12 
                                                            }} 
                                                        />
                                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                        {resumenData.map((entry, index) => (
                                                            <Cell 
                                                            key={`cell-${index}`} 
                                                            fill="#000842" 
                                                            />
                                                        ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            {/* Gráfico 2: Índices relacionados */}
                                            <div>
                                            <h6 className="fw-bold text-center mb-3">Índices de envejecimiento y dependencia</h6>
                                            <ResponsiveContainer width="100%" height={300}>
                                                <LineChart data={indicesData}>
                                                <defs>
                                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#000842" />
                                                    <stop offset="25%" stopColor="#32418f" />
                                                    <stop offset="50%" stopColor="#5460b9" />
                                                    <stop offset="75%" stopColor="#8792da" />
                                                    <stop offset="100%" stopColor="#b6c3f3" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid stroke="#e6e6e6" strokeDasharray="3 3" />
                                                <XAxis 
                                                    dataKey="name" 
                                                    tick={{ fill: '#444', fontSize: 12 }} 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                />
                                                <YAxis 
                                                    tick={{ fill: '#444', fontSize: 12 }} 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                    backgroundColor: '#fff', 
                                                    border: '1px solid #ccc', 
                                                    borderRadius: 6, 
                                                    fontSize: 12 
                                                    }} 
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="value" 
                                                    stroke="url(#lineGradient)" 
                                                    strokeWidth={3} 
                                                    dot={{ r: 4, stroke: '#5460b9', strokeWidth: 2, fill: '#fff' }} 
                                                />
                                                </LineChart>
                                            </ResponsiveContainer>
                                            </div>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Container className="mb-4">
                        <Card className="shadow-sm p-3">
                            <Card.Body>
                                <h5 className="fw-bold mb-3">Resumen del barrio</h5>
                                {loading ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: 100 }}>
                                        <Spinner animation="border" role="status" variant="primary">
                                            <span className="visually-hidden">Cargando...</span>
                                        </Spinner>
                                    </div>
                                ) : resumenTexto ? (
                                    <p>{resumenTexto}</p>
                                ) : (
                                    <p className="text-muted">Selecciona un barrio para ver el resumen.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Container>

                </div>
                <Container fluid className="mt-4 mb-3">
                    <Row className="align-items-center">
                        <Col sm={4} className="d-none d-sm-block"></Col>
                        
                        <Col xs={12} sm={4} className="text-center mb-3 mb-sm-0">
                            <Button
                                onClick={handleSearch}
                                variant="outline-light"
                                style={{
                                    backgroundColor: '#000842',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '6px 16px', 
                                    width: 'auto',
                                    maxWidth: 'none'
                                }}
                            > 
                                {searchButtonText}
                            </Button>
                        </Col>
                        
                        <Col xs={12} sm={4} className="text-center text-sm-end">
                            <Button 
                                onClick={handleCommets}
                                variant="outline-secondary" 
                                className="d-flex align-items-center mx-auto mx-sm-0 ms-sm-auto"
                                style={{
                                    borderRadius: '10px',
                                    padding: '6px 16px',
                                    maxWidth: '200px'
                                }}
                            >
                                <FaComments className="me-2" />
                                Ver comentarios
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </div>
    );
};

export default AnalyticsGraphicsPage;
