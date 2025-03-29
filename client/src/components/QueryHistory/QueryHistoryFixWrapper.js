import React, { useEffect } from 'react';
import { 
  Box, CircularProgress, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Tooltip, IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { usePdf } from '../../contexts/PdfContext';

/**
 * Componente wrapper para evitar el bucle infinito en la carga del historial.
 * Este componente se encarga de cargar los datos una sola vez, sin generar un bucle.
 */
const QueryHistoryFixWrapper = () => {
  const { fetchQueryHistory, queryHistory } = usePdf();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [loadedOnce, setLoadedOnce] = React.useState(false);

  useEffect(() => {
    // Cargar datos solo una vez al montar el componente
    const loadData = async () => {
      if (loadedOnce) return;
      
      setLoading(true);
      try {
        // Llamar a la API para cargar el historial
        if (fetchQueryHistory) {
          await fetchQueryHistory();
        }
        setLoadedOnce(true);
      } catch (err) {
        console.error('Error cargando el historial:', err);
        setError(err.message || 'Error al cargar el historial');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchQueryHistory, loadedOnce]);

  // Función para recargar manualmente
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (fetchQueryHistory) {
        await fetchQueryHistory();
      }
    } catch (err) {
      console.error('Error al recargar:', err);
      setError(err.message || 'Error al recargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !queryHistory?.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando historial...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error al cargar el historial
        </Typography>
        <Typography variant="body1" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ mt: 2 }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  // Renderizamos una tabla de historial de consultas similar a la original
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Historial de Consultas
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleRefresh}
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          disabled={loading}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </Box>

      {queryHistory && queryHistory.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table aria-label="tabla de historial de consultas">
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.light' }}>
                <TableCell>Tipo</TableCell>
                <TableCell>Consulta</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queryHistory.map((query) => (
                <TableRow key={query._id || query.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                  <TableCell>
                    {(() => {
                      // Determinar el tipo de consulta basado en varios criterios
                      let queryType = '';
                      let chipColor = 'default';
                      
                      // Verificar por el campo type explícito
                      if (query.type === 'structured_summary') {
                        queryType = 'Resumen Estructurado';
                        chipColor = 'primary';
                      } else if (query.type === 'article_review') {
                        queryType = 'Artículo de Revisión';
                        chipColor = 'secondary';
                      } 
                      // Verificar por el contenido si type no es explícito
                      else if (query.query && query.query.toLowerCase().includes('resumen estructurado')) {
                        queryType = 'Resumen Estructurado';
                        chipColor = 'primary';
                      } else if (query.query && query.query.toLowerCase().includes('artículo de revisión')) {
                        queryType = 'Artículo de Revisión';
                        chipColor = 'secondary';
                      } else if (query.prompt && query.prompt.toLowerCase().includes('resumen estructurado')) {
                        queryType = 'Resumen Estructurado';
                        chipColor = 'primary';
                      } else if (query.prompt && query.prompt.toLowerCase().includes('artículo de revisión')) {
                        queryType = 'Artículo de Revisión';
                        chipColor = 'secondary';
                      } else {
                        queryType = 'Consulta Simple';
                        chipColor = 'default';
                      }
                      
                      return (
                        <Chip 
                          label={queryType}
                          color={chipColor}
                          size="small"
                          variant="outlined"
                        />
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    {(() => {
                      // Determinar el texto a mostrar con prioridad para query, prompt o title
                      const displayText = query.query || query.prompt || query.title || 'Consulta sin texto';
                      
                      return (
                        <Tooltip title={displayText}>
                          <Typography noWrap sx={{ maxWidth: 300 }}>
                            {displayText.length > 50 ? `${displayText.substring(0, 50)}...` : displayText}
                          </Typography>
                        </Tooltip>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    {new Date(query.timestamp || query.createdAt).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Favorito">
                        <IconButton size="small" color="primary">
                          {query.starred ? 
                            <StarIcon fontSize="small" /> : 
                            <StarBorderIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No se encontraron consultas en el historial.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QueryHistoryFixWrapper;
