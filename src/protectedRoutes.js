import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => { //para cuando guardemos el rol en sessionStorage. 
    const userRole = sessionStorage.getItem("userRole");
    const location = useLocation();

    if (userRole !== "admin") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};
