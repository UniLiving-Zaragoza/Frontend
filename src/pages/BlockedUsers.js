import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import CustomNavbar from '../components/CustomNavbar';
import CustomModal from '../components/CustomModal';
import Pagination from "../components/CustomPagination";

const BlockedUSers = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const usersPerPage = 3; // Número de usuarios por página
    const data = [
        { id: 1, nombre: "Paco González", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/9387/9387271.png" },
        { id: 2, nombre: "Carlos Martínez", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068070.png" },
        { id: 3, nombre: "María Pérez", URL_foto_perfil: "https://cdn-icons-png.flaticon.com/512/8068/8068125.png" },
        { id: 4, nombre: "Luis Rodríguez", URL_foto_perfil: "https://upload.wikimedia.org/wikipedia/commons/5/59/4NumberFourInCircle.png" },
        { id: 5, nombre: "Sofía Ramírez", URL_foto_perfil: "https://static.vecteezy.com/system/resources/previews/026/468/774/non_2x/number-5-icon-circle-illustration-on-isolated-white-background-number-five-icon-free-vector.jpg" }
    ];

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleUnBlock = () => {
        handleCloseModal();
    }

    const filteredData = data.filter(user =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div className="App position-relative" style={{ height: '100vh', overflow: 'auto' }}>
            <CustomNavbar />

            <Container className="mt-4">
                {/* Cabecera */}
                <Row className="d-flex justify-content-center text-center">
                    <Col xs={12} md={6} className="d-flex align-items-center">
                        <img
                            src="https://s3-alpha-sig.figma.com/img/d700/3764/2ff00b4c30d3ecd5d505b0c80e560e33?Expires=1743984000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=swIy~aWw~3IX0yVkOuec9Boc0sQoVSFBRvlnuk5kiv~vKmbHoRUtz0UBTBlw964S04mFqxSYYNkJ70BjJr3gpbKrwfQx3Gm41-yOp0urq8Rv8arWI09vZB-Ih-es-fKjxOnfHklvjYx9QM358i7P7h~IHLVGrjP9xOuSuLz3VNueoCiqjqLQPfpawVHRjo1Jm4Y6~QSU2JQJAxdvtwViM-aWX8THvpuhluIG~pMe0OgyXTLixWOQjb3snIWMJNK~zRRK~NL2K9ABLiwH2XbiiZWWMzU9Iho4aQeIfzkdWmAZ6Ksegmm9Iylr~YXHFAHXDmdPu02kjWxugC-WGjejBQ__"
                            alt="Perfil"
                            className="rounded-circle img-fluid me-3"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <div className="text-start">
                            <h4>Cuentas bloqueadas</h4>
                            <p>{filteredData.length} Cuentas</p>
                        </div>
                    </Col>
                </Row>

                {/* Barra de búsqueda */}
                <Row className="mb-4 mt-3"> {/* Agregar margen superior */}
                    <Col xs={12}>
                        <Form.Control
                            type="text"
                            placeholder="Buscar usuario..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Col>
                </Row>

                {/* Lista de usuarios bloqueados */}
                <Row>
                    {currentUsers.map(user => (
                        <Col xs={12} key={user.id} className="mb-4">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                {/* Foto de perfil */}
                                <img
                                    src={user.URL_foto_perfil}
                                    alt={user.nombre}
                                    className="rounded-circle"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />

                                {/* Cuadrado azul con nombre */}
                                <div
                                    className="d-flex align-items-center justify-content-between text-black w-100"
                                    style={{
                                        backgroundColor: '#D6EAFF',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        marginLeft: '20px',
                                        width: 'calc(100% - 100px)',
                                    }}
                                >
                                    <span>{user.nombre}</span>
                                    <Button
                                        variant="outline-light"
                                        className="ms-3"
                                        onClick={handleShowModal}
                                        style={{
                                            backgroundColor: '#000842',
                                            border: '1px solid #000842',
                                            color: 'white',
                                            borderRadius: '30px',
                                            padding: '8px 20px',
                                        }}
                                    >
                                        Desbloquear
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                {/* Paginación */}
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            </Container>
            {/* Usar el CustomModal */}
            <CustomModal
                show={showModal}
                onHide={handleCloseModal}
                title="Desbloquear Usuario"
                bodyText="¿Estás seguro que deseas desbloquear al usuario?  Volverá a poder comunicarse contigo."
                confirmButtonText="Desbloquear persona"
                onSave={handleUnBlock}
            />

            <div style={{ marginBottom: '50px' }}></div>
        </div>
    );
};

export default BlockedUSers;