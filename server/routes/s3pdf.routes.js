const express = require('express');
const router = express.Router();
const s3pdfController = require('../controllers/s3PdfController');
const { protect } = require('../middleware/auth');

// Proteger todas las rutas de PDF con autenticación
router.use(protect);

// Rutas para los PDFs en S3
router.post('/upload', s3pdfController.uploadPdf);
router.post('/upload-alt', s3pdfController.uploadPdfWithExpress);
router.get('/list', s3pdfController.listPdfs);
router.get('/:id', s3pdfController.getPdf);
router.delete('/:id', s3pdfController.deletePdf);
router.delete('/delete-all', s3pdfController.deleteAllPdfs); // Nueva ruta para borrar todos los PDFs

module.exports = router;
