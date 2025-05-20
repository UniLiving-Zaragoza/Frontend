import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Función para decodificar el token JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Verificar si el token ha expirado
const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = parseJwt(token);
  if (!decodedToken || !decodedToken.exp) return true;

  return decodedToken.exp * 1000 < Date.now();
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const axiosInterceptorId = useRef(null);
  
  // Configurar interceptor de Axios
  const setupAxiosInterceptors = (token) => {

    if (axiosInterceptorId.current !== null) {
      axios.interceptors.request.eject(axiosInterceptorId.current);
    }
    
    axiosInterceptorId.current = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  };

  // Función para obtener datos del usuario actual
  const fetchUserData = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('authToken');
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

      const userData = parseJwt(currentToken);
      if (!userData || !userData.id) {
        setIsLoading(false);
        return;
      }
  
      setUser(userData);
      setToken(currentToken);
      setIsAuthenticated(true);
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Efecto de inicialización
  useEffect(() => {
    const currentToken = localStorage.getItem('authToken');
    const isValid = currentToken && !isTokenExpired(currentToken);

    if (isValid) {
      setupAxiosInterceptors(currentToken);
      fetchUserData();
    } else {
      logout();
      setIsLoading(false);
    }
    
    // Configurar un intervalo para revisar la expiración periódicamente
    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (token && isTokenExpired(token)) {
        logout();
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      }
    }, 60000);
    
    return () => {
      clearInterval(checkTokenInterval);
      if (axiosInterceptorId.current !== null) {
        axios.interceptors.request.eject(axiosInterceptorId.current);
      }
    };
  }, [fetchUserData]);

  // Método para guardar el token y establecer estado de autenticación
  const setAuthToken = useCallback((token, isAdminUser = false) => {
    if (token) {
      localStorage.setItem('authToken', token);
      
      if (isAdminUser) {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.removeItem('isAdmin');
      }
      
      setIsAuthenticated(true);
      setIsAdmin(isAdminUser);
      setupAxiosInterceptors(token);
      return true;
    }
    return false;
  }, []);

  const login = useCallback(async (token, isAdminUser = false) => {
    if (setAuthToken(token, isAdminUser)) {
      await fetchUserData();
      return true;
    }
    return false;
  }, [fetchUserData, setAuthToken]);

  const logout = () => {
    // Eliminar el token y la información de la sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    
    // Eliminar el interceptor de Axios
    if (axiosInterceptorId.current !== null) {
      axios.interceptors.request.eject(axiosInterceptorId.current);
      axiosInterceptorId.current = null;
    }
    
    // Actualizar el estado
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    setToken(null);
  };

  // Método para verificar si el token actual es válido
  const isTokenValid = () => {
    const token = localStorage.getItem('authToken');
    return token && !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAdmin, 
        user,
        login, 
        logout,
        isLoading,
        isTokenValid,
        setAuthToken,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
