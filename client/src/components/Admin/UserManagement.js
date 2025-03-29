import React, { useState, useEffect } from 'react';
import apiClient from '../../contexts/pdf/api/client';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import KeyIcon from '@mui/icons-material/Key';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useAuth } from '../../contexts/AuthContext';
import ApiKeyManagement from './ApiKeyManagement';
import UsageStats from './UsageStats';
import UserActivity from './UserActivity';

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: '',
    role: '',
    status: '',
    storageLimit: 200 // Límite de almacenamiento en MB
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError('Failed to load users. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      city: user.city || '',
      country: user.country || '',
      role: user.role || 'user',
      status: user.status || 'pending',
      storageLimit: user.storage?.limitMB || 200
    });
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateUser = async () => {
    try {
      // Preparar datos con el límite de almacenamiento
      const updatedData = {
        ...formData,
        storage: {
          limitMB: parseInt(formData.storageLimit) || 200,
        }
      };
      
      const response = await apiClient.put(`/api/admin/users/${selectedUser._id}`, updatedData);
      if (response.data.success) {
        // Update user in the list
        setUsers(users.map(user => user._id === selectedUser._id ? response.data.data : user));
        setSuccessMessage('Usuario actualizado correctamente');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleDialogClose();
      }
    } catch (err) {
      setError('Error al actualizar usuario: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}/approve`);
      if (response.data.success) {
        // Update user in the list
        setUsers(users.map(user => user._id === userId ? response.data.data : user));
        setSuccessMessage('User approved successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to approve user. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePauseUser = async (userId) => {
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}/pause`);
      if (response.data.success) {
        // Update user in the list
        setUsers(users.map(user => user._id === userId ? response.data.data : user));
        setSuccessMessage('User paused successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to pause user. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await apiClient.put(`/api/admin/users/${userId}/delete`);
      if (response.data.success) {
        // Update user in the list
        setUsers(users.map(user => user._id === userId ? response.data.data : user));
        setSuccessMessage('User deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete user. ' + (err.response?.data?.message || err.message));
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'paused':
        return <Chip label="Paused" color="error" size="small" />;
      case 'deleted':
        return <Chip label="Deleted" sx={{ bgcolor: 'grey.500', color: 'white' }} size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };
  
  const renderStatus = getStatusChip;
  
  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      city: user.city || '',
      country: user.country || '',
      role: user.role || '',
      status: user.status || '',
      storageLimit: user.storage?.limitMB || 200
    });
    setEditDialogOpen(true);
  };
  
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">You don't have permission to access this page</Alert>
      </Container>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Panel de (U)Boost
          </Typography>
          {activeTab === 0 && (
            <Button variant="outlined" onClick={fetchUsers}>
              Actualizar
            </Button>
          )}
        </Box>
        
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab icon={<PeopleIcon />} label="Gestión de Usuarios" />
          <Tab icon={<KeyIcon />} label="API Keys" />
          <Tab icon={<AssessmentIcon />} label="Estadísticas de Uso" />
          <Tab icon={<TimelineIcon />} label="Actividad de Usuarios" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        {activeTab === 0 && (
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Alert severity="info">No se encontraron usuarios</Alert>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="users table">
                <TableHead>
                  <TableRow>
                    <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Location</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Role</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        bgcolor: user.status === 'deleted' ? 'grey.100' : 'inherit'
                      }}
                    >
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.city}, {user.country}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusChip(user.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Editar">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEditOpen(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          
                          {user.status === 'pending' && (
                            <Tooltip title="Aprobar">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveUser(user._id)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {user.status === 'approved' && (
                            <Tooltip title="Pausar">
                              <IconButton
                                size="small"
                                color="warning"
                                onClick={() => handlePauseUser(user._id)}
                              >
                                <PauseCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {user.status === 'paused' && (
                            <Tooltip title="Aprobar">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveUser(user._id)}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {user.status !== 'deleted' && (
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}
        
        {activeTab === 1 && (
          <ApiKeyManagement />
        )}
        
        {activeTab === 2 && (
          <UsageStats />
        )}
        
        {activeTab === 3 && (
          <UserActivity />
        )}
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="deleted">Deleted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="storageLimit"
                label="Storage Limit (MB)"
                type="number"
                InputProps={{
                  endAdornment: <Typography variant="caption" color="textSecondary">MB</Typography>,
                  inputProps: { min: 1, step: 1 }
                }}
                value={formData.storageLimit}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Límite de almacenamiento de PDF por usuario"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
