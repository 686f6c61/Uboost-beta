import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import apiClient from '../../contexts/pdf/api/client';
import SimpleCaptcha from './SimpleCaptcha';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    token: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const [tokenValidating, setTokenValidating] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // Extraer token y email de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    
    if (token && email) {
      setFormData(prev => ({
        ...prev,
        token,
        email
      }));
      
      // Validar el token
      validateToken(token, email);
    } else {
      setFormError('Enlace de restablecimiento de contraseña inválido. Por favor, solicita un nuevo enlace.');
      setTokenValidating(false);
    }
  }, [location]);

  const validateToken = async (token, email) => {
    try {
      const response = await apiClient.post('/api/auth/verify-reset-token', { 
        token, 
        email 
      });
      
      if (response.data.success) {
        setTokenValidated(true);
      } else {
        setFormError('El enlace de restablecimiento ha expirado o no es válido. Por favor, solicita un nuevo enlace.');
      }
    } catch (error) {
      setFormError('El enlace de restablecimiento ha expirado o no es válido. Por favor, solicita un nuevo enlace.');
    } finally {
      setTokenValidating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaValidation = (isValid) => {
    setCaptchaValid(isValid);
  };

  const validateForm = () => {
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return false;
    }

    // Validar longitud mínima de contraseña
    if (formData.password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar captcha
    if (!captchaValid) {
      setFormError('Por favor, completa el captcha correctamente');
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
      const { token, email, password } = formData;
      const response = await apiClient.post('/api/auth/reset-password', {
        token,
        email,
        password
      });

      if (response.data.success) {
        setSuccess(true);
        // Redireccionar al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setFormError(response.data.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setFormError(
        error.response?.data?.message || 
        'No se pudo restablecer la contraseña. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenValidating) {
    return (
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Verificando enlace de restablecimiento...
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
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
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: '50%',
              p: 1,
              mb: 1
            }}
          >
            <LockResetIcon />
          </Box>
          <Typography component="h1" variant="h5" gutterBottom>
            Restablecer Contraseña
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              ¡Tu contraseña ha sido restablecida con éxito! Serás redirigido a la página de inicio de sesión.
            </Alert>
          )}

          {!tokenValidated && !success && (
            <Box sx={{ mt: 2, width: '100%', textAlign: 'center' }}>
              <Typography variant="body1" color="error">
                Enlace inválido o expirado
              </Typography>
              <Button
                component={Link}
                to="/forgot-password"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Solicitar nuevo enlace
              </Button>
            </Box>
          )}

          {tokenValidated && !success && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                value={formData.email}
                disabled={true}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Nueva Contraseña"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                helperText="La contraseña debe tener al menos 6 caracteres"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Seguridad
                </Typography>
              </Divider>

              <SimpleCaptcha onValidate={handleCaptchaValidation} />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.2 }}
                disabled={submitting || !captchaValid}
              >
                {submitting ? <CircularProgress size={24} /> : 'Cambiar Contraseña'}
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  ¿Recordaste tu contraseña?{' '}
                  <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                    Iniciar Sesión
                  </Link>
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordForm;
