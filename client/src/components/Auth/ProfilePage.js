import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import UserUsageStats from '../Profile/UserUsageStats';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        city: currentUser.city || '',
        country: currentUser.country || ''
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSubmitting(true);

    try {
      const response = await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.city,
        country: formData.country
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Update failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              p: 1,
              mr: 2
            }}
          >
            <PersonIcon />
          </Box>
          <Typography component="h1" variant="h5">
            My Profile
          </Typography>
        </Box>

        <Box sx={{ width: '100%', mb: 3 }}>
          <Divider />
        </Box>

        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Account Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Status:</strong>{' '}
                <span
                  style={{
                    color:
                      currentUser.status === 'approved'
                        ? 'green'
                        : currentUser.status === 'pending'
                        ? 'orange'
                        : 'red'
                  }}
                >
                  {currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Role:</strong>{' '}
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong> {currentUser.email}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ width: '100%', mb: 3, mt: 2 }}>
          <Divider />
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Edit Profile Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="country"
                label="Country"
                name="country"
                autoComplete="country-name"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.2 }}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </Box>
      </Paper>

      {/* Componente de estadísticas de uso */}
      <UserUsageStats />
    </Container>
  );
};

export default ProfilePage;
