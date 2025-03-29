import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  CircularProgress,
  Divider,
  Avatar,
  InputAdornment
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import EmailIcon from '@mui/icons-material/Email';
import apiClient from '../../contexts/pdf/api/client';
import SimpleCaptcha from './SimpleCaptcha';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);

  const handleCaptchaValidation = (isValid) => {
    setCaptchaValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!email) {
      setFormError('Por favor, introduce tu dirección de correo electrónico');
      return;
    }

    if (!captchaValid) {
      setFormError('Por favor, completa el captcha correctamente');
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await apiClient.post('/api/auth/forgot-password', { email });

      if (response.data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setFormError(response.data.message || 'Error al procesar la solicitud');
      }
    } catch (error) {
      setFormError(
        error.response?.data?.message || 
        'No se pudo procesar la solicitud. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={4}
        sx={{
          mt: 8,
          p: { xs: 2.5, sm: 3.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 3,
          maxWidth: 360,
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
            <LockResetIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom fontWeight="bold" color="primary.main">
            Recuperar contraseña
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={2}>
            Te enviaremos un enlace para restablecer tu contraseña
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              Se ha enviado un correo electrónico con instrucciones para recuperar tu contraseña. Por favor, revisa tu bandeja de entrada.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={success}
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            
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
              {submitting ? <CircularProgress size={24} /> : 'Enviar instrucciones'}
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
                  ¿Recordaste tu contraseña? Iniciar sesión
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordForm;
