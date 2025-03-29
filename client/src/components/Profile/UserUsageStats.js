import React, { useState, useEffect } from 'react';
import apiClient from '../../contexts/pdf/api/client';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TokenIcon from '@mui/icons-material/Token';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../../contexts/AuthContext';

const UserUsageStats = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // Esta ruta debe ser implementada en el backend para obtener solo las estadísticas del usuario actual
      const response = await apiClient.get('/api/users/me/stats');
      if (response.data.success) {
        setStats(response.data.data.usage);
      }
    } catch (err) {
      setError('Error al cargar estadísticas de uso: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserStats();
    }
  }, [currentUser]);

  // Función para formatear números grandes
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat().format(num);
  };

  // Función para formatear costos
  const formatCost = (cost) => {
    if (cost === undefined || cost === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4 
    }).format(cost);
  };

  // Fecha formateada para la última actualización
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">No hay datos de uso disponibles</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Mi uso de la plataforma
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Última actualización: {formatDate(stats.lastUpdated)}
      </Typography>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PictureAsPdfIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">PDFs Procesados</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {formatNumber(stats.pdfsProcessed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TokenIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Tokens Utilizados</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {formatNumber(stats.tokens?.total || 0)}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Entrada: {formatNumber(stats.tokens?.input || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salida: {formatNumber(stats.tokens?.output || 0)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Coste Estimado</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {formatCost(stats.estimatedCostUSD)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="body2" color="text.secondary">
        Estos datos son estimaciones basadas en el uso actual. Los costes pueden variar según los modelos utilizados.
      </Typography>
    </Paper>
  );
};

export default UserUsageStats;
