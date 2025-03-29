import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Componente de CAPTCHA simple sin servicios externos
 * Versión simplificada para facilitar su uso
 */
const SimpleCaptcha = ({ onValidate }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const canvasRef = useRef(null);
  
  // Colores para el texto
  const colors = ['#0033cc', '#006633', '#990000'];

  // Genera un nuevo texto CAPTCHA
  const generateCaptcha = () => {
    // Caracteres que usaremos (sin caracteres ambiguos como 0/O, 1/l/I)
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let result = '';
    // Longitud fija de 5 caracteres
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setUserInput('');
    setIsValid(false);
    setCaptchaText(result);
    
    // Notificar que el CAPTCHA ha cambiado
    if (onValidate) onValidate(false);
  };

  // Dibuja el CAPTCHA en el canvas
  const drawCaptcha = () => {
    if (!canvasRef.current || !captchaText) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpia el canvas
    ctx.clearRect(0, 0, width, height);
    
    // Fondo claro
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, width, height);
    
    // Añade solo 2-3 líneas de ruido leve
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Configura estilo para el texto
    ctx.textBaseline = 'middle';
    ctx.font = '18px Arial';
    
    // Dibuja el texto centrado y legible
    const textWidth = ctx.measureText(captchaText).width;
    const startX = (width - textWidth) / 2;
    
    // Dibuja cada carácter con un poco de espacio
    for (let i = 0; i < captchaText.length; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(
        captchaText[i], 
        startX + i * (textWidth/captchaText.length), 
        height/2
      );
    }
  };

  // Maneja el cambio en el input
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);
    
    // Validar la entrada
    const valid = value === captchaText;
    setIsValid(valid);
    
    // Notificar al componente padre
    if (onValidate) {
      onValidate(valid);
    }
  };

  // Inicializa el CAPTCHA al montar el componente
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Redibuja el CAPTCHA cuando cambia el texto
  useEffect(() => {
    drawCaptcha();
  }, [captchaText]);

  return (
    <Box sx={{ mb: 1.5, width: '100%' }}>
      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'text.secondary' }}>
        Introduce el código de seguridad:
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={150} 
          height={40} 
          style={{ 
            border: '1px solid #ddd', 
            borderRadius: 4,
            width: '70%',
            marginBottom: 6
          }}
        />
        
        <Button 
          size="small" 
          sx={{ 
            position: 'absolute', 
            right: 0, 
            top: 0, 
            minWidth: 'auto', 
            p: 0.5 
          }}
          onClick={generateCaptcha}
        >
          <RefreshIcon fontSize="small" />
        </Button>
      </Box>
      
      <TextField
        variant="outlined"
        margin="dense"
        required
        size="small"
        fullWidth
        id="captcha"
        label="Código de seguridad"
        name="captcha"
        value={userInput}
        onChange={handleInputChange}
        error={userInput.length > 0 && !isValid && userInput.length >= captchaText.length}
        helperText={userInput.length > 0 && !isValid && userInput.length >= captchaText.length ? "Código incorrecto" : ""}
        sx={{ mt: 0.5 }}
        inputProps={{
          style: { textTransform: 'uppercase' }
        }}
      />
    </Box>
  );
};

export default SimpleCaptcha;
