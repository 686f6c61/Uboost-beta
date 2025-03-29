const User = require('../models/user');

/**
 * @desc    Obtener información de almacenamiento del usuario
 * @route   GET /api/users/storage-info
 * @access  Private
 */
exports.getUserStorageInfo = async (req, res) => {
  try {
    // Buscar el usuario y obtener la información de almacenamiento
    const user = await User.findById(req.user._id).select('storage');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Extraer la información de almacenamiento del usuario
    const storageInfo = {
      limitMB: user.storage?.limitMB || 200,
      usedBytes: user.storage?.usedBytes || 0
    };

    res.status(200).json({
      success: true,
      data: storageInfo
    });
  } catch (err) {
    console.error('Error al obtener información de almacenamiento:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información de almacenamiento: ' + err.message
    });
  }
};
