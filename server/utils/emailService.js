const { Resend } = require('resend');
const path = require('path');
const fs = require('fs');

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
const SECURITY_EMAIL = process.env.SECURITY_EMAIL || `UBoost Security <security@${VERIFIED_EMAIL_DOMAIN}>`;

// Flag para modo de prueba (no envía correos reales en desarrollo)
// Establecido como false para permitir envío de correos reales
const TEST_MODE = false;

/**
 * Plantillas HTML para los correos electrónicos
 */
const emailTemplates = {
  // Plantilla de bienvenida para nuevos usuarios
  welcome: (userData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Bienvenido a UBoost</title>
      <style>
        body {
          font-family: 'Poppins', 'Roboto', 'Helvetica', Arial, sans-serif; /* Fuente de la aplicación */
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #6096B4; /* Color primario de la aplicación */
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 4px 4px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #F8F6F4; /* Color secundario light de la aplicación */
          border: 1px solid #BDCDD6; /* Color secundario dark de la aplicación */
        }
        .footer {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Bienvenido a UBoost</h1>
      </div>
      <div class="content">
        <p>Hola ${userData.firstName} ${userData.lastName},</p>
        <p>¡Gracias por registrarte en UBoost! Tu cuenta ha sido creada con éxito y está pendiente de aprobación por parte de un administrador.</p>
        <p>Una vez que tu cuenta sea aprobada, recibirás una notificación por correo electrónico y podrás comenzar a utilizar todas las funcionalidades de nuestra plataforma.</p>
        <p>Los detalles de tu registro son:</p>
        <ul>
          <li><strong>Email:</strong> ${userData.email}</li>
          <li><strong>Fecha de registro:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>País:</strong> ${userData.country}</li>
          <li><strong>Ciudad:</strong> ${userData.city}</li>
        </ul>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>Saludos,<br>El equipo de UBoost</p>
      </div>
      <div class="footer">
        <p>Este correo electrónico ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
        <p>&copy; ${new Date().getFullYear()} UBoost. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
    `;
  },

  // Plantilla de inicio de sesión para notificaciones de seguridad
  loginAlert: (userData, loginData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Inicio de sesión detectado - UBoost</title>
      <style>
        body {
          font-family: 'Poppins', 'Roboto', 'Helvetica', Arial, sans-serif; /* Fuente de la aplicación */
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #6096B4; /* Color primario de la aplicación */
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 4px 4px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #F8F6F4; /* Color secundario light de la aplicación */
          border: 1px solid #BDCDD6; /* Color secundario dark de la aplicación */
        }
        .alert {
          background-color: #F87474; /* Color error de la aplicación */
          border: 1px solid #F87474;
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .footer {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Alerta de seguridad - UBoost</h1>
      </div>
      <div class="content">
        <p>Hola ${userData.firstName} ${userData.lastName},</p>
        <p>Hemos detectado un inicio de sesión reciente en tu cuenta de UBoost.</p>
        
        <h3>Detalles del inicio de sesión:</h3>
        <ul>
          <li><strong>Fecha y hora:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Dirección IP:</strong> ${loginData.ipAddress}</li>
          <li><strong>Ubicación:</strong> ${userData.city}, ${userData.country}</li>
          <li><strong>Dispositivo:</strong> ${loginData.userAgent || 'No disponible'}</li>
        </ul>
        
        <p>Si fuiste tú quien inició sesión, puedes ignorar este mensaje.</p>
        
        <div class="alert">
          <p><strong>¿No reconoces esta actividad?</strong></p>
          <p>Si no has sido tú quien ha iniciado sesión, por favor cambia tu contraseña inmediatamente y contacta con nuestro equipo de soporte.</p>
        </div>
        
        <p>Saludos,<br>El equipo de UBoost</p>
      </div>
      <div class="footer">
        <p>Este correo electrónico ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
        <p>&copy; ${new Date().getFullYear()} UBoost. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
    `;
  },

  // Plantilla para notificación de cuenta aprobada
  accountApproved: (userData) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Tu cuenta ha sido aprobada - UBoost</title>
      <style>
        body {
          font-family: 'Poppins', 'Roboto', 'Helvetica', Arial, sans-serif; /* Fuente de la aplicación */
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #6096B4; /* Color primario de la aplicación */
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 4px 4px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #F8F6F4; /* Color secundario light de la aplicación */
          border: 1px solid #BDCDD6; /* Color secundario dark de la aplicación */
        }
        .success {
          background-color: #AAC8A7; /* Color success de la aplicación */
          border: 1px solid #AAC8A7;
          color: #fff;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          background-color: #6096B4; /* Color primario de la aplicación */
          color: #ffffff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 15px;
        }
        .footer {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>¡Tu cuenta ha sido aprobada!</h1>
      </div>
      <div class="content">
        <p>Hola ${userData.firstName} ${userData.lastName},</p>
        
        <div class="success">
          <p><strong>¡Buenas noticias!</strong> Tu cuenta de UBoost ha sido aprobada por un administrador y ahora puedes acceder a todas las funcionalidades de la plataforma.</p>
        </div>
        
        <p>Ya puedes iniciar sesión con tu correo electrónico y contraseña para comenzar a utilizar UBoost.</p>
        
        <p style="text-align: center;">
          <a href="https://uboost.00b.tech/login" class="button">Iniciar sesión</a>
        </p>
        
        <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        
        <p>Saludos,<br>El equipo de UBoost</p>
      </div>
      <div class="footer">
        <p>Este correo electrónico ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
        <p>&copy; ${new Date().getFullYear()} UBoost. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
    `;
  },
  
  // Plantilla para recuperación de contraseña
  passwordReset: (userData, resetToken) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Recupera tu contraseña - UBoost</title>
      <style>
        body {
          font-family: 'Poppins', 'Roboto', 'Helvetica', Arial, sans-serif; /* Fuente de la aplicación */
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #6096B4; /* Color primario de la aplicación */
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 4px 4px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #F8F6F4; /* Color secundario light de la aplicación */
          border: 1px solid #BDCDD6; /* Color secundario dark de la aplicación */
        }
        .info {
          background-color: #BDCDD6; /* Color secundario de la aplicación */
          border: 1px solid #BDCDD6;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .code {
          font-family: monospace;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 3px;
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          margin: 15px 0;
        }
        .button {
          display: inline-block;
          background-color: #6096B4; /* Color primario de la aplicación */
          color: #ffffff !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin-top: 15px;
        }
        .footer {
          padding: 10px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Recuperación de Contraseña</h1>
      </div>
      <div class="content">
        <p>Hola ${userData.firstName} ${userData.lastName},</p>
        
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en UBoost. Si no has solicitado este cambio, puedes ignorar este correo electrónico.</p>
        
        <div class="info">
          <p><strong>¡Importante!</strong> Este enlace será válido durante 1 hora a partir de ahora.</p>
        </div>
        
        <p>Tu código de restablecimiento es:</p>
        
        <div class="code">${resetToken}</div>
        
        <p>Para completar el proceso de restablecimiento de contraseña, haz clic en el siguiente enlace e introduce el código anterior:</p>
        
        <p style="text-align: center;">
          <a href="https://uboost.00b.tech/reset-password?token=${resetToken}&email=${encodeURIComponent(userData.email)}" class="button">Restablecer contraseña</a>
        </p>
        
        <p>Si tienes problemas con el enlace, puedes copiar y pegar la siguiente URL en tu navegador:</p>
        <p style="word-break: break-all;">https://uboost.00b.tech/reset-password?token=${resetToken}&email=${encodeURIComponent(userData.email)}</p>
        
        <p>Si no has solicitado restablecer tu contraseña, te recomendamos que verifiques la seguridad de tu cuenta.</p>
        
        <p>Saludos,<br>El equipo de UBoost</p>
      </div>
      <div class="footer">
        <p>Este correo electrónico ha sido enviado automáticamente. Por favor, no respondas a este mensaje.</p>
        <p>&copy; ${new Date().getFullYear()} UBoost. Todos los derechos reservados.</p>
      </div>
    </body>
    </html>
    `;
  }
};

/**
 * Envía un correo electrónico de bienvenida a un nuevo usuario registrado
 * @param {Object} userData - Datos del usuario
 */
const sendWelcomeEmail = async (userData) => {
  try {
    // En modo de prueba, simulamos el envío exitoso
    if (TEST_MODE) {
      console.log('MODO PRUEBA: Simulando envío de correo de bienvenida a', userData.email);
      console.log('Contenido del correo:', emailTemplates.welcome(userData).substring(0, 150) + '...');
      return { success: true, data: { id: 'test-email-id' } };
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: userData.email,
      subject: 'Bienvenido a UBoost - Confirma tu registro',
      html: emailTemplates.welcome(userData),
    });

    if (error) {
      console.error('Error enviando correo de bienvenida:', error);
      return { success: false, error };
    }

    console.log('Correo de bienvenida enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado enviando correo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envía una alerta de inicio de sesión
 * @param {Object} userData - Datos del usuario
 * @param {Object} loginData - Datos del inicio de sesión
 */
const sendLoginAlert = async (userData, loginData) => {
  try {
    // En modo de prueba, simulamos el envío exitoso
    if (TEST_MODE) {
      console.log('MODO PRUEBA: Simulando envío de alerta de inicio de sesión a', userData.email);
      console.log('Detalles de la sesión:', loginData);
      return { success: true, data: { id: 'test-login-alert-id' } };
    }

    const { data, error } = await resend.emails.send({
      from: SECURITY_EMAIL,
      to: userData.email,
      subject: 'Alerta de seguridad - Inicio de sesión detectado',
      html: emailTemplates.loginAlert(userData, loginData),
    });

    if (error) {
      console.error('Error enviando alerta de inicio de sesión:', error);
      return { success: false, error };
    }

    console.log('Alerta de inicio de sesión enviada:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado enviando correo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envía un correo de notificación cuando una cuenta es aprobada
 * @param {Object} userData - Datos del usuario
 */
const sendAccountApprovedEmail = async (userData) => {
  try {
    // En modo de prueba, simulamos el envío exitoso
    if (TEST_MODE) {
      console.log('MODO PRUEBA: Simulando envío de notificación de aprobación a', userData.email);
      return { success: true, data: { id: 'test-approval-id' } };
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: userData.email,
      subject: 'Tu cuenta en UBoost ha sido aprobada',
      html: emailTemplates.accountApproved(userData),
    });

    if (error) {
      console.error('Error enviando correo de aprobación:', error);
      return { success: false, error };
    }

    console.log('Correo de aprobación enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado enviando correo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envía un correo para recuperación de contraseña
 * @param {Object} userData - Datos del usuario
 * @param {String} resetToken - Token de recuperación
 */
const sendPasswordResetEmail = async (userData, resetToken) => {
  try {
    // En modo de prueba, simulamos el envío exitoso
    if (TEST_MODE) {
      console.log('MODO PRUEBA: Simulando envío de correo de recuperación de contraseña a', userData.email);
      console.log('Token generado:', resetToken);
      return { success: true, data: { id: 'test-password-reset-id' } };
    }

    const { data, error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: userData.email,
      subject: 'Recupera tu contraseña - UBoost',
      html: emailTemplates.passwordReset(userData, resetToken),
    });

    if (error) {
      console.error('Error enviando correo de recuperación de contraseña:', error);
      return { success: false, error };
    }

    console.log('Correo de recuperación de contraseña enviado:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado enviando correo:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendLoginAlert,
  sendAccountApprovedEmail,
  sendPasswordResetEmail
};
