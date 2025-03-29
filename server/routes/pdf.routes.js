const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');
const { protect } = require('../middleware/auth');

// Routes for PDF operations
router.post('/upload', protect, pdfController.uploadPdf);
router.get('/list', protect, pdfController.listPdfs);
router.delete('/delete/:id', protect, pdfController.deletePdf);
router.delete('/delete-all', protect, pdfController.deleteAllPdfs); // Nueva ruta para borrar todos los PDFs
router.get('/info/:id', protect, pdfController.getPdfInfo);

module.exports = router;
