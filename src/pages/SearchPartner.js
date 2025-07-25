import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import CustomNavbar from '../components/CustomNavbar';
import axios from "axios";

const API_URL = 'https://uniliving-backend.onrender.com';

const BusquedaCompanero = () => {
  const [buscando, setBuscando] = useState(false);
  const [zona, setZona] = useState("");
  const [genero, setGenero] = useState("");
  const [mascotas, setMascotas] = useState("");
  const [fumador, setFumador] = useState("");
  const [estadoLaboral, setEstadoLaboral] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const barriosZaragoza = [
    "Actur-Rey Fernando", "El Rabal", "Santa Isabel", "La Almozara",
    "Miralbueno", "Oliver-Valdefierro", "Delicias", "Casco Histórico",
    "Centro", "Las Fuentes", "Universidad", "San José",
    "Casablanca", "Torrero-La Paz", "Sur"
  ];

  const navigate = useNavigate();

  const { user, token, logout } = useAuth();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (!user || !token) {
          await logout();
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`${API_URL}/user/${user.id}`, config);
        
        if (response.data.lookingForRoommate) {
          setBuscando(true);

          setGenero(response.data.roommatePreferences?.gender || "Sin preferencia");
          setMascotas(response.data.roommatePreferences?.pets || "Sin preferencia");
          setFumador(response.data.roommatePreferences?.smoker || "Sin preferencia");
          setEstadoLaboral(response.data.roommatePreferences?.employmentStatus || "");
          
          if (response.data.preferredZones && response.data.preferredZones.length > 0) {
            setZona(response.data.preferredZones[0]);
          }
        }
      } catch (err) {
        console.error("Error al verificar el estado del usuario:", err);
        setError("Error al cargar la información de usuario. Por favor, intenta nuevamente.");
      } finally {
        setInitialLoading(false);
      }
    };

    checkUserStatus();
  }, [logout, navigate, token, user]);

  const handleBuscar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user.id) {
        setError("No has iniciado sesión. Por favor, inicia sesión para continuar.");
        setLoading(false);
        return;
      }

      const requestData = {
        roommatePreferences: {
          gender: genero || "Sin preferencia",
          pets: mascotas || "Sin preferencia",
          smoker: fumador || "Sin preferencia",
          employmentStatus: estadoLaboral || "Sin preferencia"
        },
        preferredZones: zona ? [zona] : ["Sin preferencia"]
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(
        `${API_URL}/user/${user.id}/roommate-search/activate`, 
        requestData, 
        config
      );

      if (response.status === 200) {
        setBuscando(true);
      }
    } catch (err) {
      console.error("Error al activar la búsqueda:", err);
      setError("Error al activar la búsqueda de compañero. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleParar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!user.id) {
        setError("No has iniciado sesión. Por favor, inicia sesión para continuar.");
        setLoading(false);
        return;
      }

      const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
      };
      const response = await axios.put(
        `${API_URL}/user/${user.id}/roommate-search/deactivate`, 
        {}, 
        config
      );

      if (response.status === 200) {
        setBuscando(false);
      }
    } catch (err) {
      console.error("Error al desactivar la búsqueda:", err);
      setError("Error al desactivar la búsqueda de compañero. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="App">
        <CustomNavbar />
        <Container className="my-4 d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 150px)" }}>
          <div className="text-center">
            <Spinner
              animation="border"
              style={{ color: '#000842' }}
              className="mb-3"
            />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="App">
        <CustomNavbar />
        <Container className="my-4 d-flex justify-content-center">
        <div style={{ width: '100%', maxWidth: '800px' }}>
            {!buscando ? (
            <Form>
                <h5 className="text-center">Zonas de búsqueda</h5>

                <Container className="mt-3 mb-4">
                <div className="d-flex justify-content-center">
                    <div style={{ width: '100%'}}>
                        <Form.Select
                            aria-label="Zonas donde buscar"
                            className="mb-3 shadow-sm"
                            value={zona}
                            onChange={(e) => setZona(e.target.value)}
                            style={{border: '0.75px solid #000842',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)'} }
                        >
                            <option style={{ fontWeight: 'bold' }}>Seleccionar zona de búsqueda</option>
                            {barriosZaragoza.map((barrio, index) => (
                            <option key={index} value={barrio}>{barrio}</option>
                            ))}
                        </Form.Select>
                    </div>
                </div>
                </Container>

                <h5 className="text-center">Preferencias de compañero</h5>

                <div className="flex-grow-1 overflow-auto p-3 mx-3"
                    style={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        border: '0.75px solid #000842',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        marginTop: '15px',
                        marginBottom: '25px'
                    }}>
                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label className="fw-bold">Género:</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Hombre"
                                    name="genero"
                                    type="radio"
                                    id="genero-hombre"
                                    value="Hombre"
                                    checked={genero === "Hombre"}
                                    onChange={() => setGenero("Hombre")}
                                />

                                <Form.Check
                                    inline
                                    label="Mujer"
                                    name="genero"
                                    type="radio"
                                    id="genero-mujer"
                                    value="Mujer"
                                    checked={genero === "Mujer"}
                                    onChange={() => setGenero("Mujer")}
                                />

                                <Form.Check
                                    inline
                                    label="Sin preferencia"
                                    name="genero"
                                    type="radio"
                                    id="genero-sin-preferencia"
                                    value="Sin preferencia"
                                    checked={genero === "Sin preferencia" || genero === ""}
                                    onChange={() => setGenero("Sin preferencia")}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label className="fw-bold">Mascotas:</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Sí"
                                    name="mascotas"
                                    type="radio"
                                    id="mascotas-si"
                                    value="Si"
                                    checked={mascotas === "Si" || mascotas === "Sí"}
                                    onChange={() => setMascotas("Si")}
                                />
                                <Form.Check
                                    inline
                                    label="No"
                                    name="mascotas"
                                    type="radio"
                                    id="mascotas-no"
                                    value="No"
                                    checked={mascotas === "No"}
                                    onChange={() => setMascotas("No")}
                                />
                                <Form.Check
                                    inline
                                    label="Sin preferencia"
                                    name="mascotas"
                                    type="radio"
                                    id="mascotas-sin-preferencia"
                                    value="Sin preferencia"
                                    checked={mascotas === "Sin preferencia" || mascotas === ""}
                                    onChange={() => setMascotas("Sin preferencia")}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label className="fw-bold">Fumador:</Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    label="Sí"
                                    name="fumador"
                                    type="radio"
                                    id="fumador-si"
                                    value="Si"
                                    checked={fumador === "Si" || fumador === "Sí"}
                                    onChange={() => setFumador("Si")}
                                />
                                <Form.Check
                                    inline
                                    label="No"
                                    name="fumador"
                                    type="radio"
                                    id="fumador-no"
                                    value="No"
                                    checked={fumador === "No"}
                                    onChange={() => setFumador("No")}
                                />
                                <Form.Check
                                    inline
                                    label="Sin preferencia"
                                    name="fumador"
                                    type="radio"
                                    id="fumador-sin-preferencia"
                                    value="Sin preferencia"
                                    checked={fumador === "Sin preferencia" || fumador === ""}
                                    onChange={() => setFumador("Sin preferencia")}
                                />
                            </div>
                        </Col>
                    </Row>   
                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Label className="fw-bold">Estado Laboral:</Form.Label>
                            <Form.Select
                            value={estadoLaboral}
                            onChange={(e) => setEstadoLaboral(e.target.value)}
                            >
                            <option value="" style={{ fontWeight: 'bold' }}>Seleccionar estado laboral</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Trabajador">Trabajador</option>
                            <option value="Desempleado">Desempleado</option>
                            <option value="Sin preferencia">Sin preferencia</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </div>
                <div className="text-center">
                    <Button
                        variant="outline-light"
                        onClick={handleBuscar}
                        disabled={loading}
                        style={{
                            backgroundColor: '#000842',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '6px 16px',
                        }}
                    > 
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Cargando...
                            </>
                        ) : "Empezar búsqueda"}
                    </Button>
                </div>
            </Form>
            ) : (
                <div
                className="d-flex justify-content-center align-items-center text-center"
                style={{ minHeight: "calc(100vh - 250px)", flexDirection: "column" }}
                >
                <h2 className="fw-bold">Buscando compañeros en {zona || "cualquier zona"}</h2>
              
                <Spinner
                    animation="grow"
                    style={{
                        color: '#000842', 
                    }}
                    className="my-4"
                />

                <h5 className="text-start mt-4"><strong>Preferencias de compañero</strong></h5>
                <div
                    className="overflow-auto p-4 mx-3 d-flex justify-content-center"
                    style={{
                        border: '0.75px solid #000842',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25)',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        marginTop: '10px',
                        marginBottom: '25px'
                    }}
                >
                    <div>
                        <ul className="list-unstyled text-center">
                            <li><strong>Género:</strong> {genero || "Sin preferencia"}</li>
                            <li><strong>Mascotas:</strong> {mascotas || "Sin preferencia"}</li>
                            <li><strong>Fumador:</strong> {fumador || "Sin preferencia"}</li>
                            <li><strong>Estado Laboral:</strong> {estadoLaboral || "Sin especificar"}</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center">
                    <Button
                        variant="outline-light"
                        onClick={handleParar}
                        disabled={loading}
                        style={{
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '6px 16px',
                        }}
                    > 
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Cargando...
                            </>
                        ) : "Parar búsqueda"}
                    </Button>
                </div>
              </div>
            )}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
        </Container>
    </div>
  );
};

export default BusquedaCompanero;