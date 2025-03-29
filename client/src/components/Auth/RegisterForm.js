import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Divider,
  Avatar,
  InputAdornment
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SimpleCaptcha from './SimpleCaptcha';
import CountrySelector from './CountrySelector';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCountryChange = (value) => {
    setFormData({
      ...formData,
      country: value
    });
  };

  const handleCaptchaValidation = (isValid) => {
    setCaptchaValid(isValid);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    if (!captchaValid) {
      setFormError('Por favor, complete el captcha correctamente');
      return false;
    }

    if (!formData.country) {
      setFormError('Por favor, seleccione un país');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const { firstName, lastName, email, password, city, country } = formData;
      const response = await register({
        firstName,
        lastName,
        email,
        password,
        city,
        country
      });

      if (response.success) {
        setSuccess(true);
        // Redirect or show success message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setFormError(response.message);
      }
    } catch (error) {
      setFormError('Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: { xs: 2.5, sm: 3.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          maxWidth: 700,
          mx: 'auto',
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 48,
              height: 48,
              mb: 1,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom fontWeight="bold" color="primary.main">
            Crear cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={2}>
            Completa tus datos para registrarte en (U)Boost
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              ¡Registro exitoso! Tu cuenta está pendiente de aprobación por un administrador.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  helperText="La contraseña debe tener al menos 6 caracteres"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  id="city"
                  label="Ciudad"
                  name="city"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationCityIcon color="primary" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CountrySelector
                  value={formData.country}
                  onChange={handleCountryChange}
                  required
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Seguridad
              </Typography>
            </Divider>

            <SimpleCaptcha onValidate={handleCaptchaValidation} />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={submitting || success || !captchaValid}
              sx={{ 
                mt: 2, 
                mb: 2, 
                py: 1, 
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Registrarse'}
            </Button>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2 
            }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  color="primary.main" 
                  sx={{ 
                    fontWeight: 500,
                    '&:hover': { 
                      textDecoration: 'underline' 
                    } 
                  }}
                >
                  ¿Ya tienes cuenta? Iniciar sesión
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterForm;
