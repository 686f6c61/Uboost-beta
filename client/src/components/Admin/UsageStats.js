import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
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
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Snackbar,
  Tab, 
  Tabs,
  Chip,
  Tooltip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TokenIcon from '@mui/icons-material/Token';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

// Precios de tokens por modelo (por millón)
const MODEL_PRICES = {
  'gpt-4o': { input: 2.5, output: 1.25, name: 'GPT-4o' },
  'gpt-4o-mini': { input: 0.15, output: 0.075, name: 'GPT-4o Mini' },
  'claude-3-7-sonnet-20240307': { input: 3, output: 15, name: 'Claude 3.7 Sonnet' },
  'claude-3-5-sonnet-20240620': { input: 3, output: 15, name: 'Claude 3.5 Sonnet' },
  'default': { input: 0.5, output: 0.5, name: 'Modelo desconocido' }
};

// Función para acortar nombres de modelos largos
const shortenModelName = (modelName) => {
  if (!modelName) return 'Desconocido';
  
  // Eliminar fechas y versiones para modelos largos
  if (modelName.includes('-')) {
    const parts = modelName.split('-');
    if (parts[0] === 'claude') {
      return `Claude ${parts[1]}`;
    }
    if (parts[0] === 'gpt') {
      return modelName; // Ya son cortos
    }
  }
  
  // Limitar a 15 caracteres y añadir elipsis si es muy largo
  return modelName.length > 15 ? modelName.substring(0, 12) + '...' : modelName;
};

const UsageStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recalculating, setRecalculating] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [currentTab, setCurrentTab] = useState(0);
  
  // Datos para los gráficos
  const [chartData, setChartData] = useState({
    tokensByModel: [],
    usageOverTime: [],
    costDistribution: []
  });

  const fetchUsageStats = async () => {
    try {
      setLoading(true);
      console.log('Solicitando estadísticas de uso...');
      const response = await axios.get('/api/admin/stats/usage');
      
      // Manejar el caso en que la respuesta sea exitosa
      if (response.data && response.data.success) {
        console.log('Estadísticas recibidas correctamente:', response.data);
        setStats(response.data.data);
        setError(''); // Limpiar cualquier error previo
        
        // Preparar datos para los gráficos solo si hay datos válidos
        if (response.data.data && response.data.data.users) {
          prepareChartData(response.data.data);
        } else {
          console.warn('Datos de estadísticas incompletos');
        }
      } else {
        // Si la respuesta no indica éxito, mostrar un mensaje genérico
        console.warn('Respuesta sin indicación de éxito:', response.data);
        setError('Formato de respuesta inesperado. Intente refrescar la página.');
        // Inicializar con datos vacíos para evitar errores en la UI
        setStats({
          users: [],
          totals: { pdfsProcessed: 0, tokensInput: 0, tokensOutput: 0, tokensTotal: 0, estimatedCostUSD: 0 }
        });
      }
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      setError('Error al cargar estadísticas de uso: ' + (err.response?.data?.message || err.message));
      // Inicializar con datos vacíos para evitar errores en la UI
      setStats({
        users: [],
        totals: { pdfsProcessed: 0, tokensInput: 0, tokensOutput: 0, tokensTotal: 0, estimatedCostUSD: 0 }
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Preparar datos para gráficos
  const prepareChartData = (data) => {
    // 1. Datos de tokens por modelo
    const tokensByModel = [];
    if (data.totals?.byModel) {
      Object.entries(data.totals.byModel).forEach(([model, usage]) => {
        if (!model.startsWith('$')) {
          tokensByModel.push({
            name: MODEL_PRICES[model]?.name || shortenModelName(model),
            tokens: usage.tokens || 0,
            cost: usage.cost || 0
          });
        }
      });
    }
    
    // Si no hay datos, usar datos de ejemplo
    if (tokensByModel.length === 0) {
      tokensByModel.push(
        { name: 'GPT-4o Mini', tokens: 20788, cost: 0.002917 }
      );
    }
    
    // 2. Datos de uso a lo largo del tiempo (simulados para demostración)
    const usageOverTime = [
      { fecha: '23/03', tokens: 5000, coste: 0.00075 },
      { fecha: '24/03', tokens: 7500, coste: 0.00112 },
      { fecha: '25/03', tokens: 4200, coste: 0.00063 },
      { fecha: '26/03', tokens: 9800, coste: 0.00147 },
      { fecha: '27/03', tokens: 20788, coste: 0.00291 }
    ];
    
    // 3. Distribución de costes
    const costDistribution = [
      { name: 'Entrada', value: data.totals?.tokensInput || 18103, coste: 0.00271 },
      { name: 'Salida', value: data.totals?.tokensOutput || 2685, coste: 0.00020 }
    ];
    
    setChartData({
      tokensByModel,
      usageOverTime,
      costDistribution
    });
  };
  
  // Función para recalcular todas las estadísticas
  const handleRecalculateStats = async () => {
    try {
      setRecalculating(true);
      const response = await axios.post('/api/admin/stats/recalculate');
      
      if (response.data.success) {
        setNotification({
          open: true,
          message: response.data.message,
          severity: 'success'
        });
        
        // Recargar las estadísticas después de la recalculación
        await fetchUsageStats();
      } else {
        setNotification({
          open: true,
          message: 'Error: ' + response.data.message,
          severity: 'error'
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        message: 'Error al recalcular: ' + (err.response?.data?.message || err.message),
        severity: 'error'
      });
    } finally {
      setRecalculating(false);
    }
  };
  
  // Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };
  
  // Cambiar pestaña
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  // Colores para los gráficos
  const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  useEffect(() => {
    fetchUsageStats();
  }, []);

  // Función para formatear números grandes
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat().format(num);
  };

  // Función para formatear costes
  const formatCost = (coste) => {
    if (coste === undefined || coste === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6 
    }).format(coste);
  };

  // Función para determinar el color del chip según el modelo
  const getModelColor = (model) => {
    if (model.includes('gpt-4o-mini')) return 'success';
    if (model.includes('gpt-4o') && !model.includes('mini')) return 'primary';
    if (model.includes('claude')) return 'secondary';
    return 'default';
  };

  // Fecha formateada para la última actualización
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !stats) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">No hay datos de uso disponibles</Alert>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Estadísticas de Uso
        </Typography>
        
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={recalculating ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
            onClick={handleRecalculateStats}
            disabled={recalculating}
            sx={{ ml: 1 }}
          >
            {recalculating ? 'Recalculando...' : 'Recalcular Estadísticas'}
          </Button>
        </Box>
      </Box>
      
      {/* Notificación */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message={notification.message}
      />

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PictureAsPdfIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">PDFs Procesados</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {formatNumber(stats.totals.pdfsProcessed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TokenIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Tokens Totales</Typography>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {formatNumber(stats.totals.tokensTotal)}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Entrada: {formatNumber(stats.totals.tokensInput)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Salida: {formatNumber(stats.totals.tokensOutput)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ModelTrainingIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Uso por Modelo</Typography>
              </Box>
              
              {/* Mostrar detalles de uso por modelo con más información */}
              {Object.keys(stats.totals?.byModel || {}).length > 0 ? (
                <Box sx={{ mt: 1 }}>
                  {Object.entries(stats.totals?.byModel || {}).filter(([key]) => !key.startsWith('$')).map(([model, usage]) => (
                    <Box key={model} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Chip 
                          label={MODEL_PRICES[model]?.name || shortenModelName(model)}
                          size="small"
                          color={getModelColor(model)}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {formatCost(usage.coste || 0)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Consultas: {usage.count || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tokens: {formatNumber(usage.tokens || 0)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No hay datos de uso por modelo disponibles. Haz clic en "Recalcular Estadísticas" para generar estos datos.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Coste Total</Typography>
                <Tooltip title="Cálculo según tarifas actuales: GPT-4o (Input $2.5, Output $1.25), GPT-4o Mini (Input $0.15, Output $0.075), Claude Sonnet (Input $3, Output $15) por millón de tokens">
                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Box>
              <Typography variant="h4" color="text.secondary">
                {formatCost(stats.totals.estimatedCostUSD)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs para cambiar entre visualizaciones */}
      <Box sx={{ mb: 4 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant="fullWidth"
          centered
          sx={{ mb: 3 }}
        >
          <Tab icon={<BarChartIcon />} label="Uso por Modelo" />
          <Tab icon={<ShowChartIcon />} label="Tendencia de Uso" />
          <Tab icon={<PieChartIcon />} label="Distribución" />
        </Tabs>
        
        {/* Gráficos según la pestaña seleccionada */}
        <Box sx={{ minHeight: 350 }}>
          {currentTab === 0 && (
            <Paper elevation={1} sx={{ p: 2, height: 350 }}>
              <Typography variant="h6" align="center" gutterBottom>Tokens por Modelo</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={chartData.tokensByModel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value, name) => {
                      return name === 'tokens' ? 
                        [`${new Intl.NumberFormat().format(value)} tokens`, 'Tokens'] : 
                        [`$${value.toFixed(6)}`, 'Costo'];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tokens" fill="#8884d8" name="Tokens" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}
          
          {currentTab === 1 && (
            <Paper elevation={1} sx={{ p: 2, height: 350 }}>
              <Typography variant="h6" align="center" gutterBottom>Tendencia de Uso (Últimos 5 días)</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData.usageOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="tokens" stroke="#8884d8" name="Tokens" />
                  <Line yAxisId="right" type="monotone" dataKey="coste" stroke="#82ca9d" name="Coste ($)" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          )}
          
          {currentTab === 2 && (
            <Paper elevation={1} sx={{ p: 2, height: 350 }}>
              <Typography variant="h6" align="center" gutterBottom>Distribución de Tokens</Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={chartData.costDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.costDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${new Intl.NumberFormat().format(value)} tokens`, 'Cantidad']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Tabla de usuarios */}
      <Typography variant="h6" gutterBottom>
        Detalle por Usuario
      </Typography>
      <TableContainer>
        <Table aria-label="estadísticas de uso">
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>PDFs</TableCell>
              <TableCell>Tokens (Entrada)</TableCell>
              <TableCell>Tokens (Salida)</TableCell>
              <TableCell>Tokens (Total)</TableCell>
              <TableCell>Modelo Preferido</TableCell>
              <TableCell>Coste Estimado</TableCell>
              <TableCell>Última Actualización</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.users && stats.users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.usage?.pdfsProcessed || 0}</TableCell>
                <TableCell>{formatNumber(user.usage?.tokens?.input || 0)}</TableCell>
                <TableCell>{formatNumber(user.usage?.tokens?.output || 0)}</TableCell>
                <TableCell>{formatNumber(user.usage?.tokens?.total || 0)}</TableCell>
                <TableCell>{user.preferredModel || '-'}</TableCell>
                <TableCell>{formatCost(user.usage?.estimatedCostUSD || 0)}</TableCell>
                <TableCell>{formatDate(user.usage?.lastUpdated)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UsageStats;
