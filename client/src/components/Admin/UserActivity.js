import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Grid,
  Divider
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TokenIcon from '@mui/icons-material/Token';

// Componente para el registro de actividad de usuarios
const UserActivity = () => {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar los logs de actividad
  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      console.log('Solicitando registros de actividad...');
      // Esta API debe implementarse en el backend
      const response = await axios.get('/api/admin/activity-logs');
      
      // Manejar el caso en que la respuesta sea exitosa
      if (response.data && response.data.success) {
        console.log('Registros de actividad recibidos correctamente');
        // Extraer los datos correctamente de la respuesta
        const responseData = response.data.data || {};
        
        // Establecer los logs de actividad solo si existen en la respuesta
        if (responseData.logs) {
          setActivityLogs(responseData);
          setError(''); // Limpiar cualquier error previo
        } else {
          console.warn('No se encontraron logs en la respuesta');
          // Establecer datos vacíos pero estructurados
          setActivityLogs({
            logs: [],
            stats: { totalLogs: 0, uniqueUsers: 0, actions: {} },
            activeUsers: [],
            totalCount: 0
          });
        }
      } else {
        // Si la respuesta no indica éxito, mostrar un mensaje genérico
        console.warn('Respuesta sin indicación de éxito');
        setError('Formato de respuesta inesperado. Intente refrescar la página.');
        // Inicializar con datos vacíos para evitar errores en la UI
        setActivityLogs({
          logs: [],
          stats: { totalLogs: 0, uniqueUsers: 0, actions: {} },
          activeUsers: [],
          totalCount: 0
        });
      }
    } catch (err) {
      console.error('Error obteniendo registros de actividad:', err);
      setError('Error al cargar registros de actividad: ' + (err.response?.data?.message || err.message));
      // Inicializar con datos vacíos para evitar errores en la UI
      setActivityLogs({
        logs: [],
        stats: { totalLogs: 0, uniqueUsers: 0, actions: {} },
        activeUsers: [],
        totalCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
    
    // Actualizar los logs cada 60 segundos
    const interval = setInterval(() => {
      fetchActivityLogs();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calcular duración de sesión
  const calculateSessionDuration = (startTime, endTime) => {
    if (!endTime) return 'Activa';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  // Renderizar estado de actividad
  const renderActivityStatus = (status) => {
    switch(status) {
      case 'active':
        return <Chip label="Activa" color="success" size="small" />;
      case 'inactive':
        return <Chip label="Inactiva" color="default" size="small" />;
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      default:
        return <Chip label={status} color="primary" size="small" />;
    }
  };

  if (loading && activityLogs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && activityLogs.length === 0) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Datos de ejemplo para desarrollo (eliminar en producción)
  const mockData = [
    {
      id: 'log1',
      userId: 'user1',
      userEmail: 'uboost@00b.tech',
      loginTime: new Date(Date.now() - 3600000).toISOString(),
      logoutTime: null,
      ipAddress: '192.168.1.100',
      status: 'active',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      actions: [
        { time: new Date(Date.now() - 3500000).toISOString(), type: 'pdf_processed', details: { count: 1, totalPages: 15 } },
        { time: new Date(Date.now() - 3000000).toISOString(), type: 'query_executed', details: { tokensInput: 1200, tokensOutput: 450, model: 'gpt-4o-mini' } }
      ]
    },
    {
      id: 'log2',
      userId: 'user2',
      userEmail: 'admin@uboost.com',
      loginTime: new Date(Date.now() - 7200000).toISOString(),
      logoutTime: new Date(Date.now() - 5400000).toISOString(),
      ipAddress: '192.168.1.101',
      status: 'inactive',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      actions: [
        { time: new Date(Date.now() - 6900000).toISOString(), type: 'admin_action', details: { action: 'user_approved' } },
        { time: new Date(Date.now() - 6000000).toISOString(), type: 'pdf_processed', details: { count: 2, totalPages: 32 } }
      ]
    }
  ];

  // Usar datos mock si no hay datos reales
  const displayLogs = activityLogs.length > 0 ? activityLogs : mockData;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Registro de Actividad
        </Typography>
        <IconButton onClick={fetchActivityLogs} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Resumen de actividad reciente */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Usuarios Activos</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {displayLogs.filter(log => log.status === 'active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sesiones Hoy</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {displayLogs.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PictureAsPdfIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">PDFs Procesados</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {displayLogs.reduce((total, log) => 
                  total + log.actions.filter(a => a.type === 'pdf_processed')
                    .reduce((t, a) => t + (a.details.count || 0), 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TokenIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Tokens Usados</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {displayLogs.reduce((total, log) => 
                  total + log.actions.filter(a => a.type === 'query_executed')
                    .reduce((t, a) => t + ((a.details.tokensInput || 0) + (a.details.tokensOutput || 0)), 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Tabla de registros de actividad */}
      <TableContainer>
        <Table aria-label="tabla de actividad de usuarios">
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Inicio de Sesión</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Dirección IP</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.userEmail}</TableCell>
                <TableCell>{formatDate(log.loginTime)}</TableCell>
                <TableCell>{calculateSessionDuration(log.loginTime, log.logoutTime)}</TableCell>
                <TableCell>{renderActivityStatus(log.status)}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>
                  <Box>
                    {log.actions.map((action, index) => (
                      <Tooltip 
                        key={index} 
                        title={
                          <div>
                            <Typography variant="body2">{formatDate(action.time)}</Typography>
                            <Typography variant="body2">
                              {action.type === 'pdf_processed' && `Procesados ${action.details.count} PDFs (${action.details.totalPages} páginas)`}
                              {action.type === 'query_executed' && `Consulta: ${action.details.tokensInput} tokens entrada, ${action.details.tokensOutput} tokens salida`}
                              {action.type === 'admin_action' && `Acción admin: ${action.details.action}`}
                            </Typography>
                          </div>
                        }
                      >
                        <Chip 
                          size="small" 
                          label={action.type.replace('_', ' ')} 
                          color={action.type === 'pdf_processed' ? 'info' : action.type === 'query_executed' ? 'success' : 'warning'}
                          sx={{ m: 0.5 }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserActivity;
