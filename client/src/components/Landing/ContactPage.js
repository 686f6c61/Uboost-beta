import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleLandingCaptcha from './SimpleLandingCaptcha';
import axios from 'axios';
import './LandingPage.css';

const ContactPage = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // Estados para control del formulario
  const [captchaValid, setCaptchaValid] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('contact-', '')]: value
    }));
    
    // Mostrar captcha cuando el usuario comienza a escribir
    if (!showCaptcha && value.trim() !== '') {
      setShowCaptcha(true);
    }
  };

  // Validar captcha
  const handleCaptchaValidation = (isValid) => {
    setCaptchaValid(isValid);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captchaValid) {
      setFormStatus({
        submitting: false,
        success: false,
        error: 'Por favor, completa el captcha para enviar el mensaje'
      });
      return;
    }
    
    setFormStatus({ submitting: true, success: false, error: null });
    
    try {
      const response = await axios.post('/api/landing/contact', formData);
      
      if (response.data.success) {
        setFormStatus({
          submitting: false,
          success: true,
          error: null
        });
        
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setCaptchaValid(false);
        setShowCaptcha(false);
      } else {
        throw new Error(response.data.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      setFormStatus({
        submitting: false,
        success: false,
        error: error.response?.data?.message || error.message || 'Error al enviar el mensaje'
      });
    }
  };

  return (
    <div className="landing-container">
      <header>
        <nav>
            <div className="logo">
                <h1 className="white-text"><i className="fas fa-rocket"></i> (U)Boost</h1>
            </div>
            <div className="nav-menu">
                <ul>
                    <li><a href="/landing#caracteristicas"><i className="fas fa-list-ul"></i> Características</a></li>
                    <li><a href="/landing#precios"><i className="fas fa-tags"></i> Precios</a></li>
                    <li><Link to="/contact"><i className="fas fa-envelope"></i> Contacto</Link></li>
                    <li><Link to="/login" className="login-btn"><i className="fas fa-sign-in-alt"></i> Iniciar sesión</Link></li>
                    <li><a href="/landing#early-access" className="register-btn"><i className="fas fa-star"></i> Early Access</a></li>
                </ul>
            </div>
            <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
      </header>

      <main className="contact-content">
        <section className="contact-section">
          <h1><i className="fas fa-paper-plane"></i> Contacto</h1>
          
          <div className="contact-intro">
            <p>¿Tienes preguntas sobre cómo (U)Boost puede potenciar tu investigación? ¿Quieres colaborar con nosotros en el desarrollo de nuevas funcionalidades? ¿O simplemente estás interesado en conocer más sobre nuestra tecnología?</p>
            <p>Estamos aquí para ayudarte. Rellena el formulario a continuación y nos pondremos en contacto contigo lo antes posible.</p>
            <p className="research-note"><i className="fas fa-flask"></i> <em>Si tardamos en responder, probablemente estemos sumergidos en alguna investigación fascinante sobre modelos de lenguaje y procesamiento de documentos científicos. ¡Prometemos volver pronto a la superficie!</em></p>
          </div>
          
          <div className="contact-form-container">
            <div className="contact-info">
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h3>Ubicación</h3>
                  <p>Madrid, España</p>
                </div>
              </div>
              
              <div className="info-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <h3>Contacto</h3>
                  <p>Usa el formulario para contactarnos</p>
                </div>
              </div>
              
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h3>Horario</h3>
                  <p>Lunes - Viernes: 9:00 - 18:00</p>
                </div>
              </div>
              
              <div className="social-contact">
                <h3>Síguenos</h3>
                <div className="social-icons">
                  <a href="https://github.com/686f6c61/Uboost-beta" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                  <a href="https://www.linkedin.com/company/uboost" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
                </div>
              </div>
            </div>
            
            <form id="contact-form" onSubmit={handleSubmit} className="contact-form">
              <h2>Envíanos un mensaje</h2>
              
              {formStatus.success ? (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  <p>¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <>
                  {formStatus.error && (
                    <div className="error-message">
                      <i className="fas fa-exclamation-circle"></i>
                      <p>{formStatus.error}</p>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="contact-name">Nombre completo</label>
                    <div className="input-icon-wrapper">
                      <i className="fas fa-user input-icon"></i>
                      <input 
                        type="text" 
                        id="contact-name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Introduce tu nombre completo"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-email">Correo electrónico</label>
                    <div className="input-icon-wrapper">
                      <i className="fas fa-envelope input-icon"></i>
                      <input 
                        type="email" 
                        id="contact-email" 
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-message">Mensaje</label>
                    <div className="input-icon-wrapper textarea-wrapper">
                      <i className="fas fa-pencil-alt input-icon textarea-icon"></i>
                      <textarea 
                        id="contact-message" 
                        rows="5" 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="¿En qué podemos ayudarte?"
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Componente CAPTCHA - Solo se muestra cuando el usuario comienza a llenar el formulario */}
                  {showCaptcha && (
                    <div className="form-group">
                      <label>Por favor, verifica que eres humano:</label>
                      <SimpleLandingCaptcha onValidation={handleCaptchaValidation} />
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={formStatus.submitting || !captchaValid}
                  >
                    {formStatus.submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i> Enviar mensaje
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
            <div className="footer-logo">
                <h2><i className="fas fa-rocket"></i> (U)Boost</h2>
                <p>Potencia tus documentos científicos con IA</p>
            </div>
            <div className="footer-links">
                <div className="footer-column">
                    <h3>Producto</h3>
                    <ul>
                        <li><a href="/landing#caracteristicas">Características</a></li>
                        <li><a href="/landing#precios">Precios</a></li>
                        <li><a href="/landing#demo">Demo</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Empresa</h3>
                    <ul>
                        <li><Link to="/about">Sobre nosotros</Link></li>
                        <li><Link to="/contact">Contacto</Link></li>
                        <li><a href="#">Política de privacidad</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>&copy; 2025 (U)Boost. Todos los derechos reservados.</p>
            <div className="social-links">
                <a href="https://github.com/686f6c61/Uboost-beta" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                <a href="https://www.linkedin.com/company/uboost" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
