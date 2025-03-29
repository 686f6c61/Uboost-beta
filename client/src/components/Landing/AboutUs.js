import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const AboutUs = () => {
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
                    <li><a href="/landing#contacto"><i className="fas fa-envelope"></i> Contacto</a></li>
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

      <main className="about-us-content">
        <section className="about-section">
          <h1>Sobre Nosotros</h1>
          <div className="about-intro">
            <p>En (U)Boost combinamos la experiencia en Ingeniería de LLMs con el conocimiento académico para revolucionar la forma en que los investigadores interactúan con la literatura científica.</p>
          </div>

          <div className="team-section">
            <h2><i className="fas fa-users"></i> Nuestro Equipo</h2>
            <div className="team-description">
              <p>(U)Boost cuenta con un equipo multidisciplinar de especialistas en Ingeniería de Modelos de Lenguaje (LLM) e investigadores académicos apasionados por transformar la forma en que interactuamos con el conocimiento científico.</p>
              
              <p>Nuestro equipo está compuesto por expertos en:</p>
              
              <ul className="team-expertise">
                <li><i className="fas fa-brain"></i> <strong>Procesamiento de Lenguaje Natural (NLP)</strong> especializado en documentos académicos y científicos</li>
                <li><i className="fas fa-project-diagram"></i> <strong>Técnicas avanzadas de RAG</strong> (Retrieval Augmented Generation) para optimizar la recuperación de información</li>
                <li><i className="fas fa-sliders-h"></i> <strong>Fine-tuning de modelos de IA</strong> para el dominio científico y académico</li>
                <li><i className="fas fa-search"></i> <strong>Sistemas de búsqueda semántica</strong> adaptados a la investigación científica</li>
                <li><i className="fas fa-graduation-cap"></i> <strong>Investigación académica</strong> en universidades españolas y europeas</li>
              </ul>
              
              <p>La combinación de experiencia técnica en IA y conocimiento profundo del ámbito académico nos permite crear soluciones que realmente comprenden y potencian el trabajo de investigación.</p>
            </div>
          </div>

          <div className="academic-partners">
            <h2><i className="fas fa-university"></i> Colaboraciones Académicas</h2>
            <p>Colaboramos estrechamente con grupos de investigación de prestigiosas universidades españolas:</p>
            
            <div className="partners-grid">
              <div className="partner">
                <h3>Universidad de Sevilla</h3>
                <p>Departamento de Lenguajes y Sistemas Informáticos</p>
              </div>
              
              <div className="partner">
                <h3>Universidad Unipro de Andorra</h3>
                <p>Centro de Innovación en Inteligencia Artificial</p>
              </div>
              
              <div className="partner">
                <h3>Universidad Internacional de La Rioja (UNIR)</h3>
                <p>Escuela Superior de Ingeniería y Tecnología</p>
              </div>
              
              <div className="partner">
                <h3>Universidad Politécnica de Madrid</h3>
                <p>Departamento de Inteligencia Artificial</p>
              </div>
              
              <div className="partner">
                <h3>Universidad Camilo José Cela (UCJC)</h3>
                <p>Escuela de Tecnología y Ciencia</p>
              </div>
              
              <div className="partner">
                <h3>Universidad Autónoma de Barcelona</h3>
                <p>Instituto de Inteligencia Artificial</p>
              </div>
              
              <div className="partner">
                <h3>Universidad de Valencia</h3>
                <p>Facultad de Ciencias de la Computación</p>
              </div>
            </div>
          </div>
          
          <div className="mission-section">
            <h2><i className="fas fa-bullseye"></i> Nuestra Misión</h2>
            <p>Estamos comprometidos a potenciar la investigación científica mediante herramientas de IA que permitan a los académicos extraer el máximo valor de la literatura especializada. Creemos que la combinación de modelos avanzados de lenguaje con técnicas específicas para el dominio científico puede transformar radicalmente la forma en que se realiza la investigación.</p>
            <p>Nuestro objetivo es reducir el tiempo que los investigadores dedican a la revisión de literatura, permitiéndoles centrarse en lo que realmente importa: generar nuevas ideas y avanzar en su campo de estudio.</p>
          </div>
          
          <div className="cta-section">
            <h2>¿Listo para revolucionar tu investigación?</h2>
            <a href="/landing#early-access" className="primary-btn"><i className="fas fa-rocket"></i> Solicitar Early Access</a>
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
                        <li><a href="/landing#contacto">Contacto</a></li>
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

export default AboutUs;
