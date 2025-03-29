const User = require('../models/user');
const { getUserUsageStats } = require('../utils/tokenTracking');

/**
 * @desc    Obtener el usuario actual
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
  try {
    // El usuario ya está disponible en req.user gracias al middleware de auth
    // Excluimos el password de la respuesta
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @desc    Obtener estadísticas de uso del usuario actual
 * @route   GET /api/users/me/stats
 * @access  Private
 */
exports.getUserStats = async (req, res) => {
  try {
    const stats = await getUserUsageStats(req.user.id);
    
    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron estadísticas para este usuario'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        usage: stats
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
