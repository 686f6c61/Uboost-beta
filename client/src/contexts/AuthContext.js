import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Configurar axios para enviar credenciales en todas las peticiones
axios.defaults.withCredentials = true;

// URL base fija para conectar al puerto 5100 del servidor
const getBaseUrl = () => {
  return 'http://localhost:5100';
};

// Crear una instancia de axios con la configuración adecuada para peticiones cross-origin
const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor básico para errores sin cambio de puerto
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.code === 'ERR_NETWORK') {
      console.log('[Auth] Error de conexión al servidor, verifique que el servidor esté ejecutándose en el puerto 5100');
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token if exists
  useEffect(() => {
    // Bandera para evitar peticiones múltiples
    let isMounted = true;
    let intervalId = null;
    
    const loadUser = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        const res = await apiClient.get('/api/auth/me');
        if (res.data.success && isMounted) {
          setCurrentUser(res.data.user);
        }
      } catch (err) {
        console.log('Not authenticated');
        // Clear any invalid tokens
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Cargar una vez al inicio
    loadUser();
    
    // Establecer un intervalo más largo (15 minutos) para renovar la sesión
    // en lugar de estar constantemente verificando
    intervalId = setInterval(() => {
      if (localStorage.getItem('token')) {
        loadUser();
      }
    }, 15 * 60 * 1000); // 15 minutos
    
    // Limpieza
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const res = await apiClient.post('/api/auth/register', userData);
      
      if (res.data.success) {
        setCurrentUser(res.data.user);
        // Store token in localStorage for API requests
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const res = await apiClient.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        setCurrentUser(res.data.user);
        // Store token in localStorage for API requests
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        }
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      return { success: false, message: err.response?.data?.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      // Primero hacer logout en el servidor
      await apiClient.get('/api/auth/logout');
      
      // Limpiar localStorage y cabeceras de autorización
      localStorage.removeItem('token');
      localStorage.removeItem('queryHistory'); // Por si acaso queda algo
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset completo del contexto PDF si existe la referencia
      if (window.pdfContextRef && window.pdfContextRef.current) {
        console.log('Limpiando todo el contexto PDF al cerrar sesión');
        window.pdfContextRef.current.resetAllState();
      }
      
      // Actualizar el estado de autenticación
      setCurrentUser(null);
      
      // Limpiar cualquier error
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
      return { success: false, message: err.response?.data?.message || 'Logout failed' };
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.put('/api/auth/updatedetails', userData);
      
      if (res.data.success) {
        setCurrentUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    } finally {
      setLoading(false);
    }
  };

  // Setup axios interceptor for token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Add a response interceptor to handle auth errors
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          // If token expired or invalid, log the user out
          if (currentUser) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up the interceptor when the component unmounts
      axios.interceptors.response.eject(interceptor);
    };
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAdmin: currentUser?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
