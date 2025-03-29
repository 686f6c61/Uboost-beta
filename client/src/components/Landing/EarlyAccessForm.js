import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SimpleCaptcha from '../Auth/SimpleCaptcha';

// Lista de países para autocompletado
const countries = [
  "Afganistán", "Albania", "Alemania", "Andorra", "Angola", "Antigua y Barbuda", "Arabia Saudita", "Argelia", "Argentina", "Armenia", "Australia", "Austria", "Azerbaiyán",
  "Bahamas", "Bangladés", "Barbados", "Baréin", "Bélgica", "Belice", "Benín", "Bielorrusia", "Birmania", "Bolivia", "Bosnia y Herzegovina", "Botsuana", "Brasil", "Brunéi", "Bulgaria", "Burkina Faso", "Burundi",
  "Bután", "Cabo Verde", "Camboya", "Camerún", "Canadá", "Catar", "Chad", "Chile", "China", "Chipre", "Ciudad del Vaticano", "Colombia", "Comoras", "Corea del Norte", "Corea del Sur", "Costa de Marfil", "Costa Rica", "Croacia", "Cuba",
  "Dinamarca", "Dominica", "Ecuador", "Egipto", "El Salvador", "Emiratos Árabes Unidos", "Eritrea", "Eslovaquia", "Eslovenia", "España", "Estados Unidos", "Estonia", "Etiopía",
  "Filipinas", "Finlandia", "Fiyi", "Francia",
  "Gabón", "Gambia", "Georgia", "Ghana", "Granada", "Grecia", "Guatemala", "Guyana", "Guinea", "Guinea ecuatorial", "Guinea-Bisáu", "Haití", "Honduras", "Hungría",
  "India", "Indonesia", "Irak", "Irán", "Irlanda", "Islandia", "Islas Marshall", "Islas Salomón", "Israel", "Italia",
  "Jamaica", "Japón", "Jordania",
  "Kazajistán", "Kenia", "Kirguistán", "Kiribati", "Kuwait",
  "Laos", "Lesoto", "Letonia", "Líbano", "Liberia", "Libia", "Liechtenstein", "Lituania", "Luxemburgo",
  "Macedonia del Norte", "Madagascar", "Malasia", "Malaui", "Maldivas", "Malí", "Malta", "Marruecos", "Mauricio", "Mauritania", "México", "Micronesia", "Moldavia", "Mónaco", "Mongolia", "Montenegro", "Mozambique",
  "Namibia", "Nauru", "Nepal", "Nicaragua", "Níger", "Nigeria", "Noruega", "Nueva Zelanda",
  "Omán",
  "Países Bajos", "Pakistán", "Palaos", "Panamá", "Papúa Nueva Guinea", "Paraguay", "Perú", "Polonia", "Portugal",
  "Reino Unido", "República Centroafricana", "República Checa", "República del Congo", "República Democrática del Congo", "República Dominicana", "Ruanda", "Rumanía", "Rusia",
  "Samoa", "San Cristóbal y Nieves", "San Marino", "San Vicente y las Granadinas", "Santa Lucía", "Santo Tomé y Príncipe", "Senegal", "Serbia", "Seychelles", "Sierra Leona", "Singapur", "Siria", "Somalia", "Sri Lanka", "Suazilandia", "Sudáfrica", "Sudán", "Sudán del Sur", "Suecia", "Suiza", "Surinam",
  "Tailandia", "Tanzania", "Tayikistán", "Timor Oriental", "Togo", "Tonga", "Trinidad y Tobago", "Túnez", "Turkmenistán", "Turquía", "Tuvalu",
  "Ucrania", "Uganda", "Uruguay", "Uzbekistán",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen", "Yibuti",
  "Zambia", "Zimbabue"
];

/**
 * Componente de formulario para solicitar Early Access
 */
const EarlyAccessForm = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    university: '',
    country: '',
    email: '',
    purpose: ''
  });
  
  // Estados para control del formulario
  const [captchaValid, setCaptchaValid] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null,
    stats: null
  });
  
  // Verificar si el usuario ha comenzado a escribir en el formulario
  useEffect(() => {
    const hasStartedFilling = Object.values(formData).some(value => value.trim() !== '');
    if (hasStartedFilling && !showCaptcha) {
      setShowCaptcha(true);
    }
  }, [formData, showCaptcha]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id.replace('ea-', '')]: value
    });
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.purpose) {
      return false;
    }
    if (!captchaValid) {
      return false;
    }
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setFormStatus({
        loading: false,
        success: false,
        error: 'Por favor completa todos los campos y verifica el captcha'
      });
      return;
    }

    setFormStatus({
      loading: true,
      success: false,
      error: null
    });

    try {
      // Enviar la solicitud al backend
      const response = await axios.post('http://localhost:5100/api/landing/early-access', formData);
      
      if (response.data.success) {
        setFormStatus({
          loading: false,
          success: true,
          error: null,
          stats: response.data.stats
        });
        
        // Limpiar el formulario después del éxito
        setFormData({
          name: '',
          university: '',
          country: '',
          email: '',
          purpose: ''
        });
      } else {
        setFormStatus({
          loading: false,
          success: false,
          error: response.data.message || 'Error al procesar tu solicitud'
        });
      }
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Error al conectar con el servidor'
      });
    }
  };

  // Si la solicitud fue exitosa, mostrar mensaje de confirmación
  if (formStatus.success) {
    // Obtener las estadísticas de la respuesta
    const stats = formStatus.stats || { totalSpots: 50, remainingSpots: 23, percentOccupied: 60 };
    
    return (
      <div className="early-access-success">
        <i className="fas fa-check-circle success-icon"></i>
        <h3>¡Solicitud enviada correctamente!</h3>
        <p>
          Hemos recibido tu solicitud de Early Access. Revisaremos tu perfil y te notificaremos por correo electrónico 
          cuando tu solicitud sea aprobada.
        </p>
        
        {/* Mostrar estadísticas actualizadas */}
        <div className="updated-stats">
          <h4>Estado actual de plazas:</h4>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${stats.percentOccupied}%` }}></div>
          </div>
          <div className="progress-labels">
            <span className="progress-text">{stats.percentOccupied}% ocupado</span>
            <span className="spots-left">{stats.remainingSpots} plazas restantes</span>
          </div>
        </div>
        
        <p>
          Mientras tanto, revisa tu bandeja de entrada (y carpeta de spam) para confirmar que has recibido nuestro correo de confirmación.
        </p>
      </div>
    );
  }

  return (
    <form id="early-access-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="ea-name">Nombre completo</label>
        <div className="input-icon-wrapper">
          <i className="fas fa-user input-icon"></i>
          <input 
            type="text" 
            id="ea-name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Introduce tu nombre completo"
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ea-university">Universidad o Institución</label>
        <div className="input-icon-wrapper">
          <i className="fas fa-university input-icon"></i>
          <input 
            type="text" 
            id="ea-university" 
            value={formData.university}
            onChange={handleChange}
            placeholder="Universidad o institución"
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ea-country">País</label>
        <div className="input-icon-wrapper">
          <i className="fas fa-globe input-icon"></i>
          <input 
            type="text" 
            id="ea-country" 
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Comienza a escribir tu país"
            list="countries-list"
            required 
          />
          <datalist id="countries-list">
            {countries.map((country, index) => (
              <option key={index} value={country} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ea-email">Correo electrónico</label>
        <div className="input-icon-wrapper">
          <i className="fas fa-envelope input-icon"></i>
          <input 
            type="email" 
            id="ea-email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            required 
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="ea-purpose">¿Para qué quieres usar (U)Boost?</label>
        <div className="input-icon-wrapper textarea-wrapper">
          <i className="fas fa-pencil-alt input-icon textarea-icon"></i>
          <textarea 
            id="ea-purpose" 
            rows="4" 
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Describe brevemente cómo planeas utilizar UBoost en tu investigación..."
            required
          ></textarea>
        </div>
      </div>
      
      {/* Componente CAPTCHA - Solo se muestra cuando el usuario comienza a llenar el formulario */}
      {showCaptcha && (
        <div className="form-group captcha-container">
          <label>Verificación de seguridad</label>
          <SimpleCaptcha onValidate={(isValid) => setCaptchaValid(isValid)} />
        </div>
      )}
      
      {/* Mensaje de error */}
      {formStatus.error && (
        <div className="form-error">
          <p>{formStatus.error}</p>
        </div>
      )}
      
      <button 
        type="submit" 
        className="submit-btn" 
        disabled={formStatus.loading || (showCaptcha && !captchaValid)}
      >
        {formStatus.loading ? 'Enviando...' : 'Solicitar acceso'}
      </button>
    </form>
  );
};

export default EarlyAccessForm;
