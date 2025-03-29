import apiClient from './client';

// Query History Services
export const fetchQueryHistory = async () => {
  try {
    console.log('Iniciando carga del historial desde MongoDB...');
    // Verificar si estamos autenticados usando la instancia configurada correctamente
    const authTest = await apiClient.get('/api/auth/me').catch(e => null);
    
    if (!authTest) {
      console.warn('No hay sesión activa. El historial requiere autenticación.');
      return [];
    }
    
    // Usar apiClient que ya está configurado con credenciales
    const response = await apiClient.get('/api/history');
    console.log('Respuesta de la API de historial:', response);
    
    const historyData = response.data.data;
    if (Array.isArray(historyData)) {
      console.log(`Cargadas ${historyData.length} consultas del historial desde la API`);
      return historyData;
    } else {
      console.warn('La respuesta de la API no contiene un array:', historyData);
      return [];
    }
  } catch (err) {
    console.error('Error cargando historial desde API:', err);
    console.error('Detalles del error:', err.response?.data || err.message);
    return [];
  }
};

export const saveQueryToDatabase = async (queryData) => {
  try {
    // Verificar que tenemos todos los campos requeridos
    if (!queryData.queryType || !queryData.prompt || !queryData.promptType || !queryData.model) {
      console.error('Datos de consulta incompletos:', queryData);
      // Agregar campos faltantes con valores por defecto
      queryData.queryType = queryData.queryType || 'simple_query';
      queryData.prompt = queryData.prompt || '(Sin texto)';
      queryData.promptType = queryData.promptType || 'custom';
      queryData.model = queryData.model || 'gpt-4o-mini';
    }
    
    console.log('Intentando guardar consulta en MongoDB:', queryData);
    // Usar apiClient con las credenciales correctamente configuradas
    const response = await apiClient.post('/api/history', queryData);
    console.log('Consulta guardada exitosamente en MongoDB:', response.data);
    
    return response.data.data;
  } catch (err) {
    console.error('Error guardando consulta en MongoDB:', err);
    console.error('Detalles del error:', err.response?.data || err.message);
    return null;
  }
};

export const deleteQueryFromHistory = async (queryId) => {
  try {
    console.log(`Intentando eliminar consulta con ID: ${queryId}`);
    
    // Si parece un ObjectId de MongoDB, eliminarlo del servidor
    if (queryId && queryId.match && queryId.match(/^[0-9a-fA-F]{24}$/)) {
      const response = await apiClient.delete(`/api/history/${queryId}`);
      console.log('Respuesta de eliminación:', response.data);
      
      // También eliminar de localStorage para casos donde se sincroniza
      removeFromLocalStorage(queryId);
      return true;
    } else {
      // Si no es un ID de MongoDB, solo eliminarlo de localStorage
      console.log('ID no válido para MongoDB, eliminando solo de localStorage');
      removeFromLocalStorage(queryId);
      return true;
    }
  } catch (err) {
    console.error('Error al eliminar consulta:', err);
    // Intentar eliminar de localStorage de todos modos
    removeFromLocalStorage(queryId);
    return false;
  }
};

// Función auxiliar para eliminar del localStorage
const removeFromLocalStorage = (queryId) => {
  try {
    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter(item => 
          item.id !== queryId && item._id !== queryId
        );
        localStorage.setItem('queryHistory', JSON.stringify(filtered));
        console.log(`Elemento con ID ${queryId} eliminado de localStorage`);
      }
    }
  } catch (e) {
    console.error('Error eliminando de localStorage:', e);
  }
};

export const toggleQueryStar = async (queryId) => {
  if (queryId.match(/^[0-9a-fA-F]{24}$/)) {
    await apiClient.put(`/api/history/${queryId}/star`);
    return true;
  }
  return false;
};
