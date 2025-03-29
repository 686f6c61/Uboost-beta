const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const { extractPdfText } = require('../utils/pdf.utils');
const { logUserActivity } = require('../utils/activityLogger');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

/**
 * Upload a PDF file
 */
exports.uploadPdf = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const pdfFile = req.files.file;
    
    // Check if file is a PDF
    if (!pdfFile.mimetype.includes('pdf')) {
      return res.status(400).json({ success: false, message: 'File must be a PDF' });
    }

    // Usar S3 para almacenamiento en la nube
    // Importa el servicio de S3
    const { uploadFile } = require('../utils/s3Storage');
    const PDFUpload = require('../models/pdfUpload');
    
    try {
      // Subir a S3
      const fileInfo = await uploadFile(
        pdfFile.data,
        pdfFile.name,
        pdfFile.mimetype,
        req.user._id
      );
      
      // Extraer información básica del PDF - con manejo de errores robusto
      let pageCount = 0;
      let title = pdfFile.name;
      let author = 'Unknown';
      
      try {
        const pdfData = await pdfParse(pdfFile.data);
        pageCount = pdfData.numpages || 0;
        
        // Asegurarse de que info no sea null antes de acceder a sus propiedades
        if (pdfData.info) {
          title = pdfData.info.Title || pdfFile.name;
          author = pdfData.info.Author || 'Unknown';
        }
      } catch (pdfError) {
        console.warn('No se pudo analizar el PDF para metadatos:', pdfError);
        // Continuar sin información del PDF
      }
      
      // Crear un ID único para mantener compatibilidad
      const fileId = path.basename(fileInfo.storagePath).split('-')[0];
      
      // Crear registro en MongoDB usando el nuevo modelo
      const pdfUpload = new PDFUpload({
        userId: req.user._id,
        originalName: fileInfo.fileName,
        storagePath: fileInfo.storagePath,
        size: fileInfo.size,
        contentType: fileInfo.contentType,
        processingResults: {
          title: title,
          author: author,
          pageCount: pageCount
        }
      });
      
      await pdfUpload.save();
      
      // Formar la respuesta en el formato antiguo para mantener compatibilidad
      const metadata = {
        id: fileId,
        originalName: pdfFile.name,
        fileName: path.basename(fileInfo.storagePath),
        filePath: fileInfo.storagePath,
        uploadDate: new Date().toISOString(),
        pageCount: pageCount,
        fileSize: pdfFile.size,
        title: title,
        author: author,
        vectorized: false,
        userId: req.user._id.toString(),
        userEmail: req.user.email,
        // Añadir información de S3
        s3Location: fileInfo.location,
        s3StoragePath: fileInfo.storagePath
      };
      
      // Registrar actividad
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await logUserActivity({
        userId: req.user._id,
        email: req.user.email,
        action: 'pdf_upload',
        details: {
          fileId,
          fileName: pdfFile.name,
          fileSize: pdfFile.size,
          pageCount: pageCount,
          storageType: 'aws_s3'
        },
        ipAddress
      });
      
      res.status(200).json({ 
        success: true, 
        message: 'File uploaded successfully to S3', 
        data: metadata 
      });
    } catch (s3Error) {
      console.error('Error al subir a S3, fallback al método local:', s3Error);
      
      // Fallback al método antiguo si S3 falla
      // Create a unique ID for the file
      const fileId = uuidv4();
      const fileName = fileId + '.pdf';
      const filePath = path.join(UPLOADS_DIR, fileName);

      // Move the file to the uploads directory
      await pdfFile.mv(filePath);

      // Extract basic PDF info - con manejo de errores robusto
      let pageCount = 0;
      let title = pdfFile.name;
      let author = 'Unknown';
      
      try {
        const pdfData = await fs.readFile(filePath);
        const pdfInfo = await pdfParse(pdfData);
        pageCount = pdfInfo.numpages || 0;
        
        // Asegurarse de que info no sea null antes de acceder a sus propiedades
        if (pdfInfo.info) {
          title = pdfInfo.info.Title || pdfFile.name;
          author = pdfInfo.info.Author || 'Unknown';
        }
      } catch (pdfError) {
        console.warn('No se pudo analizar el PDF para metadatos:', pdfError);
        // Continuar sin información del PDF
      }

      // Create metadata for the file with user ID
      const metadata = {
        id: fileId,
        originalName: pdfFile.name,
        fileName,
        filePath,
        uploadDate: new Date().toISOString(),
        pageCount: pageCount,
        fileSize: pdfFile.size,
        title: title,
        author: author,
        vectorized: false,
        userId: req.user._id.toString(),
        userEmail: req.user.email
      };

      // Save metadata
      const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
      await fs.writeJson(metadataPath, metadata);
      
      // Registrar actividad de subida de PDF
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      await logUserActivity({
        userId: req.user._id,
        email: req.user.email,
        action: 'pdf_upload',
        details: {
          fileId,
          fileName: pdfFile.name,
          fileSize: pdfFile.size,
          pageCount,
          storageType: 'local'
        },
        ipAddress
      });

      res.status(200).json({ 
        success: true, 
        message: 'File uploaded successfully (local storage)', 
        data: metadata 
      });
    }
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * List all PDF files
 */
exports.listPdfs = async (req, res) => {
  try {
    // Ensure the uploads directory exists
    await fs.ensureDir(UPLOADS_DIR);
    
    // Get all JSON files in the uploads directory
    const files = await fs.readdir(UPLOADS_DIR);
    const metadataFiles = files.filter(file => file.endsWith('.json'));
    
    // Read all metadata files
    const metadataPromises = metadataFiles.map(async (file) => {
      try {
        const metadataPath = path.join(UPLOADS_DIR, file);
        return await fs.readJson(metadataPath);
      } catch (err) {
        console.error(`Error reading metadata file ${file}:`, err);
        return null;
      }
    });
    
    const allMetadata = await Promise.all(metadataPromises);
    const validMetadata = allMetadata.filter(metadata => metadata !== null);
    
    // Filter PDFs by user ID and sort by upload date (newest first)
    const userMetadata = validMetadata.filter(metadata => {
      // Si el PDF tiene userId, solo mostrar los del usuario actual
      if (metadata.userId) {
        return metadata.userId.toString() === req.user._id.toString();
      }
      // Para PDFs antiguos sin userId, no mostrarlos a nadie
      return false;
    });
    
    // Sort by upload date (newest first)
    userMetadata.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    res.status(200).json({ 
      success: true, 
      data: userMetadata 
    });
  } catch (error) {
    console.error('Error listing PDFs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a PDF file
 */
exports.deletePdf = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' });
    }
    
    const pdfPath = path.join(UPLOADS_DIR, fileId + '.pdf');
    const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
    const vectorStorePath = path.join(UPLOADS_DIR, fileId + '.vectors.json');
    
    // Check if the files exist
    const metadataExists = await fs.pathExists(metadataPath);
    if (!metadataExists) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Leer los metadatos para verificar que el archivo pertenece al usuario
    const metadata = await fs.readJson(metadataPath);
    
    // Verificar que el PDF pertenece al usuario actual
    if (metadata.userId && metadata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para eliminar este archivo' 
      });
    }
    
    // Delete all associated files
    await Promise.all([
      fs.remove(pdfPath),
      fs.remove(metadataPath),
      fs.pathExists(vectorStorePath).then(exists => exists ? fs.remove(vectorStorePath) : null)
    ]);
    
    res.status(200).json({ 
      success: true, 
      message: 'File deleted successfully',
      fileId 
    });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete all PDF files for a user
 */
exports.deleteAllPdfs = async (req, res) => {
  try {
    // Import the S3 storage utility
    const { deleteFile } = require('../utils/s3Storage');
    const PDFUpload = require('../models/pdfUpload');
    
    // Find all PDFs for the current user
    const userPdfs = await PDFUpload.find({ userId: req.user._id });
    
    if (userPdfs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No hay PDFs para eliminar'
      });
    }
    
    // Delete files from S3 and MongoDB in parallel
    const deletePromises = userPdfs.map(async (pdf) => {
      try {
        // Delete from S3 if it exists there
        if (pdf.storagePath) {
          await deleteFile(pdf.storagePath);
        }
        
        // Also try to delete any local files that might exist
        const localFilePath = path.join(UPLOADS_DIR, pdf._id + '.pdf');
        const metadataPath = path.join(UPLOADS_DIR, pdf._id + '.json');
        
        try {
          if (await fs.pathExists(localFilePath)) {
            await fs.remove(localFilePath);
          }
          
          if (await fs.pathExists(metadataPath)) {
            await fs.remove(metadataPath);
          }
        } catch (localError) {
          console.warn('Error al eliminar archivos locales:', localError);
          // Continue even if local files can't be deleted
        }
        
        // Delete from MongoDB
        return pdf._id;
      } catch (deleteError) {
        console.error(`Error al eliminar PDF ${pdf._id}:`, deleteError);
        return null; // Skip this one but continue with others
      }
    });
    
    const deletedIds = await Promise.all(deletePromises);
    
    // Remove all PDFs from MongoDB
    await PDFUpload.deleteMany({ userId: req.user._id });
    
    // Log activity
    await logUserActivity({
      userId: req.user._id,
      email: req.user.email,
      action: 'delete_all_pdfs',
      details: {
        count: userPdfs.length
      },
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    res.status(200).json({
      success: true,
      message: `Se eliminaron ${userPdfs.length} PDFs correctamente`,
      count: userPdfs.length
    });
  } catch (error) {
    console.error('Error al eliminar todos los PDFs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar todos los PDFs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get information about a PDF file
 */
exports.getPdfInfo = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' });
    }
    
    const metadataPath = path.join(UPLOADS_DIR, fileId + '.json');
    
    // Check if the file exists
    const metadataExists = await fs.pathExists(metadataPath);
    if (!metadataExists) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Read metadata
    const metadata = await fs.readJson(metadataPath);
    
    // Verificar que el PDF pertenece al usuario actual
    if (metadata.userId && metadata.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para acceder a este archivo' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: metadata 
    });
  } catch (error) {
    console.error('Error getting PDF info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
