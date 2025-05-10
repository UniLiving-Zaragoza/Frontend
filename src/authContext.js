import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') ? true : false;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });

  const [user, setUser] = useState(null);

  // Función para obtener datos del usuario actual
  const fetchUserData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('isAuthenticated');
      if (!token) return;
  
      const userData = parseJwt(token);
      if (!userData || !userData.id) return;
  
      setUser(userData);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  }, []);
  
  
  useEffect(() => {
    const token = sessionStorage.getItem('isAuthenticated');
  
    if (token) {
      axios.interceptors.request.use(
        (config) => {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
  
      fetchUserData();
    }
  }, [isAuthenticated, fetchUserData]);
  
  
  // Función para decodificar el token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  const login = async () => {
    // La lógica de autenticación real y guardado del token se maneja en el componente Login
    setIsAuthenticated(true);
    const isAdminValue = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminValue);
    
    await fetchUserData();
  };

  const register = async () => {

    setIsAuthenticated(true);
    setIsAdmin(false);
    
    await fetchUserData();
  };

  const logout = () => {
    // Eliminar el token y la información de la sesión
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isAdmin');
    
    // Actualizar el estado
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAdmin, 
        user,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
