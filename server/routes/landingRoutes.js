const express = require('express');
const router = express.Router();
const landingController = require('../controllers/landingController');
const contactController = require('../controllers/contactController');

// Ruta para procesar solicitudes de Early Access
router.post('/early-access', landingController.processEarlyAccess);

// Ruta para procesar el formulario de contacto
router.post('/contact', contactController.processContactForm);

module.exports = router;
