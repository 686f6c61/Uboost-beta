const { 
  uploadPdfMiddleware, 
  uploadFile, 
  deleteFile, 
  getSignedUrl, 
  listFiles 
} = require('../utils/s3Storage');
const PDFUpload = require('../models/pdfUpload');
const { logUserActivity } = require('../utils/activityLogger');
const pdfParse = require('pdf-parse');
const User = require('../models/user');

/**
 * @desc    Subir un archivo PDF a AWS S3
 * @route   POST /api/s3pdf/upload
 * @access  Private
 */
exports.uploadPdf = async (req, res) => {
  try {
    // Usar el middleware de S3 para procesar la subida
    uploadPdfMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Error en middleware de S3:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'Error al subir el archivo'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Por favor, adjunta un archivo PDF'
        });
      }
      
      // Verificar el límite de almacenamiento del usuario
      const user = await User.findById(req.user._id);
      const fileSize = req.file.size;
      const currentUsage = user.storage?.usedBytes || 0;
      const storageLimitBytes = (user.storage?.limitMB || 200) * 1024 * 1024; // Convertir MB a bytes
      
      if (currentUsage + fileSize > storageLimitBytes) {
        return res.status(400).json({
          success: false,
          message: `Has excedido tu límite de almacenamiento de ${user.storage?.limitMB || 200} MB. Por favor, elimina algunos archivos antes de subir más.`,
          currentUsage: Math.round(currentUsage / (1024 * 1024) * 10) / 10, // MB con 1 decimal
          limit: user.storage?.limitMB || 200,
          remaining: Math.round((storageLimitBytes - currentUsage) / (1024 * 1024) * 10) / 10 // MB con 1 decimal
        });
      }

      try {
        // Obtener el contenido del PDF para análisis básico
        const pdfBuffer = req.file.buffer; // Si está disponible
        let pageCount = 0;
        let title = '';
        
        try {
          // Intentar extraer información básica del PDF si está disponible el buffer
          if (pdfBuffer) {
            const pdfData = await pdfParse(pdfBuffer);
            pageCount = pdfData.numpages;
            title = pdfData.info?.Title || '';
          }
        } catch (pdfError) {
          console.warn('No se pudo analizar el PDF para metadatos:', pdfError);
          // Continuar sin información del PDF
        }
  
        // Crear registro en la base de datos
        const pdfUpload = new PDFUpload({
          userId: req.user._id,
          originalName: req.file.originalname,
          storagePath: req.file.key,
          size: req.file.size,
          contentType: req.file.mimetype,
          processingResults: {
            title: title || req.file.originalname,
            pageCount
          }
        });
  
        await pdfUpload.save();
  
        // Actualizar contador de PDFs y uso de almacenamiento del usuario
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { 
            pdfsProcessed: 1,
            'storage.usedBytes': req.file.size 
          },
          $push: {
            'storage.history': {
              timestamp: new Date(),
              action: 'upload',
              bytes: req.file.size,
              fileName: req.file.originalname,
              fileId: pdfUpload._id
            }
          }
        });
  
        // Registrar actividad
        await logUserActivity({
          userId: req.user._id,
          email: req.user.email,
          action: 'pdf_upload',
          details: {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            storageType: 'aws_s3'
          },
          ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });
  
        // Generar URL firmada para acceso inmediato (15 minutos)
        const signedUrl = getSignedUrl(req.file.key, 900);
  
        res.status(200).json({
          success: true,
          message: 'PDF subido correctamente',
          data: {
            id: pdfUpload._id,
            fileName: req.file.originalname,
            storagePath: req.file.key,
            signedUrl,
            size: req.file.size,
            uploadDate: pdfUpload.uploadDate
          }
        });
      } catch (error) {
        console.error('Error al procesar la subida:', error);
        res.status(500).json({
          success: false,
          message: 'Error al procesar el archivo',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });
  } catch (error) {
    console.error('Error general en uploadPdf:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Subir un archivo PDF a AWS S3 usando express-fileupload
 * @route   POST /api/s3pdf/upload-alt
 * @access  Private
 * @note    Método alternativo que usa express-fileupload en lugar de multer
 */
exports.uploadPdfWithExpress = async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, adjunta un archivo PDF'
      });
    }
    
    const file = req.files.pdf;
    
    // Verificar que sea un PDF
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'El archivo debe ser un PDF'
      });
    }
    
    // Subir a S3
    const fileInfo = await uploadFile(
      file.data,
      file.name,
      file.mimetype,
      req.user._id
    );
    
    // Extraer información básica del PDF
    let pageCount = 0;
    let title = '';
    
    try {
      const pdfData = await pdfParse(file.data);
      pageCount = pdfData.numpages;
      title = pdfData.info?.Title || '';
    } catch (pdfError) {
      console.warn('No se pudo analizar el PDF para metadatos:', pdfError);
      // Continuar sin información del PDF
    }
    
    // Crear registro en MongoDB
    const pdfUpload = new PDFUpload({
      userId: req.user._id,
      originalName: fileInfo.fileName,
      storagePath: fileInfo.storagePath,
      size: fileInfo.size,
      contentType: fileInfo.contentType,
      processingResults: {
        title: title || fileInfo.fileName,
        pageCount
      }
    });
    
    await pdfUpload.save();
    
    // Actualizar contador de PDFs del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { pdfsProcessed: 1 }
    });
    
    // Registrar actividad
    await logUserActivity({
      userId: req.user._id,
      email: req.user.email,
      action: 'pdf_upload',
      details: {
        fileName: fileInfo.fileName,
        fileSize: fileInfo.size,
        storageType: 'aws_s3'
      },
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    // Generar URL firmada
    const signedUrl = getSignedUrl(fileInfo.storagePath, 900);
    
    res.status(200).json({
      success: true,
      message: 'PDF subido correctamente',
      data: {
        id: pdfUpload._id,
        fileName: fileInfo.fileName,
        storagePath: fileInfo.storagePath,
        signedUrl,
        size: fileInfo.size,
        uploadDate: pdfUpload.uploadDate
      }
    });
  } catch (error) {
    console.error('Error al subir PDF con express-fileupload:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar el archivo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Obtener lista de PDFs subidos por el usuario
 * @route   GET /api/s3pdf/list
 * @access  Private
 */
exports.listPdfs = async (req, res) => {
  try {
    const pdfs = await PDFUpload.find({ userId: req.user._id })
      .sort({ uploadDate: -1 });
    
    // Mapear los resultados y generar URLs firmadas
    const pdfsWithUrls = pdfs.map(pdf => {
      // Generar URL firmada por 15 minutos (900 segundos)
      const signedUrl = pdf.storagePath ? getSignedUrl(pdf.storagePath, 900) : null;
      
      return {
        id: pdf._id,
        fileName: pdf.originalName,
        uploadDate: pdf.uploadDate,
        size: pdf.size,
        signedUrl,
        processingResults: pdf.processingResults
      };
    });
    
    res.status(200).json({
      success: true,
      count: pdfs.length,
      data: pdfsWithUrls
    });
  } catch (error) {
    console.error('Error al listar PDFs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la lista de PDFs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Obtener información y URL de acceso para un PDF específico
 * @route   GET /api/s3pdf/:id
 * @access  Private
 */
exports.getPdf = async (req, res) => {
  try {
    // Buscar el PDF en la base de datos
    const upload = await PDFUpload.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'PDF no encontrado'
      });
    }
    
    // Actualizar contador de descargas y última fecha de acceso
    upload.downloadCount += 1;
    upload.lastAccessDate = Date.now();
    await upload.save();
    
    // Generar URL firmada (60 minutos = 3600 segundos)
    const signedUrl = getSignedUrl(upload.storagePath, 3600);
    
    // Registrar actividad
    await logUserActivity({
      userId: req.user._id,
      email: req.user.email,
      action: 'pdf_access',
      details: {
        fileName: upload.originalName,
        fileId: upload._id
      },
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    res.status(200).json({
      success: true,
      data: {
        id: upload._id,
        fileName: upload.originalName,
        signedUrl,
        size: upload.size,
        uploadDate: upload.uploadDate,
        lastAccessDate: upload.lastAccessDate,
        downloadCount: upload.downloadCount,
        processed: upload.processed,
        processingResults: upload.processingResults
      }
    });
  } catch (error) {
    console.error('Error al obtener PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Eliminar un PDF
 * @route   DELETE /api/s3pdf/:id
 * @access  Private
 */
exports.deletePdf = async (req, res) => {
  try {
    const upload = await PDFUpload.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'PDF no encontrado'
      });
    }
    
    // Eliminar de S3
    await deleteFile(upload.storagePath);
    
    // Eliminar registro de la base de datos
    await PDFUpload.findByIdAndDelete(upload._id);
    
    // Actualizar uso de almacenamiento del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'storage.usedBytes': -upload.size },
      $push: {
        'storage.history': {
          timestamp: new Date(),
          action: 'delete',
          bytes: -upload.size,
          fileName: upload.originalName,
          fileId: upload._id
        }
      }
    });
    
    // Registrar actividad
    await logUserActivity({
      userId: req.user._id,
      email: req.user.email,
      action: 'pdf_delete',
      details: {
        fileName: upload.originalName,
        fileId: upload._id
      },
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    
    res.status(200).json({
      success: true,
      message: 'PDF eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Eliminar todos los PDFs de un usuario
 * @route   DELETE /api/s3pdf/delete-all
 * @access  Private
 */
exports.deleteAllPdfs = async (req, res) => {
  try {
    // Buscar todos los PDFs del usuario actual
    const userPdfs = await PDFUpload.find({ userId: req.user._id });
    
    if (userPdfs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No hay PDFs para eliminar'
      });
    }
    
    // Eliminar archivos de S3 y MongoDB en paralelo
    const deletePromises = userPdfs.map(async (pdf) => {
      try {
        // Eliminar de S3 si existe allí
        if (pdf.storagePath) {
          await deleteFile(pdf.storagePath);
        }
        
        return pdf._id;
      } catch (deleteError) {
        console.error(`Error al eliminar PDF ${pdf._id} de S3:`, deleteError);
        return null; // Omitir este pero continuar con otros
      }
    });
    
    await Promise.all(deletePromises);
    
    // Calcular el total de bytes eliminados
    const totalBytesDeleted = userPdfs.reduce((total, pdf) => total + (pdf.size || 0), 0);
    
    // Eliminar todos los PDFs de MongoDB
    await PDFUpload.deleteMany({ userId: req.user._id });
    
    // Actualizar uso de almacenamiento del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'storage.usedBytes': 0 },
      $push: {
        'storage.history': {
          timestamp: new Date(),
          action: 'delete_all',
          bytes: -totalBytesDeleted,
          fileName: 'multiple',
          fileId: 'batch-delete'
        }
      }
    });
    
    // Registrar actividad
    await logUserActivity({
      userId: req.user._id,
      email: req.user.email,
      action: 'delete_all_pdfs',
      details: {
        count: userPdfs.length,
        storageType: 'aws_s3'
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
