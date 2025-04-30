import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';
import Unauthorized from './pages/Unauthorized';


function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Unauthorized />;

  return children;
}

export { PrivateRoute, AdminRoute };
