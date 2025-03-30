import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Box, Chip, Tooltip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { usePdf } from '../../contexts/PdfContext';

// Componente para mostrar el historial de consultas del usuario
const QueryHistoryPage = () => {
  const { 
    queryHistory, 
    deleteQueryFromHistory, 
    toggleQueryStar, 
    fetchQueryHistory 
  } = usePdf();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'simple_query', 'structured_summary', 'starred'
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Cargar historial solo al montar el componente, sin dependencias que causen bucles
  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        // Intenta cargar desde la API si la función está disponible
        if (typeof fetchQueryHistory === 'function') {
          await fetchQueryHistory();
          console.log('Historial cargado correctamente');
        } else {
          console.log('La función fetchQueryHistory no está disponible'); 
        }
        
        // Intento de respaldo desde localStorage (solo si realmente es necesario)
        // Este código solo se ejecutará si fetchQueryHistory no existe o falla
        if (!fetchQueryHistory) {
          console.log('Intentando cargar desde localStorage como respaldo...');
          try {
            const savedHistory = localStorage.getItem('queryHistory');
            if (savedHistory) {
              const parsed = JSON.parse(savedHistory);
              if (Array.isArray(parsed) && parsed.length > 0) {
                console.log(`Encontradas ${parsed.length} consultas en localStorage`);
              }
            }
          } catch (e) {
            console.error('Error al intentar cargar desde localStorage:', e);
          }
        }
      } catch (error) {
        console.error('Error al cargar el historial:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Cargar una sola vez al montar el componente
    loadHistory();
    
    // No necesitamos recargar constantemente
    // Si hay problemas con la carga de datos, es mejor mostrar un botón
    // de recarga manual en la interfaz que un polling automático
    
    // Limpieza en caso de desmontaje
    return () => {};
  }, [fetchQueryHistory]); // Solo fetchQueryHistory como dependencia, no queryHistory
  
  // Función para recargar manualmente el historial
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchQueryHistory();
    } catch (error) {
      console.error('Error al recargar el historial:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar y ordenar el historial
  const filteredAndSortedHistory = React.useMemo(() => {
    if (!queryHistory || !Array.isArray(queryHistory)) return [];
    
    // Filtrar por tipo y términos de búsqueda
    let filtered = queryHistory.filter(query => {
      // Filtrar por tipo
      if (filter === 'simple_query' && query.queryType !== 'simple_query') return false;
      if (filter === 'structured_summary' && query.queryType !== 'structured_summary') return false;
      if (filter === 'starred' && !query.starred) return false;
      
      // Filtrar por término de búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const promptMatch = query.prompt && query.prompt.toLowerCase().includes(searchLower);
        const responseMatch = query.response && query.response.toLowerCase().includes(searchLower);
        const keywordsMatch = query.keywords && query.keywords.some(k => k.toLowerCase().includes(searchLower));
        
        return promptMatch || responseMatch || keywordsMatch;
      }
      
      return true;
    });
    
    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Manejar campos anidados como tokens.total
      if (sortField === 'tokens.total') {
        aValue = a.tokens?.total || 0;
        bValue = b.tokens?.total || 0;
      }
      
      // Manejar fechas
      if (sortField === 'timestamp') {
        aValue = new Date(a.timestamp || 0).getTime();
        bValue = new Date(b.timestamp || 0).getTime();
      }
      
      // Dirección de ordenamiento
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -1 * direction;
      if (aValue > bValue) return 1 * direction;
      return 0;
    });
    
    return filtered;
  }, [queryHistory, filter, searchTerm, sortField, sortDirection]);
  
  // Formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha desconocida';
    
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Ver detalles de una consulta
  const handleViewQueryDetails = (query) => {
    setSelectedQuery(query);
    setDialogOpen(true);
  };
  
  // Formatear tipo de consulta
  const formatQueryType = (type) => {
    switch(type) {
      case 'simple_query': return 'Consulta Simple';
      case 'structured_summary': return 'Resumen Estructurado';
      case 'review_article': return 'Artículo de Revisión';
      default: return type || 'Desconocido';
    }
  };
  
  // Cambiar el orden
  const handleSortChange = (field) => {
    if (sortField === field) {
      // Si ya está ordenando por este campo, cambia la dirección
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un nuevo campo, establece ese campo y dirección descendente por defecto
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Truncar texto largo
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Historial de Consultas
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleRefresh}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SortIcon />}
        >
          {loading ? 'Cargando...' : 'Actualizar'}
        </Button>
      </Box>
      
      {/* Barra de filtros y búsqueda */}
      <Box sx={{ display: 'flex', mb: 3, gap: 2, flexWrap: 'wrap' }}>
        {/* Búsqueda */}
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {/* Filtro por tipo */}
        <FormControl size="small" sx={{ minWidth: '180px' }}>
          <InputLabel id="filter-type-label">Filtrar por Tipo</InputLabel>
          <Select
            labelId="filter-type-label"
            value={filter}
            label="Filtrar por Tipo"
            onChange={(e) => setFilter(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="simple_query">Consultas Simples</MenuItem>
            <MenuItem value="structured_summary">Resúmenes</MenuItem>
            <MenuItem value="starred">Favoritos</MenuItem>
          </Select>
        </FormControl>
        
        {/* Ordenación */}
        <FormControl size="small" sx={{ minWidth: '180px' }}>
          <InputLabel id="sort-field-label">Ordenar por</InputLabel>
          <Select
            labelId="sort-field-label"
            value={sortField}
            label="Ordenar por"
            onChange={(e) => handleSortChange(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="timestamp">Fecha</MenuItem>
            <MenuItem value="prompt">Consulta</MenuItem>
            <MenuItem value="tokens.total">Tokens</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title={`Orden ${sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}`}>
          <IconButton 
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            color="primary"
          >
            {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Tabla de historial */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : filteredAndSortedHistory.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No hay consultas que coincidan con los criterios de búsqueda.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Consulta/Prompt</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Tokens</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedHistory.map((query) => (
                <TableRow key={query._id || query.id} 
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell padding="checkbox">
                    <IconButton 
                      size="small" 
                      onClick={() => toggleQueryStar(query._id || query.id)}
                      color={query.starred ? "warning" : "default"}
                    >
                      {query.starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{formatDate(query.timestamp)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={formatQueryType(query.queryType)} 
                      color={query.queryType === 'structured_summary' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={query.prompt || ''}>
                      <Typography variant="body2">
                        {truncateText(query.prompt, 70)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={query.model || 'N/A'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {query.tokens?.total || (query.tokenUsage?.totalTokens) || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleViewQueryDetails(query)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        const queryId = query._id || query.id;
                        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
                          // Mostramos feedback inmediato
                          console.log(`Eliminando consulta ${queryId}...`);
                          
                          // Luego eliminamos del backend
                          deleteQueryFromHistory(queryId).then(() => {
                            // Recargar la lista completa después de un momento
                            setTimeout(() => {
                              fetchQueryHistory();
                            }, 500);
                          }).catch(err => {
                            console.error('Error al eliminar:', err);
                            // Recargar de todos modos para mantener sincronizado
                            fetchQueryHistory();
                          });
                        }
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Diálogo de detalles */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedQuery?.queryType === 'structured_summary' 
                ? 'Resumen Estructurado' 
                : 'Consulta Simple'}
            </Typography>
            <Box>
              <IconButton 
                onClick={() => toggleQueryStar(selectedQuery?._id || selectedQuery?.id)}
                color={selectedQuery?.starred ? "warning" : "default"}
              >
                {selectedQuery?.starred ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuery && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Fecha: {formatDate(selectedQuery.timestamp)}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Modelo: {selectedQuery.model || 'N/A'}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Tokens: {selectedQuery.tokens?.total || (selectedQuery.tokenUsage?.totalTokens) || 'N/A'}
              </Typography>
              
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Consulta/Prompt:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'action.hover' }}>
                  <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedQuery.prompt || 'N/A'}
                  </Typography>
                </Paper>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Respuesta:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'action.hover', maxHeight: '400px', overflow: 'auto' }}>
                  {typeof selectedQuery.response === 'object' ? (
                    // Si la respuesta es un objeto (como podría ser con resúmenes estructurados)
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {JSON.stringify(selectedQuery.response, null, 2)}
                    </pre>
                  ) : (
                    // Si la respuesta es una cadena de texto normal
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
                      {selectedQuery.response || 'N/A'}
                    </Typography>
                  )}
                </Paper>
              </Box>
              
              {selectedQuery.processedFiles && selectedQuery.processedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Archivos Procesados:
                  </Typography>
                  <ul>
                    {selectedQuery.processedFiles.map((file, index) => (
                      <li key={index}>
                        <Typography variant="body2">
                          {file.filename || 'Archivo sin nombre'} 
                          {file.fileSize ? ` (${Math.round(file.fileSize / 1024)} KB)` : ''}
                          {file.pageCount ? ` - ${file.pageCount} páginas` : ''}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QueryHistoryPage;
