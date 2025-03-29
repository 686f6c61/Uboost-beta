const UserActivity = require('../models/userActivity');

/**
 * Registra una actividad de usuario en la base de datos
 * @param {Object} options Opciones de la actividad
 * @param {String} options.userId ID del usuario
 * @param {String} options.email Email del usuario
 * @param {String} options.action Tipo de acción (login, logout, query, pdf_upload, pdf_process)
 * @param {Object} options.details Detalles adicionales de la acción
 * @param {Number} options.tokensConsumed Tokens consumidos (para operaciones de IA)
 * @param {String} options.model Modelo utilizado (para operaciones de IA)
 * @param {String} options.ipAddress Dirección IP del usuario
 * @returns {Promise<Object>} El registro de actividad creado
 */
const logUserActivity = async (options) => {
  try {
    const { 
      userId, 
      email, 
      action, 
      details = {}, 
      tokensConsumed = 0, 
      model = '', 
      ipAddress = '', 
      sessionDuration = 0 
    } = options;

    if (!userId || !email || !action) {
      console.error('Error al registrar actividad: faltan datos obligatorios (userId, email o action)');
      return null;
    }

    // Verificar que action tenga un valor válido
    const validActions = ['login', 'logout', 'query', 'pdf_upload', 'pdf_process'];
    if (!validActions.includes(action)) {
      console.error(`Error al registrar actividad: acción inválida "${action}". Valores permitidos: ${validActions.join(', ')}`);
      return null;
    }

    console.log(`Registrando actividad [${action}] para el usuario ${email}`);

    const activity = new UserActivity({
      user: userId,
      email,
      action,
      details,
      tokensConsumed,
      model,
      ipAddress,
      sessionDuration
    });

    await activity.save();
    console.log(`Actividad [${action}] registrada exitosamente para ${email}`);
    return activity;
  } catch (err) {
    console.error('Error al registrar actividad de usuario:', err);
    return null;
  }
};

module.exports = { logUserActivity };
