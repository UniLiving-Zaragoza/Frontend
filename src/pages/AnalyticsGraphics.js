import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col, Form } from 'react-bootstrap';
import { FaExclamationTriangle, FaUsers, FaChartLine, FaComments } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar} from 'recharts';
import "leaflet/dist/leaflet.css";
import CustomNavbar from '../components/CustomNavbar';

const AnalyticsGraphicsPage = () => {    

    const dataExample = [
        { mes: "1", data: 200 },
        { mes: "2", data: 300 },
        { mes: "3", data: 250 },
        { mes: "4", data: 400 },
        { mes: "5", data: 450 },
        { mes: "6", data: 500 },
        { mes: "7", data: 600 },
        { mes: "8", data: 550 },
        { mes: "9", data: 700 },
        { mes: "10", data: 620 },
        { mes: "11", data: 620 },
        { mes: "12", data: 620 },
    ];

    const barriosZaragoza = [
        "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
        "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
        "Centro", "Las Fuentes", "Universidad", "San José",
        "Casablanca", "Torrero-La Paz", "Sur"
    ];

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
                                size="sm" 
                            >
                                <option style={{ fontWeight: 'bold' }}>Selecciona un barrio de Zaragoza</option>
                                {barriosZaragoza.map((barrio, index) => (
                                    <option key={index} value={barrio}>{barrio}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </div>
                </Container>

                <div className="flex-grow-1 overflow-auto p-3 mx-3"
                    style={{
                        flexGrow: 1,
                        minHeight: '200px',
                        maxHeight: 'calc(100vh - 200px)',
                        overflowY: 'auto',
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }}>
                    <Row>
                        
                        <Col md={6} className="mb-4">
                            <Card className="shadow-sm p-2">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span className="fs-4 fw-bold align-self-center">INFO</span>
                                    <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                                        <FaUsers className="align-middle" />
                                    </span>
                                </Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <AreaChart data={dataExample}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="data" fill="#8884d8" stroke="#8884d8" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={6} className="mb-4">
                            <Card className="shadow-sm p-2">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span className="fs-4 fw-bold align-self-center">INFO</span>
                                    <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                                        <FaChartLine className="align-middle" />
                                    </span>
                                </Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={dataExample}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="data" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={12} className="mb-4">
                            <Card className="shadow-sm p-2">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span className="fs-4 fw-bold align-self-center">INFO</span>
                                    <span className="icon-container d-flex align-items-center" style={{ fontSize: "35px" }}>
                                        <FaExclamationTriangle className="align-middle" />
                                    </span>
                                </Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={dataExample}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="mes" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="data" stroke="#ff7300" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <Container fluid className="mt-4 mb-3">
                    <Row className="align-items-center">

                        <Col sm={4} className="d-none d-sm-block"></Col>
                        
                        {/* Center button */}
                        <Col xs={12} sm={4} className="text-center mb-3 mb-sm-0">
                            <Button
                                variant="outline-light"
                                style={{
                                    backgroundColor: '#000842',
                                    color: 'white',
                                    borderRadius: '10px',
                                    padding: '6px 16px',
                                    width: '100%',
                                    maxWidth: '200px'
                                }}
                            > 
                                Buscar piso en X
                            </Button>
                        </Col>
                        
                        {/* Right button */}
                        <Col xs={12} sm={4} className="text-center text-sm-end">
                            <Button 
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