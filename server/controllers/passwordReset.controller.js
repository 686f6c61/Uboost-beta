const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../utils/emailService');
const { logUserActivity } = require('../utils/activityLogger');

// Almacenamiento temporal de tokens de restablecimiento (en producción usar Redis o DB)
const passwordResetTokens = new Map();

/**
 * @desc    Solicitar restablecimiento de contraseña
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar que se proporcionó un correo electrónico
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona un correo electrónico'
      });
    }

    // Buscar el usuario por email
    const user = await User.findOne({ email });

    // Si no existe el usuario, enviar una respuesta de éxito de todos modos
    // (para no revelar qué emails están registrados)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña'
      });
    }

    // Verificar que el usuario esté aprobado
    if (user.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Tu cuenta no está activa. Por favor, contacta al administrador.'
      });
    }

    // Generar token aleatorio para restablecer contraseña
    const resetToken = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Guardar token con tiempo de expiración (1 hora)
    passwordResetTokens.set(resetToken, {
      userId: user._id.toString(),
      email: user.email,
      expiresAt: Date.now() + 3600000 // 1 hora
    });

    // Obtener IP del cliente
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Enviar correo con el token
    await sendPasswordResetEmail(user, resetToken);

    // Registrar actividad
    await logUserActivity({
      userId: user._id,
      email: user.email,
      action: 'password_reset_request',
      details: {
        userAgent: req.headers['user-agent']
      },
      ipAddress
    });

    res.status(200).json({
      success: true,
      message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
    });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error al procesar tu solicitud'
    });
  }
};

/**
 * @desc    Verificar token de restablecimiento
 * @route   POST /api/auth/verify-reset-token
 * @access  Public
 */
exports.verifyResetToken = async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: 'Token y correo electrónico son requeridos'
      });
    }

    // Verificar si el token existe y no ha expirado
    const tokenData = passwordResetTokens.get(token);

    if (!tokenData || tokenData.email !== email || tokenData.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token válido'
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error al verificar el token'
    });
  }
};

/**
 * @desc    Restablecer contraseña con token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token, correo electrónico y nueva contraseña son requeridos'
      });
    }

    // Verificar si el token existe y no ha expirado
    const tokenData = passwordResetTokens.get(token);

    if (!tokenData || tokenData.email !== email || tokenData.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    // Verificar longitud mínima de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const user = await User.findById(tokenData.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener IP del cliente
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Generar hash de la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Actualizar contraseña
    user.password = hashedPassword;
    await user.save();

    // Eliminar token usado
    passwordResetTokens.delete(token);

    // Registrar actividad
    await logUserActivity({
      userId: user._id,
      email: user.email,
      action: 'password_reset_success',
      details: {
        userAgent: req.headers['user-agent']
      },
      ipAddress
    });

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada con éxito'
    });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Ha ocurrido un error al restablecer la contraseña'
    });
  }
};
