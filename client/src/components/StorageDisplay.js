import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

// Función para formatear bytes a una unidad legible
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes <= 0) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Componente que muestra información del almacenamiento de PDFs
 */
const StorageDisplay = () => {
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState({
    usedBytes: 0,
    limitMB: 200,
    pdfs: []
  });

  // Cargar información de almacenamiento al montar el componente
  useEffect(() => {
    fetchStorageInfo();
  }, []);

  // Función para obtener la información de almacenamiento
  const fetchStorageInfo = async () => {
    try {
      setLoading(true);
      
      // Obtener PDFs del servidor
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/pdf/list`, { headers });
      
      if (response.data && response.data.success) {
        const pdfs = response.data.data || [];
        
        // Calcular el tamaño total usado
        const totalSize = pdfs.reduce((acc, pdf) => {
          const size = pdf.size || pdf.fileSize || pdf.contentLength || 0;
          return acc + (typeof size === 'number' ? size : Number(size) || 0);
        }, 0);
        
        setStorageInfo({
          usedBytes: totalSize,
          limitMB: 200, // Límite fijo de 200MB
          pdfs
        });
      }
    } catch (error) {
      console.error('Error al obtener información de almacenamiento:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular porcentaje de uso
  const limitBytes = storageInfo.limitMB * 1024 * 1024;
  const usagePercentage = Math.min(Math.round((storageInfo.usedBytes / limitBytes) * 100), 100);
  
  // Determinar color de la barra de progreso según el uso
  let storageColor = 'success.main';
  if (usagePercentage > 85) storageColor = 'error.main';
  else if (usagePercentage > 65) storageColor = 'warning.main';

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
        Almacenamiento de PDFs
      </Typography>
      
      {/* Barra de progreso */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={usagePercentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'grey.200',
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
      
      {/* Información detallada */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
            Usado: <Box component="span" sx={{ color: 'text.primary' }}>{formatBytes(storageInfo.usedBytes)}</Box>
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="span" sx={{ mr: 0.5 }}>Disponible:</Box>
            <Box component="span" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              {((limitBytes - storageInfo.usedBytes) / (1024 * 1024)).toFixed(2)} MB de {storageInfo.limitMB} MB
            </Box>
            <Tooltip title="Recalcular espacio">
              <IconButton 
                size="small" 
                sx={{ ml: 0.5 }} 
                onClick={fetchStorageInfo}
                disabled={loading}
              >
                {loading ? <CircularProgress size={16} /> : <RefreshIcon sx={{ fontSize: 16 }} />}
              </IconButton>
            </Tooltip>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StorageDisplay;
