const { Resend } = require('resend');
const EarlyAccessRequest = require('../models/EarlyAccessRequest');

// Inicializar cliente de Resend usando la API key desde variables de entorno
// IMPORTANTE: Nunca exponer API keys en el código fuente
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('ADVERTENCIA: RESEND_API_KEY no está definida en las variables de entorno');
}
const resend = new Resend(RESEND_API_KEY);

// Dominio verificado para los correos desde variables de entorno
const VERIFIED_EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || 'localhost';
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || `UBoost <no-reply@${VERIFIED_EMAIL_DOMAIN}>`;

/**
 * Procesa una solicitud de Early Access
 * Envía un correo a uboost@00b.tech y otro al usuario solicitante
 * Actualiza las estadísticas de plazas disponibles
 */
exports.processEarlyAccess = async (req, res) => {
  try {
    const { name, email, university, country, purpose } = req.body;

    // Validar datos recibidos
    if (!name || !email || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, proporciona nombre, correo electrónico y propósito'
      });
    }
    
    // Verificar si ya existe una solicitud con el mismo email
    const existingRequest = await EarlyAccessRequest.findOne({ email });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una solicitud con este correo electrónico'
      });
    }
    
    // Crear nueva solicitud en la base de datos
    await EarlyAccessRequest.create({
      name,
      email,
      university,
      country,
      purpose
    });
    
    // Obtener estadísticas actualizadas
    const stats = await EarlyAccessRequest.getStats();

    // Email para el administrador (uboost@00b.tech)
    await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: ['uboost@00b.tech'],
      subject: '🚀 Nueva solicitud de Early Access',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a2540; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; border: 1px solid #ddd; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nueva solicitud de Early Access</h1>
            </div>
            <div class="content">
              <p>Se ha recibido una nueva solicitud de Early Access:</p>
              
              <div class="field">
                <div class="label">Nombre:</div>
                <div>${name}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div>${email}</div>
              </div>
              
              <div class="field">
                <div class="label">Universidad/Institución:</div>
                <div>${university || 'No especificado'}</div>
              </div>
              
              <div class="field">
                <div class="label">País:</div>
                <div>${country || 'No especificado'}</div>
              </div>
              
              <div class="field">
                <div class="label">Propósito de uso:</div>
                <div>${purpose}</div>
              </div>
              
              <p>Accede al panel de administración para gestionar esta solicitud.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // Email de confirmación para el solicitante
    await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject: '🚀 Tu solicitud de Early Access a UBoost está en cola',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 0;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            .logo-container {
              background-color: #0a2540; 
              padding: 20px;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: 700;
              color: white;
              margin: 0;
              letter-spacing: -0.5px;
            }
            .logo span {
              color: #3b82f6;
            }
            .header { 
              background-color: #0a2540; 
              color: white; 
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content { 
              padding: 30px; 
              background-color: #fff;
            }
            .message-box {
              background-color: #f0f7ff;
              border-left: 4px solid #3b82f6;
              padding: 15px;
              margin-bottom: 20px;
              border-radius: 4px;
            }
            .message-box p {
              margin: 0;
              color: #0a2540;
              font-weight: 500;
            }
            .details {
              background-color: #f9f9f9;
              border-radius: 6px;
              padding: 20px;
              margin-top: 20px;
            }
            .details-title {
              font-weight: 600;
              margin-top: 0;
              margin-bottom: 10px;
              color: #0a2540;
            }
            .details-item {
              display: flex;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .details-item:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .details-label {
              font-weight: 500;
              width: 40%;
              color: #555;
            }
            .details-value {
              width: 60%;
            }
            .queue-status {
              display: flex;
              align-items: center;
              background-color: #fff8e6;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              border: 1px solid #ffecc7;
            }
            .status-icon {
              background-color: #ffbb00;
              color: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              margin-right: 15px;
              font-weight: bold;
            }
            .status-text {
              flex: 1;
            }
            .status-text h3 {
              margin: 0 0 5px;
              color: #704d00;
              font-size: 16px;
            }
            .status-text p {
              margin: 0;
              color: #8f6400;
              font-size: 14px;
            }
            .progress-container {
              background-color: #eaeaea;
              height: 10px;
              border-radius: 5px;
              margin: 15px 0;
              overflow: hidden;
            }
            .progress-bar {
              background-color: #3b82f6;
              height: 100%;
              width: 15%; /* 15 plazas de 50 */
              border-radius: 5px;
            }
            .spots-info {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
              color: #555;
            }
            .next-steps {
              margin-top: 25px;
            }
            .next-steps h3 {
              color: #0a2540;
              margin-top: 0;
              font-size: 16px;
            }
            .next-steps ol {
              padding-left: 20px;
              margin-bottom: 0;
            }
            .next-steps li {
              margin-bottom: 8px;
            }
            .footer {
              background-color: #f5f7fa;
              padding: 20px;
              text-align: center;
              font-size: 13px;
              color: #666;
              border-top: 1px solid #eee;
            }
            .social-links {
              margin-top: 15px;
            }
            .social-links a {
              display: inline-block;
              margin: 0 5px;
              color: #0a2540;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo-container">
              <h1 class="logo"><span>(U)</span>Boost</h1>
            </div>
            <div class="header">
              <h1>¡Solicitud de Early Access Recibida!</h1>
              <p>Gracias por tu interés en formar parte de nuestra fase beta exclusiva</p>
            </div>
            <div class="content">
              <div class="message-box">
                <p>Hola ${name}, tu solicitud ha sido recibida y está ahora en nuestra cola de espera para activación.</p>
              </div>
              
              <p>Nos complace confirmar que hemos recibido tu solicitud para acceder anticipadamente a UBoost, nuestra plataforma revolucionaria de análisis de artículos científicos con IA.</p>
              
              <div class="queue-status">
                <div class="status-icon">⏳</div>
                <div class="status-text">
                  <h3>Estado: En cola de espera</h3>
                  <p>Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando sea aprobada.</p>
                </div>
              </div>
              
              <div class="progress-container">
                <div class="progress-bar" style="width: ${stats.percentOccupied}%;"></div>
              </div>
              <div class="spots-info">
                <span>${stats.totalSpots} plazas totales</span>
                <span>${stats.remainingSpots} plazas restantes</span>
              </div>
              
              <div class="details">
                <h3 class="details-title">Detalles de tu solicitud:</h3>
                <div class="details-item">
                  <div class="details-label">Nombre:</div>
                  <div class="details-value">${name}</div>
                </div>
                <div class="details-item">
                  <div class="details-label">Email:</div>
                  <div class="details-value">${email}</div>
                </div>
                <div class="details-item">
                  <div class="details-label">Institución:</div>
                  <div class="details-value">${university || 'No especificado'}</div>
                </div>
                <div class="details-item">
                  <div class="details-label">País:</div>
                  <div class="details-value">${country || 'No especificado'}</div>
                </div>
                <div class="details-item">
                  <div class="details-label">Fecha de solicitud:</div>
                  <div class="details-value">${new Date().toLocaleDateString()}</div>
                </div>
              </div>
              
              <div class="next-steps">
                <h3>Próximos pasos:</h3>
                <ol>
                  <li>Nuestro equipo revisará tu solicitud en los próximos días.</li>
                  <li>Recibirás un correo con las instrucciones de acceso cuando sea aprobada.</li>
                  <li>Podrás disfrutar de un mes gratis y 25% de descuento durante el primer año.</li>
                </ol>
              </div>
              
              <p>Si tienes alguna pregunta mientras esperas, no dudes en ponerte en contacto con nosotros respondiendo a este correo.</p>
              
              <p>Saludos,<br>El equipo de UBoost</p>
            </div>
            <div class="footer">
              <p>© 2025 UBoost - Todos los derechos reservados</p>
              <p>Este correo fue enviado a ${email} porque solicitaste acceso Early Access a UBoost.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // Respuesta exitosa con estadísticas actualizadas
    return res.status(200).json({
      success: true,
      message: 'Solicitud de Early Access procesada correctamente',
      stats: stats
    });

  } catch (error) {
    console.error('Error al procesar solicitud de Early Access:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud'
    });
  }
};
