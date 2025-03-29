import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
  Button,
  LinearProgress,
  Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FolderIcon from '@mui/icons-material/Folder';
import { getAllPdfs } from '../../../api/pdfApi';

/**
 * Función para formatear bytes a una unidad legible
 */
const formatBytes = (bytes, decimals = 2) => {
  // Si el valor es nulo, indefinido o no es un número válido, mostrar tamaño desconocido
  if (bytes === null || bytes === undefined) {
    return 'Tamaño desconocido';
  }
  
  // Intentar convertir a número si es string
  const numericBytes = typeof bytes === 'string' ? Number(bytes.replace(/[^0-9.-]+/g, '')) : Number(bytes);
  
  // Si después de la conversión sigue sin ser un número válido o es 0
  if (isNaN(numericBytes) || numericBytes <= 0) {
    return 'Tamaño desconocido';
  }
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(numericBytes) / Math.log(k));
  
  // Devolver el tamaño formateado con la unidad
  return parseFloat((numericBytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Función para obtener el nombre del archivo sin extensión
 */
const getFilenameWithoutExtension = (filename) => {
  if (!filename) return '';
  return filename.replace(/\.[^/.]+$/, "");
};

/**
 * Componente que muestra el uso de almacenamiento
 */
const StorageUsageIndicator = ({ pdfs }) => {
  // Calcular el tamaño total de todos los PDFs
  const totalSizeBytes = pdfs.reduce((acc, pdf) => {
    const size = Number(pdf.size) || 0;
    return acc + size;
  }, 0);
  
  // Calcular porcentaje de uso (límite de 200MB = 209715200 bytes)
  const storageLimit = 200 * 1024 * 1024; // 200MB en bytes
  const usedPercentage = Math.min(100, Math.round((totalSizeBytes / storageLimit) * 100));
  const remainingBytes = storageLimit - totalSizeBytes;
  
  // Determinar el color de la barra de progreso según el uso
  let progressColor = 'success.main';
  if (usedPercentage > 85) progressColor = 'error.main';
  else if (usedPercentage > 70) progressColor = 'warning.main';
  
  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Espacio utilizado: <Box component="span" sx={{ fontWeight: 'medium' }}>{formatBytes(totalSizeBytes)}</Box>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Disponible: <Box component="span" sx={{ fontWeight: 'medium' }}>{formatBytes(remainingBytes)}</Box>
        </Typography>
      </Box>
      
      <Tooltip title={`${usedPercentage}% utilizado de 200MB`} arrow placement="top">
        <LinearProgress 
          variant="determinate" 
          value={usedPercentage} 
          sx={{ 
            height: 8, 
            borderRadius: 1,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: progressColor
            }
          }} 
        />
      </Tooltip>
    </Box>
  );
};

/**
 * Función para calcular el tamaño total de los PDFs
 */
const calculateTotalSize = (pdfs) => {
  const totalBytes = pdfs.reduce((acc, pdf) => {
    const size = Number(pdf.size) || 0;
    return acc + size;
  }, 0);
  
  return `Tamaño total: ${formatBytes(totalBytes)}`;
};

/**
 * Componente que carga y muestra la lista de PDFs ya almacenados en el servidor
 */
const ExistingPdfList = ({ 
  onPdfsSelected,
  disabled = false 
}) => {
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar PDFs
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const pdfList = await getAllPdfs();
      
      if (Array.isArray(pdfList)) {
        // Agregar log para depuración
        console.log('PDFs cargados:', pdfList);
        
        // Asegurar que cada PDF tenga información de tamaño adecuada
        const processedPdfs = pdfList.map(pdf => {
          // Buscar el tamaño en las diferentes propiedades donde podría estar
          const size = pdf.size || pdf.fileSize || pdf.contentLength || pdf.length || null;
          
          // Verificar si hay problemas de tamaño cero o formato inválido
          if (size === 0 || size === '0' || size === '0B' || !size) {
            console.warn(`PDF con tamaño inválido (${pdf.originalName || pdf.name}):`, pdf);
          }
          
          return {
            ...pdf,
            // Asegurarse de que size sea un número siempre que sea posible
            size: typeof size === 'string' ? Number(size.replace(/[^0-9.-]+/g, '')) || null : size
          };
        });
        
        setPdfs(processedPdfs);
        
        if (processedPdfs.length === 0) {
          setError('No hay PDFs cargados en el sistema. Por favor, sube algunos PDFs primero.');
        }
      } else {
        console.error('Formato de respuesta inesperado:', pdfList);
        setError('Error en el formato de datos recibidos del servidor.');
      }
    } catch (err) {
      console.error('Error al cargar PDFs:', err);
      
      if (err.response && err.response.status === 401) {
        setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      } else if (err.message.includes('Network Error')) {
        setError('Error de conexión con el servidor. Verifica tu conexión a internet.');
      } else {
        setError('No se pudieron cargar los PDFs. Por favor, intente de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Cargar los PDFs al montar el componente
  useEffect(() => {
    fetchPdfs();
  }, []);

  // Actualizar los PDFs seleccionados cuando cambia la selección
  useEffect(() => {
    if (onPdfsSelected) {
      const selectedPdfObjects = pdfs.filter(pdf => selectedPdfs.includes(pdf.id));
      onPdfsSelected(selectedPdfObjects);
    }
  }, [selectedPdfs, pdfs, onPdfsSelected]);

  // Manejador para seleccionar/deseleccionar un PDF
  const togglePdfSelection = (pdfId) => {
    if (disabled) return;
    
    setSelectedPdfs(prev => {
      if (prev.includes(pdfId)) {
        return prev.filter(id => id !== pdfId);
      } else {
        return [...prev, pdfId];
      }
    });
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 0.5, 
        bgcolor: 'primary.main', 
        p: 1.5, 
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'white', display: 'flex', alignItems: 'center' }}>
          <FolderIcon sx={{ mr: 1, fontSize: '1.2rem' }} /> PDFs Disponibles
        </Typography>
        <Box sx={{ bgcolor: 'background.paper', color: 'primary.main', borderRadius: 4, px: 1.5, py: 0.3, fontWeight: 'medium', fontSize: '0.875rem' }}>
          {pdfs.length} documento{pdfs.length !== 1 ? 's' : ''}
        </Box>
      </Box>
      
      <Paper 
        elevation={1}
        sx={{ 
          maxHeight: 350, 
          overflow: 'auto', 
          p: 2, 
          mb: 3,
          borderRadius: 1,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ my: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                size="small" 
                onClick={fetchPdfs}
                startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>}
              >
                Reintentar
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Selecciona los PDFs que deseas incluir en tu artículo de revisión.
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  PDFs seleccionados: {selectedPdfs.length} de {pdfs.length}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                  {calculateTotalSize(pdfs)}
                </Typography>
              </Box>
              
              {/* Visualización del uso de almacenamiento */}
              <StorageUsageIndicator pdfs={pdfs} />
            </Box>
            
            <List dense disablePadding>
              {pdfs.map((pdf) => (
                <ListItem 
                  key={pdf.id} 
                  dense 
                  button 
                  onClick={() => togglePdfSelection(pdf.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    bgcolor: selectedPdfs.includes(pdf.id) ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    '&:hover': {
                      bgcolor: selectedPdfs.includes(pdf.id) ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {selectedPdfs.includes(pdf.id) ? (
                      <CheckCircleIcon color="primary" fontSize="small" />
                    ) : (
                      <Checkbox 
                        edge="start" 
                        checked={selectedPdfs.includes(pdf.id)} 
                        tabIndex={-1} 
                        disableRipple 
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={getFilenameWithoutExtension(pdf.originalName || pdf.name)} 
                    secondary={
                      <>
                        <Box component="span" sx={{ 
                          fontWeight: 'medium', 
                          color: pdf.size && Number(pdf.size) > 200 * 1024 * 1024 ? 'error.main' : 'text.secondary',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {formatBytes(pdf.size)}
                          {pdf.size && Number(pdf.size) > 200 * 1024 * 1024 && (
                            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                              </svg>
                            </Box>
                          )}
                        </Box>
                        <Box component="span" sx={{ mx: 0.5, color: 'text.disabled' }}>•</Box>
                        <Box component="span">
                          {new Date(pdf.uploadDate || pdf.createdAt).toLocaleDateString()}
                        </Box>
                      </>
                    }
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      sx: { 
                        fontWeight: selectedPdfs.includes(pdf.id) ? 'medium' : 'regular',
                        color: selectedPdfs.includes(pdf.id) ? 'primary.main' : 'text.primary'
                      } 
                    }}
                    secondaryTypographyProps={{ 
                      variant: 'caption',
                      sx: { fontSize: '0.75rem' }
                    }}
                  />
                  <PictureAsPdfIcon 
                    fontSize="small" 
                    sx={{ 
                      color: selectedPdfs.includes(pdf.id) ? 'primary.main' : 'text.secondary',
                      opacity: 0.7,
                      mr: 1
                    }} 
                  />
                </ListItem>
              ))}
              
              {pdfs.length === 0 && (
                <ListItem sx={{ justifyContent: 'center', py: 4 }}>
                  <Typography color="text.secondary" variant="body2">
                    No hay PDFs disponibles en el sistema.
                  </Typography>
                </ListItem>
              )}
            </List>
          </>
        )}
      </Paper>
    </>
  );
};

export default ExistingPdfList;
