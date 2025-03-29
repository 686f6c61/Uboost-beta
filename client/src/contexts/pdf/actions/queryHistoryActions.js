import * as queryHistoryService from '../api/queryHistoryService';

// Query History actions
export const createQueryHistoryActions = (state) => {
  const {
    setQueryHistory,
    setSelectedQueries
  } = state;

  // Cargar el historial de consultas desde la API
  const fetchQueryHistory = async () => {
    try {
      const historyData = await queryHistoryService.fetchQueryHistory();
      setQueryHistory(historyData || []);
      return historyData;
    } catch (err) {
      console.error('Error al cargar historial de consultas:', err);
      return [];
    }
  };

  // Guardar historial en MongoDB a través de la API
  const saveQueryToDatabase = async (queryData) => {
    try {
      const savedQuery = await queryHistoryService.saveQueryToDatabase(queryData);
      
      // Al guardar correctamente, actualizar el estado local sin hacer una llamada adicional
      if (savedQuery) {
        // Añadir la nueva consulta al historial existente en lugar de recargar todo
        setQueryHistory(prev => [savedQuery, ...prev]);
      }
      
      return savedQuery;
    } catch (err) {
      console.error('Error guardando consulta en MongoDB:', err);
      console.error('Detalles del error:', err.response?.data || err.message);
      
      // No guardamos nada si la API falla, mostramos solo un error
      console.error('No se pudo guardar la consulta. Se requiere autenticación.');
      
      return null;
    }
  };

  // Eliminar una consulta del historial
  const deleteQueryFromHistory = async (queryId) => {
    try {
      // Primero eliminar de la base de datos si tiene un id de MongoDB
      const deleted = await queryHistoryService.deleteQueryFromHistory(queryId);
      
      // Luego actualizar el estado local
      const updatedHistory = deleted 
        ? state.queryHistory.filter(query => query.id !== queryId && query._id !== queryId)
        : state.queryHistory;
        
      setQueryHistory(updatedHistory);
      
      // También eliminar de seleccionados si estaba seleccionado
      if (state.selectedQueries.includes(queryId)) {
        setSelectedQueries(state.selectedQueries.filter(id => id !== queryId));
      }
    } catch (err) {
      console.error('Error al eliminar consulta:', err.response?.data || err.message);
      // Si hay error, al menos actualizamos el estado local
      const updatedHistory = state.queryHistory.filter(query => query.id !== queryId && query._id !== queryId);
      setQueryHistory(updatedHistory);
    }
  };

  // Limpiar todo el historial de consultas
  const clearQueryHistory = async () => {
    try {
      // Primero intentamos eliminar todo el historial de la base de datos
      // Nota: Como no hay un endpoint para eliminar todo, se podría implementar
      // o eliminar uno por uno (no lo implementamos aquí para evitar muchas llamadas)
      
      // Luego actualizamos el estado local
      setQueryHistory([]);
      setSelectedQueries([]);
      localStorage.removeItem('queryHistory');
    } catch (err) {
      console.error('Error al limpiar historial:', err.response?.data || err.message);
    }
  };

  // Marcar/desmarcar una consulta como favorita
  const toggleQueryStar = async (queryId) => {
    try {
      // Primero actualizar en la base de datos
      const updated = await queryHistoryService.toggleQueryStar(queryId);
      
      // Luego actualizar el estado local
      if (updated) {
        setQueryHistory(prev => 
          prev.map(query => {
            if (query.id === queryId || query._id === queryId) {
              return { ...query, starred: !query.starred };
            }
            return query;
          })
        );
      }
    } catch (err) {
      console.error('Error al marcar consulta como favorita:', err.response?.data || err.message);
    }
  };

  // Marcar/desmarcar una consulta como seleccionada (para acciones locales)
  const toggleQuerySelection = (queryId) => {
    setSelectedQueries(prevSelected => {
      if (prevSelected.includes(queryId)) {
        return prevSelected.filter(id => id !== queryId);
      } else {
        return [...prevSelected, queryId];
      }
    });
  };

  return {
    fetchQueryHistory,
    saveQueryToDatabase,
    deleteQueryFromHistory,
    clearQueryHistory,
    toggleQueryStar,
    toggleQuerySelection
  };
};
