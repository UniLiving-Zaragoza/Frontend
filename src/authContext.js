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
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  // Función para obtener datos del usuario actual
  const fetchUserData = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }
  
      const userData = parseJwt(token);
      if (!userData || !userData.id) {
        setIsLoading(false);
        return;
      }
  
      setUser(userData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      setIsLoading(false);
    }
  }, []);
  
  // Efecto de inicialización
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const adminFlag = sessionStorage.getItem('isAdmin') === 'true';
    
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
      setIsAdmin(adminFlag);
      setupAxiosInterceptors(token);
      fetchUserData();
    } else if (token) {
      // Token existe pero está expirado
      logout();
    } else {
      setIsLoading(false);
    }
    
    // Configurar un intervalo para revisar la expiración periódicamente
    const checkTokenInterval = setInterval(() => {
      const currentToken = sessionStorage.getItem('authToken');
      if (currentToken && isTokenExpired(currentToken)) {
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
  const setAuthToken = (token, isAdminUser = false) => {
    if (token) {
      sessionStorage.setItem('authToken', token);
      
      if (isAdminUser) {
        sessionStorage.setItem('isAdmin', 'true');
      } else {
        sessionStorage.removeItem('isAdmin');
      }
      
      setIsAuthenticated(true);
      setIsAdmin(isAdminUser);
      setupAxiosInterceptors(token);
      return true;
    }
    return false;
  };

  const login = async (token, isAdminUser = false) => {
    if (setAuthToken(token, isAdminUser)) {
      await fetchUserData();
      return true;
    }
    return false;
  };

  const register = async (token) => {
    if (setAuthToken(token, false)) {
      await fetchUserData();
      return true;
    }
    return false;
  };

  const logout = () => {
    // Eliminar el token y la información de la sesión
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('isAdmin');
    
    // Eliminar el interceptor de Axios
    if (axiosInterceptorId.current !== null) {
      axios.interceptors.request.eject(axiosInterceptorId.current);
      axiosInterceptorId.current = null;
    }
    
    // Actualizar el estado
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
  };

  // Método para verificar si el token actual es válido
  const isTokenValid = () => {
    const token = sessionStorage.getItem('authToken');
    return token && !isTokenExpired(token);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAdmin, 
        user,
        login, 
        register, 
        logout,
        isLoading,
        isTokenValid,
        setAuthToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
