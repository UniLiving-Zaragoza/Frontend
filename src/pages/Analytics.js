import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Row, Col, Form} from 'react-bootstrap';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { FaChartBar, FaComments } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import CustomNavbar from '../components/CustomNavbar';

const geoJsonStyle = {
    color: "#000842",
    weight: 1,
    fillColor: "#D6EAFF",
    fillOpacity: 0.4,
};

const barriosZaragoza = [
    "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
    "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
    "Centro", "Las Fuentes", "Universidad", "San José",
    "Casablanca", "Torrero-La Paz", "Sur"
];

const AnalyticsPage = () => {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch("/BarriosZaragoza.geojson")
            .then(response => response.json())
            .then(data => {
                const filteredFeatures = data.features.filter(feature => 
                    feature.properties.place === "borough"
                );
                setGeoData({ ...data, features: filteredFeatures });
            })
            .catch(error => console.error("Error cargando GeoJSON:", error));
    }, []);

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                e.target.setStyle({ fillColor: "yellow", weight: 2 });
            },
            mouseout: (e) => {
                e.target.setStyle(geoJsonStyle);
            },
            click: () => {
                console.log(`Barrio seleccionado: ${feature.properties.name}`);
                navigate('/analiticas-graficos');
            }
        });
    };

    const navigate = useNavigate();

    const handleChartClick = () => {
        navigate('/analiticas-graficos');
    };
    
    const handleCommentsClick = () => {
        navigate('/analiticas-comentarios');
    };

    return (
        <div className="App d-flex flex-column vh-100">
            <CustomNavbar />
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    {/* Panel lateral */}
                    <Col lg={4} className="d-flex flex-column py-4 px-4 order-0 order-lg-0">
                        <Card className="flex-grow-1 p-3"
                            style={{
                                overflowY: 'auto',
                                border: '1px solid #ddd',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Card.Body className="d-flex flex-column align-items-center w-100 text-center">

                                <Card.Title 
                                    style={{
                                        fontWeight: 'bold', 
                                        fontSize: '1.75rem', 
                                        marginBottom: '1.5rem',
                                        marginTop: '2rem'
                                    }}>
                                    Seleccione la zona a analizar
                                </Card.Title>
                                
                                <Card.Text className="mb-5">
                                    Accede a información actualizada de la zona representada mediante
                                    gráficas y comentarios.
                                </Card.Text>

                                <Container className="mb-5">
                                    <div className="d-flex justify-content-center">
                                        <div style={{ width: '80%', maxWidth: '700px' }}>
                                            <Form.Select 
                                                aria-label="Selector de barrios" 
                                                className="mb-3 shadow-sm"
                                            >
                                                <option style={{ fontWeight: 'bold' }}>Selecciona un barrio de Zaragoza</option>
                                                {barriosZaragoza.map((barrio, index) => (
                                                    <option key={index} value={barrio}>{barrio}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </div>
                                </Container>

                                <div className="d-flex flex-wrap justify-content-center w-100 gap-3 mt-2">
                                    {/* Opción Gráficas */}
                                    <div className="d-flex flex-column align-items-center">
                                        <div onClick={handleChartClick} style={{ cursor: 'pointer' }}>
                                            <FaChartBar size={30} color="#000842" className="mb-2" />
                                        </div>
                                        <Button
                                            onClick={handleChartClick}
                                            variant="outline-light"
                                            style={{
                                                backgroundColor: '#000842',
                                                color: 'white',
                                                borderRadius: '10px',
                                                padding: '6px 16px',
                                                marginTop: '0.5rem',
                                                width: '130px'
                                            }}
                                        > 
                                            Gráficas
                                        </Button>
                                    </div>

                                    {/* Opción Comentarios */}
                                    <div className="d-flex flex-column align-items-center">
                                        <div onClick={handleCommentsClick} style={{ cursor: 'pointer' }}>
                                            <FaComments size={30} color="#000842" className="mb-2" />
                                        </div>
                                        <Button
                                            onClick={handleCommentsClick}
                                            variant="outline-light"
                                            style={{
                                                backgroundColor: '#000842',
                                                color: 'white',
                                                borderRadius: '10px',
                                                padding: '6px 16px',
                                                marginTop: '0.5rem',
                                                width: '130px'
                                            }}
                                        > 
                                            Comentarios
                                        </Button>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>

                    
                    {/* Mapa */}
                    <Col lg={8} className="p-0 order-1 order-lg-1">
                        <div className="h-100 w-100" style={{ minHeight: "500px", border: "1px solid #000842",  }}>
                            <MapContainer 
                                center={[41.6488, -0.8891]} 
                                zoom={13}
                                minZoom={10} 
                                maxZoom={15} 
                                maxBounds={[[41.55, -1.0], [41.75, -0.75]]}
                                maxBoundsViscosity={1.0} 
                                style={{ width: "100%", height: "100%" }} 
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
                                {geoData && <GeoJSON data={geoData} style={geoJsonStyle} onEachFeature={onEachFeature} />}
                            </MapContainer>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AnalyticsPage;