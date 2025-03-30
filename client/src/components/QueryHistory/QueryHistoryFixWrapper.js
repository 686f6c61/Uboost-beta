import React, { useEffect, useState } from 'react';
import { 
  Box, CircularProgress, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, Tooltip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert, ButtonGroup
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MarkdownIcon from '@mui/icons-material/Article';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SortIcon from '@mui/icons-material/Sort';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { usePdf } from '../../contexts/PdfContext';

/**
 * Componente wrapper para evitar el bucle infinito en la carga del historial.
 * Este componente se encarga de cargar los datos una sola vez, sin generar un bucle.
 */
const QueryHistoryFixWrapper = () => {
  const { fetchQueryHistory, queryHistory } = usePdf();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [orderBy, setOrderBy] = useState('timestamp');
  const [orderDirection, setOrderDirection] = useState('desc');

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
  
  // Función para copiar contenido al portapapeles
  const handleCopyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Contenido copiado al portapapeles',
          severity: 'success'
        });
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        setSnackbar({
          open: true,
          message: 'Error al copiar al portapapeles',
          severity: 'error'
        });
      });
  };
  
  // Función para descargar como archivo de texto
  const handleDownloadAsText = (content, filename = 'consulta.txt') => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSnackbar({
      open: true,
      message: `Archivo ${filename} descargado`,
      severity: 'success'
    });
  };
  
  // Función para manejar el cambio de ordenación
  const handleSort = (field) => {
    if (orderBy === field) {
      // Si ya estamos ordenando por este campo, cambiar la dirección
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un nuevo campo, establecer dirección por defecto
      setOrderBy(field);
      setOrderDirection('desc'); // ordenar por defecto del más reciente al más antiguo
    }
  };

  // Función para ordenar los datos del historial
  const sortedData = () => {
    if (!queryHistory || !queryHistory.length) return [];
    
    return [...queryHistory].sort((a, b) => {
      if (orderBy === 'timestamp') {
        const dateA = new Date(a.timestamp || a.createdAt);
        const dateB = new Date(b.timestamp || b.createdAt);
        return orderDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (orderBy === 'type') {
        // Determinar los tipos para comparación
        const getTypeValue = (query) => {
          if (query.type === 'structured_summary' || 
              (query.query && query.query.toLowerCase().includes('resumen estructurado')) ||
              (query.prompt && query.prompt.toLowerCase().includes('resumen estructurado'))) {
            return 'Resumen Estructurado';
          } else if (query.type === 'article_review' || 
                    (query.query && query.query.toLowerCase().includes('artículo de revisión')) ||
                    (query.prompt && query.prompt.toLowerCase().includes('artículo de revisión'))) {
            return 'Artículo de Revisión';
          } else {
            return 'Consulta Simple';
          }
        };
        
        const typeA = getTypeValue(a);
        const typeB = getTypeValue(b);
        
        if (orderDirection === 'asc') {
          return typeA.localeCompare(typeB);
        } else {
          return typeB.localeCompare(typeA);
        }
      } else if (orderBy === 'query') {
        const textA = a.query || a.prompt || a.title || '';
        const textB = b.query || b.prompt || b.title || '';
        return orderDirection === 'asc' ? textA.localeCompare(textB) : textB.localeCompare(textA);
      }
      
      return 0;
    });
  };
  
  // Función para descargar como archivo markdown
  const handleDownloadAsMarkdown = (query, response, filename = 'consulta.md') => {
    // Formato markdown con título, fecha, consulta y respuesta
    const markdownContent = `# Consulta: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}

` +
      `**Fecha:** ${new Date(selectedQuery.timestamp || selectedQuery.createdAt).toLocaleString('es-ES')}

` +
      `**Modelo:** ${selectedQuery.model || 'No especificado'}

` +
      `## Consulta/Prompt

${query}

` +
      `## Respuesta

${response}
`;
    
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSnackbar({
      open: true,
      message: `Archivo ${filename} descargado`,
      severity: 'success'
    });
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Historial de consultas
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleRefresh}
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            disabled={loading}
            size="small"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </Box>
      </Box>

      {/* Filtros y ordenación */}
      {queryHistory && queryHistory.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon color="primary" />
              <Typography variant="subtitle1" fontWeight="medium">
                Filtros:
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Ordenar por fecha">
                  <Button 
                    onClick={() => handleSort('timestamp')} 
                    startIcon={<CalendarTodayIcon />}
                    color={orderBy === 'timestamp' ? 'primary' : 'inherit'}
                    variant={orderBy === 'timestamp' ? 'contained' : 'outlined'}
                    endIcon={orderBy === 'timestamp' ? (orderDirection === 'asc' ? <SwapVertIcon /> : <SwapVertIcon sx={{ transform: 'rotate(180deg)' }} />) : null}
                  >
                    Fecha
                  </Button>
                </Tooltip>
                
                <Tooltip title="Ordenar por tipo">
                  <Button 
                    onClick={() => handleSort('type')} 
                    startIcon={<CategoryIcon />}
                    color={orderBy === 'type' ? 'primary' : 'inherit'}
                    variant={orderBy === 'type' ? 'contained' : 'outlined'}
                    endIcon={orderBy === 'type' ? (orderDirection === 'asc' ? <SwapVertIcon /> : <SwapVertIcon sx={{ transform: 'rotate(180deg)' }} />) : null}
                  >
                    Tipo
                  </Button>
                </Tooltip>
                
                <Tooltip title="Ordenar por texto">
                  <Button 
                    onClick={() => handleSort('query')} 
                    startIcon={<TextFieldsIcon />}
                    color={orderBy === 'query' ? 'primary' : 'inherit'}
                    variant={orderBy === 'query' ? 'contained' : 'outlined'}
                    endIcon={orderBy === 'query' ? (orderDirection === 'asc' ? <SwapVertIcon /> : <SwapVertIcon sx={{ transform: 'rotate(180deg)' }} />) : null}
                  >
                    Texto
                  </Button>
                </Tooltip>
              </ButtonGroup>
              
              <Tooltip title="Cambiar dirección">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc')}
                  startIcon={<SortIcon />}
                >
                  {orderDirection === 'asc' ? 'Ascendente' : 'Descendente'}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      )}
      
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
              {sortedData().map((query) => (
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
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => {
                            setSelectedQuery(query);
                            setDialogOpen(true);
                          }}
                        >
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
      
      {/* Diálogo para ver los detalles de la consulta */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon color="primary" />
          Detalles de la consulta
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuery && (
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Tipo:</strong> {selectedQuery.type || 
                  (selectedQuery.query?.toLowerCase().includes('resumen estructurado') ? 'Resumen Estructurado' : 
                   selectedQuery.query?.toLowerCase().includes('artículo de revisión') ? 'Artículo de Revisión' : 'Consulta Simple')}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                <strong>Fecha:</strong> {new Date(selectedQuery.timestamp || selectedQuery.createdAt).toLocaleString('es-ES')}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                <strong>Modelo:</strong> {selectedQuery.model || 'No especificado'}
              </Typography>
              
              {selectedQuery.tokens && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Tokens:</strong> {selectedQuery.tokens.total || 'No especificado'}
                </Typography>
              )}
              
              <Box sx={{ mt: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Consulta/Prompt:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5', maxHeight: '200px', overflow: 'auto' }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedQuery.query || selectedQuery.prompt || 'No hay texto de consulta disponible'}
                  </Typography>
                </Paper>
              </Box>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Respuesta:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5', maxHeight: '300px', overflow: 'auto' }}>
                  {typeof selectedQuery.response === 'object' ? (
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {JSON.stringify(selectedQuery.response, null, 2)}
                    </pre>
                  ) : (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedQuery.response || 'No hay respuesta disponible'}
                    </Typography>
                  )}
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', px: 3, py: 2 }}>
          <ButtonGroup variant="outlined" size="small">
            <Tooltip title="Copiar al portapapeles">
              <Button 
                onClick={() => {
                  const query = selectedQuery.query || selectedQuery.prompt || 'No hay texto de consulta disponible';
                  const response = typeof selectedQuery.response === 'object' 
                    ? JSON.stringify(selectedQuery.response, null, 2) 
                    : selectedQuery.response || 'No hay respuesta disponible';
                  const fullContent = `Consulta: ${query}\n\nRespuesta: ${response}`;
                  handleCopyToClipboard(fullContent);
                }}
                startIcon={<ContentCopyIcon />}
              >
                Copiar
              </Button>
            </Tooltip>
            <Tooltip title="Descargar como texto">
              <Button 
                onClick={() => {
                  const query = selectedQuery.query || selectedQuery.prompt || 'No hay texto de consulta disponible';
                  const response = typeof selectedQuery.response === 'object' 
                    ? JSON.stringify(selectedQuery.response, null, 2) 
                    : selectedQuery.response || 'No hay respuesta disponible';
                  const fullContent = `Consulta: ${query}\n\nRespuesta: ${response}`;
                  handleDownloadAsText(fullContent, `consulta_${new Date().toISOString().slice(0,10)}.txt`);
                }}
                startIcon={<FileDownloadIcon />}
              >
                TXT
              </Button>
            </Tooltip>
            <Tooltip title="Descargar como markdown">
              <Button 
                onClick={() => {
                  const query = selectedQuery.query || selectedQuery.prompt || 'No hay texto de consulta disponible';
                  const response = typeof selectedQuery.response === 'object' 
                    ? JSON.stringify(selectedQuery.response, null, 2) 
                    : selectedQuery.response || 'No hay respuesta disponible';
                  handleDownloadAsMarkdown(
                    query, 
                    response, 
                    `consulta_${new Date().toISOString().slice(0,10)}.md`
                  );
                }}
                startIcon={<MarkdownIcon />}
              >
                MD
              </Button>
            </Tooltip>
          </ButtonGroup>
          
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QueryHistoryFixWrapper;
