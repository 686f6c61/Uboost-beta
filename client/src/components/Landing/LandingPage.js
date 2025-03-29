import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EarlyAccessForm from './EarlyAccessForm';
import './LandingPage.css';

const LandingPage = () => {
  const [modalImage, setModalImage] = useState(null);
  
  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
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
                    <li><a href="#caracteristicas"><i className="fas fa-list-ul"></i> Características</a></li>
                    <li><a href="#precios"><i className="fas fa-tags"></i> Precios</a></li>
                    <li><Link to="/contact"><i className="fas fa-envelope"></i> Contacto</Link></li>
                    <li><Link to="/login" className="login-btn"><i className="fas fa-sign-in-alt"></i> Iniciar sesión</Link></li>
                    <li><a href="#early-access" className="register-btn"><i className="fas fa-star"></i> Early Access</a></li>
                </ul>
            </div>
            <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
      </header>

      <main>
        <section className="hero">
            <div className="hero-content">
                <h1>Revoluciona tu investigación científica con IA</h1>
                <p>Procesa, analiza y genera contenido académico a partir de artículos científicos en formato PDF con la potencia de los modelos más avanzados de IA.</p>
                <div className="cta-buttons">
                    <a href="#early-access" className="primary-btn"><i className="fas fa-rocket"></i> Solicitar acceso</a>
                </div>
            </div>
            <div className="hero-image">
                <img src="/img/inteligencia-articulo.png" alt="(U)Boost en acción" />
            </div>
        </section>

        <section id="early-access" className="early-access-section">
            <div className="early-access-container">
                <h2><i className="fas fa-star"></i> Solicitar Early Access</h2>
                <p className="early-access-info">Estamos ofreciendo acceso anticipado a un grupo selecto de investigadores y académicos. Las solicitudes serán revisadas y los accesos concedidos por orden de registro.</p>
                <div className="access-limit-info">
                    <div className="limit-header">
                        <i className="fas fa-fire"></i>
                        <h3>Acceso limitado</h3>
                    </div>
                    <p>Solo se concederán <strong>50 accesos</strong> en esta fase beta</p>
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '60%' }}></div>
                        </div>
                        <div className="progress-labels">
                            <span className="progress-text">60% ocupado</span>
                            <span className="spots-left">23 plazas restantes</span>
                        </div>
                    </div>
                </div>
                
                <EarlyAccessForm />
                <p className="early-access-notice">Te notificaremos por correo electrónico cuando tu solicitud sea aprobada.</p>
            </div>
        </section>

        <section id="caracteristicas" className="features">
            <h2>Potencia tu investigación</h2>
            <div className="features-grid">
                <div className="feature-card">
                    <i className="fas fa-brain"></i>
                    <h3>Análisis inteligente</h3>
                    <p>Consultas contextuales precisas sobre el contenido de tus PDFs con tecnología RAG avanzada.</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-file-alt"></i>
                    <h3>Resúmenes estructurados</h3>
                    <p>Obtén resúmenes académicos completos con referencias APA y estructura profesional.</p>
                </div>
                <div className="feature-card">
                    <i className="fas fa-project-diagram"></i>
                    <h3>Revisión científica</h3>
                    <p>Genera artículos de revisión completos sintetizando múltiples fuentes automáticamente.</p>
                </div>
            </div>
        </section>

        <section className="how-it-works">
            <h2>Cómo funciona</h2>
            <div className="steps">
                <div className="step">
                    <div className="step-image">
                        <img 
                          src="/img/inteligencia-articulo.png" 
                          alt="Sube tus PDFs" 
                          onClick={() => openModal('/img/inteligencia-articulo.png')}
                          className="clickable-image"
                        />
                    </div>
                    <h3>Sube tus PDFs</h3>
                    <p>Carga tus artículos científicos en PDF a la plataforma.</p>
                </div>
                <div className="step">
                    <div className="step-image">
                        <img 
                          src="/img/resumen-estructurado.png" 
                          alt="Selecciona el análisis" 
                          onClick={() => openModal('/img/resumen-estructurado.png')}
                          className="clickable-image"
                        />
                    </div>
                    <h3>Selecciona el análisis</h3>
                    <p>Elige entre consulta específica, resumen o revisión científica.</p>
                </div>
                <div className="step">
                    <div className="step-image">
                        <img 
                          src="/img/revision-articulo-cientifico.png" 
                          alt="Obtén resultados" 
                          onClick={() => openModal('/img/revision-articulo-cientifico.png')}
                          className="clickable-image"
                        />
                    </div>
                    <h3>Obtén resultados</h3>
                    <p>Recibe análisis detallados y precisos en segundos.</p>
                </div>
            </div>
        </section>

        <section id="precios" className="pricing-section">
            <div className="section-header">
                <h2>Planes y precios</h2>
                <p>Elige el plan que mejor se adapte a tus necesidades de investigación académica</p>
            </div>
            <div className="pricing-container">
                {/* Plan Student */}
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Student</h3>
                        <div className="pricing-price">
                            <div className="price">
                                <span className="amount">15</span>
                                <span className="time-unit">€</span>
                            </div>
                            <span className="period">pago por Uso</span>
                        </div>
                    </div>
                    <div className="pricing-features">
                        <ul>
                            <li><i className="fas fa-check"></i> 4 procesos mensuales</li>
                            <li><i className="fas fa-check"></i> 3 artículos diferentes</li>
                            <li><i className="fas fa-check"></i> Análisis inteligente básico</li>
                            <li><i className="fas fa-check"></i> Resúmenes estructurados</li>
                            <li><i className="fas fa-times"></i> Revisión científica</li>
                            <li><i className="fas fa-times"></i> Finetuning académico</li>
                        </ul>
                    </div>
                    <a href="#early-access" className="pricing-btn"><i className="fas fa-unlock-alt"></i> Solicitar acceso</a>
                </div>

                {/* Plan Academic */}
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Academic</h3>
                        <div className="pricing-price">
                            <div className="price">
                                <span className="amount">19</span>
                                <span className="time-unit">€/mes</span>
                            </div>
                            <span className="period">facturación mensual</span>
                        </div>
                    </div>
                    <div className="pricing-features">
                        <ul>
                            <li><i className="fas fa-check"></i> 10 procesos mensuales</li>
                            <li><i className="fas fa-check"></i> 10 artículos diferentes</li>
                            <li><i className="fas fa-check"></i> Análisis inteligente avanzado</li>
                            <li><i className="fas fa-check"></i> Resúmenes estructurados</li>
                            <li><i className="fas fa-check"></i> Revisión científica básica</li>
                            <li><i className="fas fa-times"></i> Finetuning académico</li>
                        </ul>
                    </div>
                    <a href="#early-access" className="pricing-btn"><i className="fas fa-unlock-alt"></i> Solicitar acceso</a>
                </div>

                {/* Plan Departamento */}
                <div className="pricing-card popular">
                    <div className="popular-badge">Popular</div>
                    <div className="pricing-header">
                        <h3>Departamento</h3>
                        <div className="pricing-price">
                            <div className="price">
                                <span className="amount">98</span>
                                <span className="time-unit">€/mes</span>
                            </div>
                            <span className="period">facturación mensual</span>
                        </div>
                    </div>
                    <div className="pricing-features">
                        <ul>
                            <li><i className="fas fa-check"></i> 100 procesos mensuales</li>
                            <li><i className="fas fa-check"></i> 100 artículos diferentes</li>
                            <li><i className="fas fa-check"></i> Análisis inteligente avanzado</li>
                            <li><i className="fas fa-check"></i> Resúmenes estructurados premium</li>
                            <li><i className="fas fa-check"></i> Revisión científica completa</li>
                            <li><i className="fas fa-check"></i> Modelos con finetuning académico</li>
                        </ul>
                    </div>
                    <a href="#early-access" className="pricing-btn highlight-btn"><i className="fas fa-crown"></i> Solicitar acceso</a>
                </div>
                
                {/* Plan Early Access */}
                <div className="pricing-card early-access-card">
                    <div className="early-badge">Early Access</div>
                    <div className="pricing-header">
                        <h3>Departamento + Early Access</h3>
                        <div className="pricing-price">
                            <div className="price-discount">
                                <span className="original-price">98€/mes</span>
                                <span className="discounted-price">
                                    <span className="amount">70</span>
                                    <span className="time-unit">€/mes</span>
                                </span>
                            </div>
                            <span className="period">primer mes gratis + 25% descuento</span>
                        </div>
                    </div>
                    <div className="pricing-features">
                        <ul>
                            <li><i className="fas fa-check"></i> Todo lo incluido en Departamento</li>
                            <li><i className="fas fa-check"></i> 1 mes de uso completamente gratis</li>
                            <li><i className="fas fa-check"></i> 25% de descuento durante el primer año</li>
                            <li><i className="fas fa-check"></i> Soporte prioritario</li>
                            <li><i className="fas fa-check"></i> Acceso a nuevas funciones antes</li>
                            <li><i className="fas fa-check"></i> Capacitación personalizada</li>
                        </ul>
                    </div>
                    <a href="#early-access" className="pricing-btn early-btn"><i className="fas fa-rocket"></i> Solicitar ahora</a>
                </div>
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
                        <li><a href="#">Características</a></li>
                        <li><a href="#">Precios</a></li>
                        <li><a href="#">Demo</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Empresa</h3>
                    <ul>
                        <li><Link to="/about">Sobre nosotros</Link></li>
                        <li><a href="#">Contacto</a></li>
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
      {/* Modal para visualización de imágenes */}
      {modalImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content">
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <img src={modalImage} alt="Vista ampliada" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
