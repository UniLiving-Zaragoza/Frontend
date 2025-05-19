import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Unauthorized from './pages/Unauthorized';
import { Spinner, Container } from 'react-bootstrap';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Unauthorized />;

  return children;
}

export { PrivateRoute, AdminRoute };