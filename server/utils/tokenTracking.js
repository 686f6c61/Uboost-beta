const User = require('../models/user');

/**
 * Actualiza el seguimiento de tokens para un usuario específico
 * @param {string} userId - ID del usuario
 * @param {object} tokenUsage - Objeto con el uso de tokens
 * @param {number} tokenUsage.promptTokens - Tokens de entrada utilizados
 * @param {number} tokenUsage.completionTokens - Tokens de salida utilizados
 * @param {number} tokenUsage.totalTokens - Total de tokens utilizados
 * @param {number} pdfsProcessed - Número de PDFs procesados en esta operación, por defecto 0
 * @param {string} model - Modelo de IA utilizado (ej: gpt-4o-mini, claude-3-7-sonnet-20250219)
 * @returns {Promise<object>} - Información actualizada de uso
 */
const updateTokenUsage = async (userId, tokenUsage, pdfsProcessed = 0, model = 'default') => {
  try {
    if (!userId) {
      console.warn('No se puede actualizar el uso de tokens: userId no proporcionado');
      return null;
    }

    // Calcular el costo estimado basado en los tokens y el modelo
    // Definir costos por modelo ($/1K tokens)
    const modelCosts = {
      // OpenAI
      'gpt-4o-mini': { input: 0.0005, output: 0.0015 },
      'gpt-4o': { input: 0.005, output: 0.015 },
      // Claude (Anthropic)
      'claude-3-7-sonnet-20250219': { input: 0.003, output: 0.015 },
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
      // Valores predeterminados
      'default': { input: 0.0005, output: 0.0015 }
    };
    
    // Obtener costos del modelo utilizado o usar valores predeterminados
    const modelCost = modelCosts[model] || modelCosts.default;
    const inputCostPer1K = modelCost.input;
    const outputCostPer1K = modelCost.output;
    
    // Calcular costo estimado
    const estimatedCost = 
      (tokenUsage.promptTokens / 1000) * inputCostPer1K + 
      (tokenUsage.completionTokens / 1000) * outputCostPer1K;
    
    // Registrar el costo estimado y el modelo en la consola
    console.log(`Coste estimado: $${estimatedCost.toFixed(6)} para modelo ${model}`);

    // Verificar si el usuario ya tiene registro para este modelo
    const user = await User.findById(userId);
    if (!user) {
      console.error(`No se encontró el usuario con ID ${userId}`);
      return null;
    }

    // Crear objeto de actualización para el usuario
    const updateData = {
      $inc: {
        'usage.pdfsProcessed': pdfsProcessed,
        'usage.tokens.input': tokenUsage.promptTokens,
        'usage.tokens.output': tokenUsage.completionTokens,
        'usage.tokens.total': tokenUsage.totalTokens,
        'usage.estimatedCostUSD': estimatedCost
      },
      $set: {
        'usage.lastUpdated': Date.now()
      }
    };

    // Comprobar si ya existe una entrada para este modelo
    let modelExists = false;
    if (user.usage && user.usage.byModel) {
      for (const modelEntry of user.usage.byModel) {
        if (modelEntry.name === model) {
          modelExists = true;
          break;
        }
      }
    }

    // Si el modelo ya existe, incrementar sus valores
    if (modelExists) {
      updateData.$inc[`usage.byModel.$[elem].count`] = 1;
      updateData.$inc[`usage.byModel.$[elem].tokens`] = tokenUsage.totalTokens;
      updateData.$inc[`usage.byModel.$[elem].cost`] = estimatedCost;
    } else {
      // Si el modelo no existe, añadir una nueva entrada
      updateData.$push = {
        'usage.byModel': {
          name: model,
          count: 1,
          tokens: tokenUsage.totalTokens,
          cost: estimatedCost
        }
      };
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true,
        arrayFilters: modelExists ? [{ 'elem.name': model }] : undefined
      }
    );

    if (!updatedUser) {
      console.error(`No se pudo actualizar el usuario con ID ${userId}`);
      return null;
    }

    return updatedUser.usage;
  } catch (error) {
    console.error('Error al actualizar el uso de tokens:', error);
    return null;
  }
};

/**
 * Obtiene las estadísticas de uso de un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<object>} - Estadísticas de uso
 */
const getUserUsageStats = async (userId) => {
  try {
    const user = await User.findById(userId).select('usage');
    return user ? user.usage : null;
  } catch (error) {
    console.error('Error al obtener estadísticas de uso:', error);
    return null;
  }
};

/**
 * Obtiene las estadísticas de uso de todos los usuarios (para administradores)
 * con mejor manejo de errores y valores predeterminados para evitar errores 500
 * @returns {Promise<Array>} - Lista de usuarios con sus estadísticas
 */
const getAllUserStats = async () => {
  try {
    // Obtenemos todos los usuarios con los campos necesarios
    const users = await User.find({
      // Excluir usuarios eliminados para evitar problemas
      status: { $ne: 'deleted' }
    }).select('email firstName lastName usage role status createdAt');
    
    // Procesamos los datos para garantizar que todos los campos existan
    // y evitar errores al acceder a propiedades inexistentes
    return users.map(user => {
      // Asegurarnos de que usage existe y tiene una estructura válida
      const safeUsage = {
        pdfsProcessed: user.usage?.pdfsProcessed || 0,
        tokens: {
          input: user.usage?.tokens?.input || 0,
          output: user.usage?.tokens?.output || 0,
          total: user.usage?.tokens?.total || 0
        },
        modelUsage: user.usage?.modelUsage || [],
        estimatedCostUSD: user.usage?.estimatedCostUSD || 0
      };
      
      // Calcular la fecha de registro en formato legible
      const registeredDate = user.createdAt ? 
        new Date(user.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        }) : 'Desconocida';
      
      // Devolver un objeto con estructura garantizada
      return {
        _id: user._id,
        email: user.email || 'Sin email',
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sin nombre',
        role: user.role || 'user',
        status: user.status || 'pending',
        registeredDate: registeredDate,
        usage: safeUsage
      };
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de todos los usuarios:', error);
    // Devolver un array vacío para evitar errores en el cliente
    return [];
  }
};

module.exports = {
  updateTokenUsage,
  getUserUsageStats,
  getAllUserStats
};
