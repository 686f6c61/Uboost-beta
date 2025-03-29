const { Resend } = require('resend');

// Inicializar cliente de Resend usando la API key desde variables de entorno
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('ADVERTENCIA: RESEND_API_KEY no está definida en las variables de entorno');
}
const resend = new Resend(RESEND_API_KEY);

// Dominio verificado para los correos desde variables de entorno
const VERIFIED_EMAIL_DOMAIN = process.env.EMAIL_DOMAIN || 'localhost';
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL || `UBoost <no-reply@${VERIFIED_EMAIL_DOMAIN}>`;

/**
 * Procesa el formulario de contacto
 * Envía un correo a uboost@00b.tech con el mensaje y una confirmación al usuario
 */
exports.processContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validar datos
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, completa todos los campos del formulario'
      });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, proporciona un correo electrónico válido'
      });
    }

    // Enviar email utilizando Resend
    try {
      // Crear la plantilla HTML para el mensaje
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #001f3f; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Nuevo mensaje de contacto - (U)Boost</h2>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f8f8f8; padding: 15px; border-radius: 5px;">${message}</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px;">
            <p>&copy; 2025 (U)Boost. Todos los derechos reservados.</p>
          </div>
        </div>
      `;

      // Configurar email
      await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: ['uboost@00b.tech'],
        subject: `Mensaje de contacto de ${name}`,
        html: html,
        text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
        reply_to: email
      });

      // Enviar un correo de confirmación al usuario
      const userHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #001f3f; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Hemos recibido tu mensaje - (U)Boost</h2>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>Hola ${name},</p>
            <p>Gracias por contactar con (U)Boost. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
            <p>Si tienes alguna pregunta adicional, no dudes en responder a este correo.</p>
            <p style="color: #FF8C00; font-style: italic;">Si tardamos en responder, probablemente estemos sumergidos en alguna investigación fascinante sobre modelos de lenguaje y procesamiento de documentos científicos. ¡Prometemos volver pronto a la superficie!</p>
            <p>Saludos cordiales,</p>
            <p>El equipo de (U)Boost</p>
          </div>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px;">
            <p>&copy; 2025 (U)Boost. Todos los derechos reservados.</p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: [email],
        subject: 'Hemos recibido tu mensaje - (U)Boost',
        html: userHtml,
        text: `Hola ${name},\n\nGracias por contactar con (U)Boost. Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.\n\nSi tardamos en responder, probablemente estemos sumergidos en alguna investigación fascinante sobre modelos de lenguaje y procesamiento de documentos científicos. ¡Prometemos volver pronto a la superficie!\n\nSaludos cordiales,\nEl equipo de (U)Boost`
      });

      return res.status(200).json({
        success: true,
        message: 'Mensaje enviado correctamente'
      });
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.'
      });
    }
  } catch (error) {
    console.error('Error en processContactForm:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
