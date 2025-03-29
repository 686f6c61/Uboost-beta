const express = require('express');
const { 
  getUsers, 
  getUser, 
  updateUser, 
  approveUser, 
  pauseUser, 
  deleteUser,
  getUsersStats,
  getActivityLogs
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);
// Apply admin authorization to all routes
router.use(authorize('admin'));

// Routes
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/pause', pauseUser);
router.put('/users/:id/delete', deleteUser);

// Estadísticas de uso
router.get('/stats/usage', getUsersStats);

// Logs de actividad de usuarios
router.get('/activity-logs', getActivityLogs);

module.exports = router;
