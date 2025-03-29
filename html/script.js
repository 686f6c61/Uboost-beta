document.addEventListener('DOMContentLoaded', function() {
    // Nav menu toggle para dispositivos móviles
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // No necesitamos gestión de tabs ahora que solo tenemos Early Access
    
    // Efecto de scroll suave para los enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Validación del formulario de contacto
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const subject = document.getElementById('contact-subject').value;
            const message = document.getElementById('contact-message').value;
            
            // Validación simple
            if (!name || !email || !subject || !message) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            if (message.length < 10) {
                alert('Por favor, escribe un mensaje más detallado');
                return;
            }
            
            // Aquí se enviaría el formulario a un backend real
            // Por ahora simulamos un envío exitoso
            alert('¡Mensaje enviado correctamente! Te responderemos lo antes posible a ' + email);
            contactForm.reset();
        });
    }
    
    // Validación del formulario de Early Access
    const earlyAccessForm = document.getElementById('early-access-form');
    
    if (earlyAccessForm) {
        earlyAccessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('ea-name').value;
            const university = document.getElementById('ea-university').value;
            const country = document.getElementById('ea-country').value;
            const email = document.getElementById('ea-email').value;
            const purpose = document.getElementById('ea-purpose').value;
            
            // Validación simple
            if (!name || !university || !country || !email || !purpose) {
                alert('Por favor completa todos los campos');
                return;
            }
            
            if (purpose.length < 20) {
                alert('Por favor, explica con más detalle para qué quieres usar (U)Boost');
                return;
            }
            
            // Aquí se enviaría el formulario a un backend real
            // Por ahora simulamos una solicitud exitosa
            alert('¡Solicitud de Early Access recibida! Te notificaremos en ' + email + ' cuando tu acceso sea aprobado.');
            earlyAccessForm.reset();
        });
    }
    
    // Animación de aparición al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const animatedElements = [
        ...document.querySelectorAll('.feature-card'),
        ...document.querySelectorAll('.step'),
        document.querySelector('.early-access-container')
    ].filter(el => el !== null);
    
    animatedElements.forEach(el => {
        el.classList.add('animate');
        observer.observe(el);
    });
    
    // Añadir un poco de CSS dinámico para las animaciones
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(1) { transition-delay: 0.1s; }
        .feature-card:nth-child(2) { transition-delay: 0.2s; }
        .feature-card:nth-child(3) { transition-delay: 0.3s; }
        .feature-card:nth-child(4) { transition-delay: 0.4s; }
        
        .step:nth-child(1) { transition-delay: 0.1s; }
        .step:nth-child(2) { transition-delay: 0.2s; }
        .step:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
});
