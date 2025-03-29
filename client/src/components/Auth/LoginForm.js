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
  CircularProgress,
  Divider,
  Avatar,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SimpleCaptcha from './SimpleCaptcha';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [captchaValid, setCaptchaValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaValidation = (isValid) => {
    setCaptchaValid(isValid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!captchaValid) {
      setFormError('Por favor, complete el captcha correctamente');
      return;
    }
    
    setSubmitting(true);

    try {
      const { email, password } = formData;
      const response = await login(email, password);

      if (response.success) {
        // Redirigir explícitamente al contenido principal del SaaS
        window.location.href = '/'; // Usamos window.location para forzar recarga completa
      } else {
        setFormError(response.message);
      }
    } catch (error) {
      setFormError('Login failed. Please try again.');
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom fontWeight="bold" color="primary.main">
            Bienvenido
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={2}>
            Accede a tu cuenta de (U)Boost
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {formError}
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
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
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
              disabled={submitting || !captchaValid}
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
              {submitting ? <CircularProgress size={24} /> : 'Iniciar sesión'}
            </Button>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: 2,
              mt: 2 
            }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
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
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Link>
              
              <Link to="/register" style={{ textDecoration: 'none' }}>
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
                  ¿No tienes cuenta? Regístrate
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginForm;
