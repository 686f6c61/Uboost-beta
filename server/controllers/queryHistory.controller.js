const QueryHistory = require('../models/queryHistory');
const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { logUserActivity } = require('../utils/activityLogger');

// @desc    Guardar una consulta en el historial
// @route   POST /api/history
// @access  Private
exports.saveQuery = asyncHandler(async (req, res, next) => {
  // Añadimos el ID de usuario a la consulta - asegurando el tipo de dato correcto
  const mongoose = require('mongoose');
  const userId = req.user._id;
  
  // Loggear para depuración
  console.log(`Guardando consulta para usuario ${req.user.email} (ID: ${userId})`);
  
  // Garantizamos que usamos el ObjectId para evitar problemas de comparación
  req.body.user = new mongoose.Types.ObjectId(userId);
  
  // Extraemos los valores de tokens para actualizar también las estadísticas de usuario
  // Verificamos las diferentes estructuras posibles para los tokens
  let inputTokens = 0;
  let outputTokens = 0;
  let totalTokens = 0;
  
  if (req.body.tokens) {
    if (typeof req.body.tokens === 'object') {
      // Estructura { input: X, output: Y, total: Z }
      inputTokens = Number(req.body.tokens.input) || 0;
      outputTokens = Number(req.body.tokens.output) || 0;
      totalTokens = Number(req.body.tokens.total) || inputTokens + outputTokens || 0;
    } else if (typeof req.body.tokens === 'number') {
      // Estructura tokens: X (solo número total)
      totalTokens = Number(req.body.tokens);
    }
  }
  
  // Verificamos si hay una estructura tokenUsage 
  if (req.body.tokenUsage) {
    if (req.body.tokenUsage.promptTokens !== undefined) {
      inputTokens = Number(req.body.tokenUsage.promptTokens) || 0;
    }
    if (req.body.tokenUsage.completionTokens !== undefined) {
      outputTokens = Number(req.body.tokenUsage.completionTokens) || 0; 
    }
    if (req.body.tokenUsage.totalTokens !== undefined) {
      totalTokens = Number(req.body.tokenUsage.totalTokens) || 0;
    } else if (inputTokens > 0 || outputTokens > 0) {
      totalTokens = inputTokens + outputTokens;
    }
  }
  
  // Aseguramos que sean números válidos
  inputTokens = isNaN(inputTokens) ? 0 : Math.max(0, inputTokens);
  outputTokens = isNaN(outputTokens) ? 0 : Math.max(0, outputTokens);
  totalTokens = isNaN(totalTokens) ? 0 : Math.max(0, totalTokens);
  
  console.log(`Actualizando estadísticas para ${req.user.email}: Tokens [input=${inputTokens}, output=${outputTokens}, total=${totalTokens}]`);
  
  // Guardamos la consulta en el historial
  const queryRecord = await QueryHistory.create(req.body);
  
  // Registrar la actividad de consulta
  await logUserActivity({
    userId: req.user.id,
    email: req.user.email,
    action: 'query',
    details: {
      queryType: req.body.queryType || 'simple_query',
      prompt: req.body.prompt ? req.body.prompt.substring(0, 100) : 'No prompt',
      model: req.body.model || 'unknown',
      processedFiles: req.body.processedFiles ? req.body.processedFiles.length : 0
    },
    tokensConsumed: req.body.tokens?.total || 0,
    model: req.body.model || '',
    ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
  });
  
  // Calculamos el coste estimado (aproximado, basado en GPT-4)
  const costeTokenEntrada = 0.00001;  // $0.01 por 1000 tokens de entrada (aproximado)
  const costeTokenSalida = 0.00003; // $0.03 por 1000 tokens de salida (aproximado)
  const costeEstimadoUSD = (inputTokens * costeTokenEntrada) + (outputTokens * costeTokenSalida);
  
  console.log(`Coste estimado: $${costeEstimadoUSD.toFixed(6)}`);
  
  // Calcular número de PDFs procesados
  const pdfsProcessedCount = req.body.processedFiles && Array.isArray(req.body.processedFiles) 
    ? req.body.processedFiles.length 
    : 0;
    
  try {
    // Actualizamos las estadísticas del usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          'usage.tokens.input': inputTokens,
          'usage.tokens.output': outputTokens,
          'usage.tokens.total': totalTokens,
          'usage.pdfsProcessed': pdfsProcessedCount,
          'usage.estimatedCostUSD': costeEstimadoUSD
        },
        $set: {
          'usage.lastUpdated': Date.now()
        }
      },
      { new: true } // Devolver el documento actualizado
    );
    
    console.log(`Estadísticas actualizadas para ${req.user.email}:`, 
      updatedUser ? updatedUser.usage : 'Usuario no encontrado');
  } catch (err) {
    console.error(`Error actualizando estadísticas para ${req.user.email}:`, err);
  }
  
  res.status(201).json({
    success: true,
    data: queryRecord
  });
});

// @desc    Obtener el historial de consultas del usuario
// @route   GET /api/history
// @access  Private
exports.getUserHistory = asyncHandler(async (req, res, next) => {
  // Opciones de filtrado - asegurar que estamos filtrando por el usuario correcto
  // Convertir explícitamente a ObjectId para garantizar comparación segura
  const mongoose = require('mongoose');
  const userId = req.user._id;
  
  // Loggear para depuración
  console.log(`Filtrando historial de consultas para usuario ${req.user.email} (ID: ${userId})`);
  
  // Garantizamos que el tipo de datos coincida para comparación correcta
  const queryOptions = { user: new mongoose.Types.ObjectId(userId) };
  
  // Filtros opcionales
  if (req.query.queryType) {
    queryOptions.queryType = req.query.queryType;
  }
  
  if (req.query.starred) {
    queryOptions.starred = req.query.starred === 'true';
  }
  
  // Búsqueda por palabras clave
  if (req.query.keyword) {
    queryOptions.keywords = { $in: [req.query.keyword] };
  }
  
  // Rango de fechas
  if (req.query.from || req.query.to) {
    queryOptions.timestamp = {};
    
    if (req.query.from) {
      queryOptions.timestamp.$gte = new Date(req.query.from);
    }
    
    if (req.query.to) {
      queryOptions.timestamp.$lte = new Date(req.query.to);
    }
  }
  
  // Paginación
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await QueryHistory.countDocuments(queryOptions);
  
  // Opciones de ordenación (por defecto descendente por fecha)
  const sort = {};
  if (req.query.sort) {
    const parts = req.query.sort.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.timestamp = -1;
  }
  
  const history = await QueryHistory.find(queryOptions)
    .sort(sort)
    .skip(startIndex)
    .limit(limit)
    .select(req.query.fields ? req.query.fields.split(',').join(' ') : '');
  
  // Información de paginación
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: history.length,
    pagination,
    data: history
  });
});

// @desc    Obtener una consulta específica por ID
// @route   GET /api/history/:id
// @access  Private
exports.getQueryById = asyncHandler(async (req, res, next) => {
  const query = await QueryHistory.findById(req.params.id);
  
  if (!query) {
    return next(
      new ErrorResponse(`No se encontró consulta con id ${req.params.id}`, 404)
    );
  }
  
  // Verificar que el usuario sea el propietario de la consulta
  if (query.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Usuario no autorizado para acceder a esta consulta`, 403)
    );
  }
  
  res.status(200).json({
    success: true,
    data: query
  });
});

// @desc    Marcar/desmarcar una consulta como favorita
// @route   PUT /api/history/:id/star
// @access  Private
exports.toggleStarred = asyncHandler(async (req, res, next) => {
  let query = await QueryHistory.findById(req.params.id);
  
  if (!query) {
    return next(
      new ErrorResponse(`No se encontró consulta con id ${req.params.id}`, 404)
    );
  }
  
  // Verificar que el usuario sea el propietario de la consulta
  if (query.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Usuario no autorizado para modificar esta consulta`, 403)
    );
  }
  
  // Invertir el valor actual de starred
  query = await QueryHistory.findByIdAndUpdate(
    req.params.id,
    { starred: !query.starred },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: query
  });
});

// @desc    Eliminar una consulta del historial
// @route   DELETE /api/history/:id
// @access  Private
exports.deleteQuery = asyncHandler(async (req, res, next) => {
  const query = await QueryHistory.findById(req.params.id);
  
  if (!query) {
    return next(
      new ErrorResponse(`No se encontró consulta con id ${req.params.id}`, 404)
    );
  }
  
  // Verificar que el usuario sea el propietario de la consulta
  if (query.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Usuario no autorizado para eliminar esta consulta`, 403)
    );
  }
  
  // Usamos findByIdAndDelete en lugar de remove() (deprecated)
  await QueryHistory.findByIdAndDelete(query._id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Obtener estadísticas de consultas del usuario
// @route   GET /api/history/stats
// @access  Private
exports.getUserStats = asyncHandler(async (req, res, next) => {
  // Garantizar que tenemos mongoose disponible
  const mongoose = require('mongoose');
  const userId = req.user._id;
  
  console.log(`Obteniendo estadísticas para usuario ${req.user.email} (ID: ${userId})`);
  
  const stats = await QueryHistory.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: '$queryType',
        count: { $sum: 1 },
        avgTokensInput: { $avg: '$tokens.input' },
        avgTokensOutput: { $avg: '$tokens.output' },
        avgTokensTotal: { $avg: '$tokens.total' },
        totalTokensInput: { $sum: '$tokens.input' },
        totalTokensOutput: { $sum: '$tokens.output' },
        totalTokensTotal: { $sum: '$tokens.total' },
        avgProcessingTime: { $avg: '$processingTime' }
      }
    }
  ]);
  
  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Buscar consultas por texto
// @route   GET /api/history/search
// @access  Private
exports.searchQueries = asyncHandler(async (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return next(
      new ErrorResponse('Por favor proporciona un término de búsqueda', 400)
    );
  }
  
  const results = await QueryHistory.find({
    user: req.user.id,
    $or: [
      { prompt: { $regex: q, $options: 'i' } },
      { response: { $regex: q, $options: 'i' } },
      { keywords: { $in: [new RegExp(q, 'i')] } }
    ]
  }).sort({ timestamp: -1 });
  
  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});
