const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveQuery,
  getUserHistory,
  getQueryById,
  toggleStarred,
  deleteQuery,
  getUserStats,
  searchQueries
} = require('../controllers/queryHistory.controller');

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas principales
router.route('/')
  .get(getUserHistory)  // Obtener historial del usuario
  .post(saveQuery);     // Guardar una nueva consulta

// Búsqueda de consultas
router.route('/search')
  .get(searchQueries);

// Estadísticas de uso
router.route('/stats')
  .get(getUserStats);

// Operaciones sobre consultas específicas
router.route('/:id')
  .get(getQueryById)    // Obtener una consulta específica
  .delete(deleteQuery); // Eliminar una consulta

// Marcar/desmarcar como favorita
router.route('/:id/star')
  .put(toggleStarred);

module.exports = router;
