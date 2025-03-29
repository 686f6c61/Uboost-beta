import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton, 
  Checkbox, 
  Typography, 
  Tooltip, 
  Chip,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  LinearProgress,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usePdf } from '../contexts/PdfContext';
import StorageDisplay from './StorageDisplay';

const PdfList = () => {
  const { 
    pdfs, 
    selectedPdfs, 
    togglePdfSelection, 
    deletePdf, 
    deleteAllPdfs, 
    storageInfo = { limitMB: 200, usedBytes: 0 },
    getUserStorageInfo,
    loadPdfs
  } = usePdf() || {};
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Manejar la eliminación de todos los PDFs
  const handleDeleteAllPdfs = async () => {
    try {
      setLoading(true);
      const response = await deleteAllPdfs();
      setOpenConfirmDialog(false);
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: response.data.message || 'Todos los PDFs han sido eliminados correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar todos los PDFs:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error al eliminar todos los PDFs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // Funciones auxiliares para el indicador de almacenamiento
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Manejar la recalculación del espacio de almacenamiento
  const handleRecalculateStorage = async () => {
    try {
      setLoading(true);
      
      // Verificar si existe loadPdfs antes de llamarlo
      if (typeof loadPdfs === 'function') {
        await loadPdfs();
      } else {
        // Alternativa: Actualizar la información de almacenamiento si existe getUserStorageInfo
        if (typeof getUserStorageInfo === 'function') {
          await getUserStorageInfo();
        }
      }
      
      // Calcular el almacenamiento manualmente (fallback)
      const totalBytes = pdfs.reduce((total, pdf) => {
        // Buscar el tamaño en diferentes propiedades posibles
        const size = pdf.fileSize || pdf.size || pdf.contentLength || 0;
        return total + (typeof size === 'number' ? size : Number(size) || 0);
      }, 0);
      
      const usedStorage = formatBytes(totalBytes);
      
      // Actualizar el storageInfo localmente si es necesario
      if (typeof storageInfo === 'object') {
        storageInfo.usedBytes = totalBytes;
      }
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: `Almacenamiento recalculado: ${usedStorage} utilizados`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al recalcular almacenamiento:', error);
      // Mostrar mensaje de error
      setSnackbar({
        open: true,
        message: 'Error al recalcular el almacenamiento. Intenta de nuevo.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (used, limit) => {
    const usedMB = used / (1024 * 1024);
    return Math.min(Math.round((usedMB / limit) * 100), 100);
  };
  
  // Color según el porcentaje de uso
  const getStorageColor = (percentage) => {
    if (percentage < 70) return 'success.main';
    if (percentage < 90) return 'warning.main';
    return 'error.main';
  };

  // Formatear cuánto espacio queda disponible
  const getRemainingStorage = () => {
    if (!storageInfo) return '0.00';
    const usedMB = storageInfo.usedBytes / (1024 * 1024);
    const remainingMB = Math.max(storageInfo.limitMB - usedMB, 0);
    return remainingMB.toFixed(2);
  };

  // Actualizar información de almacenamiento al montar el componente solo una vez
  React.useEffect(() => {
    // Variable para controlar si el componente está montado
    let isMounted = true;
    
    // Función asíncrona para cargar los datos
    const loadStorageInfo = async () => {
      // Verificar explícitamente si la función está disponible y es una función
      if (typeof getUserStorageInfo === 'function' && isMounted) {
        try {
          await getUserStorageInfo();
        } catch (error) {
          console.error('Error al obtener información de almacenamiento:', error);
        }
      }
    };

    // Cargar datos solo una vez
    loadStorageInfo();
    
    // Cleanup function para prevenir actualizaciones en componentes desmontados
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío para ejecutar solo al montar

  // Calcular tamaño total de todos los PDFs (para corregir el problema de 0 Bytes)
  const calculateTotalPdfSize = () => {
    if (!pdfs || !Array.isArray(pdfs) || pdfs.length === 0) return 0;
    
    return pdfs.reduce((total, pdf) => {
      // Buscar el tamaño en diferentes propiedades posibles
      const size = pdf.fileSize || pdf.size || 0;
      const numericSize = typeof size === 'number' ? size : Number(size) || 0;
      return total + numericSize;
    }, 0);
  };
  
  // Usar el tamaño calculado de los PDFs como valor real
  const actualUsedBytes = calculateTotalPdfSize() || storageInfo?.usedBytes || 0;
  
  // Calcular porcentaje de uso con valores reales
  const limitBytes = (storageInfo?.limitMB || 200) * 1024 * 1024;
  const usagePercentage = Math.min(Math.round((actualUsedBytes / limitBytes) * 100), 100);
  const storageColor = getStorageColor(usagePercentage);

  return (
    <>
      {/* Indicador de almacenamiento */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Almacenamiento de PDFs
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={usagePercentage} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: 'grey.300',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: storageColor,
                  borderRadius: 5,
                }
              }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {usagePercentage}%
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Usado: {formatBytes(actualUsedBytes || 0)}
            </Typography>
            <Tooltip title="Recalcular espacio usado">
              <IconButton 
                size="small" 
                onClick={handleRecalculateStorage} 
                sx={{ ml: 1 }}
                disabled={loading}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color={storageColor}>
            <strong>Disponible: {((limitBytes - actualUsedBytes) / (1024 * 1024)).toFixed(2)} MB</strong> de {storageInfo ? storageInfo.limitMB : 200} MB
          </Typography>
        </Box>
      </Paper>

      {/* Nota: El botón para borrar todos los PDFs se ha movido al componente FileUpload */}

      {/* Diálogo de confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => !loading && setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar todos tus PDFs? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirmDialog(false)} 
            disabled={loading}
            color="primary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteAllPdfs} 
            color="error" 
            variant="contained"
            disabled={loading}
            autoFocus
          >
            {loading ? 'Eliminando...' : 'Eliminar todos'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificación */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <List dense sx={{ mt: 2, maxHeight: '60vh', overflow: 'auto' }}>
      {pdfs.map((pdf) => {
        const labelId = `checkbox-list-label-${pdf.id}`;
        const isSelected = selectedPdfs.includes(pdf.id);

        return (
          <ListItem 
            key={pdf.id}
            sx={{ 
              mb: 1,
              borderRadius: 1,
              border: '1px solid',
              borderColor: isSelected ? 'primary.main' : 'grey.200',
              bgcolor: isSelected ? 'primary.light' : 'background.paper',
              '&:hover': {
                bgcolor: isSelected ? 'primary.light' : 'grey.50',
              },
            }}
          >
            <Checkbox
              edge="start"
              checked={isSelected}
              onChange={() => togglePdfSelection(pdf.id)}
              inputProps={{ 'aria-labelledby': labelId }}
              sx={{ color: isSelected ? 'white' : 'inherit' }}
            />
            <ListItemText
              id={labelId}
              primary={
                <Typography 
                  variant="body1" 
                  component="div" 
                  noWrap
                  sx={{ 
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? 'white' : 'text.primary',
                  }}
                >
                  {pdf.originalName}
                </Typography>
              }
              secondary={
                <Typography component="div" variant="body2">
                  <Box sx={{ mt: 0.5 }}>
                    <Chip 
                      label={`${pdf.pageCount} páginas`} 
                      size="small" 
                      sx={{ 
                        mr: 0.5, 
                        bgcolor: isSelected ? 'primary.dark' : 'grey.100',
                        color: isSelected ? 'white' : 'text.secondary',
                      }} 
                    />
                    {pdf.vectorized && (
                      <Chip 
                        label="Vectorizado" 
                        size="small" 
                        sx={{ 
                          bgcolor: isSelected ? 'success.dark' : 'success.light',
                          color: isSelected ? 'white' : 'text.secondary',
                        }} 
                      />
                    )}
                  </Box>
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Información">
                <IconButton edge="end" aria-label="info" sx={{ mr: 1 }}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={() => deletePdf(pdf.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  </>  
  );
};

export default PdfList;
