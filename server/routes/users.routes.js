const express = require('express');
const { protect } = require('../middleware/auth');
const { getCurrentUser, getUserStats } = require('../controllers/users');
const { getUserStorageInfo } = require('../controllers/storageController');

const router = express.Router();

// Proteger todas las rutas
router.use(protect);

// Rutas de usuario
router.get('/me', getCurrentUser);
router.get('/me/stats', getUserStats);
router.get('/storage-info', getUserStorageInfo);

module.exports = router;
