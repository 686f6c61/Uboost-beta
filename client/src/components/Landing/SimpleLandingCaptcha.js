import React, { useState, useEffect, useRef } from 'react';

/**
 * Componente de CAPTCHA simple sin servicios externos ni dependencias de MUI
 * Diseñado para integrarse con el estilo de la landing page
 */
const SimpleLandingCaptcha = ({ onValidation }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const canvasRef = useRef(null);
  
  // Colores para el texto
  const colors = ['#1e88e5', '#ff8f00', '#43a047', '#e53935'];

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
    
    // Dibujar el CAPTCHA en el canvas
    setTimeout(() => {
      if (canvasRef.current) {
        drawCaptcha(result);
      }
    }, 50);
  };

  // Dibuja el texto en el canvas con efecto distorsionado
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fondo
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Líneas aleatorias para dificultar la lectura automática
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Configurar el texto
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Dibujar cada letra con diferentes características
    const textWidth = canvas.width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      
      // Color aleatorio
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      
      // Tamaño y rotación aleatoria
      ctx.font = `${Math.floor(20 + Math.random() * 10)}px Arial, sans-serif`;
      ctx.save();
      
      // Posición de cada letra (distribuida en el canvas)
      const x = textWidth * (i + 1);
      const y = canvas.height / 2 + Math.random() * 6 - 3;
      
      // Rotación
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      
      // Dibujar letra
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  // Validar la entrada del usuario
  const validateCaptcha = () => {
    const isMatch = userInput.toUpperCase() === captchaText;
    setIsValid(isMatch);
    
    // Notificar al componente padre
    if (onValidation) {
      onValidation(isMatch);
    }
    
    // Si no es válido, generar uno nuevo
    if (!isMatch) {
      generateCaptcha();
    }
  };

  // Generar CAPTCHA al montar el componente
  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <div className="captcha-container">
      <div className="captcha-wrapper">
        <canvas 
          ref={canvasRef} 
          width="200" 
          height="70"
          className="captcha-canvas"
        />
        <button 
          type="button" 
          onClick={generateCaptcha}
          className="refresh-captcha"
          aria-label="Refrescar captcha"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      
      <div className="captcha-input-group">
        <input
          type="text"
          placeholder="Escribe el código que ves arriba"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={`captcha-input ${isValid ? 'valid' : ''}`}
          maxLength={5}
        />
        <button 
          type="button" 
          onClick={validateCaptcha}
          className="validate-btn"
        >
          Verificar
        </button>
      </div>
      
      {isValid && (
        <div className="captcha-valid-message">
          <i className="fas fa-check-circle"></i> Verificación correcta
        </div>
      )}
    </div>
  );
};

export default SimpleLandingCaptcha;
