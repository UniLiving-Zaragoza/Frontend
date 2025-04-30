import { createContext, useContext, useState } from 'react';

// Lógica de autenticación para portección de rutas
// DEMOMENTO ASÍ, PERO NO ES NADA SEGURO!!!! ********************************

// Por todo el código hay cosas que varían en función del rol, esa variable demomento fija debera obtenerse de aqui

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('isAdmin') === 'true';
  });

  const login = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);

    sessionStorage.setItem('isAdmin', 'false'); // DEMOMENTO HARDCODEADO ---> CAMBIAR!!!!****************
    setIsAdmin(false);
  };

  const register = () => {
    sessionStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);

    sessionStorage.setItem('isAdmin', 'false'); // Debería ser siempre false, ya que los admin no se registran
    setIsAdmin(false);
  };

  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);

    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
