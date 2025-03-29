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
      console.log('Error de conexión al servidor, verifique que el servidor esté ejecutándose en el puerto 5100');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
