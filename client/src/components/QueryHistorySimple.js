import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DescriptionIcon from '@mui/icons-material/Description';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePdf } from '../contexts/PdfContext';

// Función auxiliar para descargar contenido como archivo
const downloadContent = (content, filename, contentType) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Un componente de historial simplificado para evitar errores
const QueryHistorySimple = () => {
  // Obtener funciones y datos del contexto PDF
  const { 
    deleteQueryFromHistory,
    queryHistory: contextQueryHistory,
    fetchQueryHistory 
  } = usePdf();
  
  // Estado local del historial
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar el historial cuando el componente se monte
  useEffect(() => {
    // Usar el historial del contexto si ya está cargado
    if (contextQueryHistory && contextQueryHistory.length > 0) {
      setHistory(contextQueryHistory);
      setLoading(false);
    } else {
      // Solo cargar si no existe en el contexto
      loadHistory();
    }
  // Se incluyen las dependencias para evitar la advertencia, pero usamos una referencia
  // a la función memoizada para evitar el bucle infinito
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextQueryHistory]);
  
  // Cargar el historial desde localStorage
  const loadHistory = () => {
    setLoading(true);
    try {
      // Intentar cargar desde la API a través del contexto
      if (fetchQueryHistory) {
        fetchQueryHistory().then(() => {
          if (contextQueryHistory && contextQueryHistory.length > 0) {
            setHistory(contextQueryHistory);
            console.log(`Cargadas ${contextQueryHistory.length} consultas desde la API`);
            setLoading(false);
            return;
          } else {
            // Si no hay consultas en la API, intentar cargar desde localStorage
            loadFromLocalStorage();
          }
        }).catch(err => {
          console.error('Error cargando desde API:', err);
          loadFromLocalStorage();
        });
      } else {
        loadFromLocalStorage();
      }
    } catch (err) {
      console.error('Error cargando historial:', err);
      setHistory([]);
      setLoading(false);
    }
  };
  
  // Función auxiliar para cargar desde localStorage
  const loadFromLocalStorage = () => {
    try {
      const savedHistory = localStorage.getItem('queryHistory');
      
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) {
            setHistory(parsed);
            console.log(`Cargadas ${parsed.length} consultas del historial local`);
          } else {
            console.warn('El historial en localStorage no es un array');
            setHistory([]);
          }
        } catch (e) {
          console.error('Error al parsear el historial:', e);
          setHistory([]);
        }
      } else {
        console.log('No se encontró historial en localStorage');
        setHistory([]);
      }
    } catch (error) {
      console.error('Error cargando el historial:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Formatear la fecha y hora
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };
  
  // Determinar el tipo de consulta para mostrar
  const getQueryType = (query) => {
    if (!query) return { label: 'Desconocido', color: 'default' };
    
    if (query.queryType === 'structured_summary' || query.isStructuredSummary) {
      return { label: 'Resumen Estructurado', color: 'primary' };
    } else if (query.queryType === 'review_article') {
      return { label: 'Artículo de Revisión', color: 'secondary' };
    } else {
      return { label: 'Consulta Simple', color: 'default' };
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Historial de consultas y resúmenes
      </Typography>
      
      {loading ? (
        <Typography>Cargando historial...</Typography>
      ) : history.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            No hay consultas en el historial todavía.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cuando realices consultas, aparecerán aquí para que puedas revisarlas más tarde.
          </Typography>
        </Paper>
      ) : (
        history.map((query, index) => (
          <Accordion key={query.id || index} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Typography sx={{ width: '60%', flexShrink: 0, fontWeight: 'medium' }}>
                  {query.prompt ? (
                    query.prompt.length > 70 ? 
                      `${query.prompt.substring(0, 70)}...` : 
                      query.prompt
                  ) : 'Consulta sin texto'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip 
                    label={getQueryType(query).label} 
                    color={getQueryType(query).color} 
                    size="small" 
                  />
                  <Typography variant="caption" color="text.secondary">
                    {query.timestamp ? formatDate(query.timestamp) : 'Fecha desconocida'}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Consulta:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2">
                    {query.prompt || 'No hay texto de consulta disponible'}
                  </Typography>
                </Paper>
                
                <Typography variant="subtitle2" gutterBottom>
                  Respuesta:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                  <Box className="markdown-content" sx={{ maxHeight: '300px', overflow: 'auto' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {query.response || ''}
                    </ReactMarkdown>
                  </Box>
                </Paper>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Modelo: {query.model || 'No disponible'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mx: 2 }}>
                      {query.configuration?.temperature ? `Temperatura: ${query.configuration.temperature}` : ''}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tokens: {(() => {
                        // Primero revisamos las diferentes estructuras posibles para los tokens
                        if (query.tokenUsage && query.tokenUsage.totalTokens) {
                          return query.tokenUsage.totalTokens;
                        }
                        if (query.tokens && typeof query.tokens.total !== 'undefined') {
                          return query.tokens.total;
                        }
                        if (query.tokens && typeof query.tokens === 'number') {
                          return query.tokens;
                        }
                        // Para objetos con propiedades numéricas como input/output
                        if (query.tokens && query.tokens.input && query.tokens.output) {
                          return Number(query.tokens.input) + Number(query.tokens.output);
                        }
                        // Verificar estructura anidada de tokens para compatibilidad
                        if (typeof query.tokenUsage?.promptTokens !== 'undefined' && 
                            typeof query.tokenUsage?.completionTokens !== 'undefined') {
                          return Number(query.tokenUsage.promptTokens) + Number(query.tokenUsage.completionTokens);
                        }
                        // Si llegamos aquí, no pudimos encontrar información de tokens
                        return 'N/A';
                      })()}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 1 }}>
                  <Tooltip title="Descargar respuesta como TXT">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        const content = query.response || '';
                        const filename = `consulta_${new Date(query.timestamp).toISOString().slice(0, 10)}.txt`;
                        downloadContent(content, filename, 'text/plain');
                      }}
                    >
                      <TextSnippetIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Descargar respuesta como Markdown">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        const content = query.response || '';
                        const filename = `consulta_${new Date(query.timestamp).toISOString().slice(0, 10)}.md`;
                        downloadContent(content, filename, 'text/markdown');
                      }}
                    >
                      <DescriptionIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar consulta del historial">
                    <IconButton 
                      color="error" 
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation(); // Evitar que se expanda/colapse el acordeón
                        // Confirmar antes de eliminar
                        if (window.confirm('¿Estás seguro de que deseas eliminar esta consulta?')) {
                          try {
                            const queryId = query._id || query.id;
                            console.log('Intentando eliminar consulta ID:', queryId);
                            
                            // Primero actualizar la UI para feedback instantáneo
                            const updatedHistory = history.filter(h => 
                              (h.id !== queryId) && (h._id !== queryId)
                            );
                            setHistory(updatedHistory);
                            
                            // Asegurarse de que localStorage se actualice
                            try {
                              const savedHistory = localStorage.getItem('queryHistory');
                              if (savedHistory) {
                                const parsed = JSON.parse(savedHistory);
                                if (Array.isArray(parsed)) {
                                  const filtered = parsed.filter(item => 
                                    item.id !== queryId && item._id !== queryId
                                  );
                                  localStorage.setItem('queryHistory', JSON.stringify(filtered));
                                }
                              }
                            } catch (e) {
                              console.error('Error en localStorage:', e);
                            }
                            
                            // Luego eliminar en el backend
                            if (deleteQueryFromHistory) {
                              deleteQueryFromHistory(queryId)
                                .then(success => {
                                  console.log(`Eliminación ${success ? 'exitosa' : 'fallida'} en el backend`);
                                  if (fetchQueryHistory) {
                                    // Recargar desde el servidor después de un breve retraso
                                    setTimeout(() => {
                                      fetchQueryHistory().then(data => {
                                        console.log('Historia recargada del servidor');
                                      });
                                    }, 500);
                                  }
                                })
                                .catch(err => {
                                  console.error('Error eliminando del servidor:', err);
                                });
                            }
                          } catch (err) {
                            console.error('Error al eliminar consulta:', err);
                          }
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default QueryHistorySimple;
