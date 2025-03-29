const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const crypto = require('crypto');

// Configurar AWS con credenciales desde variables de entorno
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'eu-west-1'
});

// Crear instancia de S3
const s3 = new AWS.S3();

// Nombre del bucket desde variables de entorno
const bucketName = process.env.AWS_S3_BUCKET_NAME;

// Verificar que el nombre del bucket esté definido
if (!bucketName) {
  console.error('ERROR: AWS_S3_BUCKET_NAME no está definido en las variables de entorno');
  console.log('Usando nombre de bucket por defecto para desarrollo: "uboost-pdf-storage"');
}

/**
 * Genera un nombre de archivo único para S3
 * @param {Object} file - Objeto de archivo
 * @param {String} userId - ID del usuario
 * @returns {String} - Ruta del archivo en S3
 */
const generateUniqueFileName = (file, userId) => {
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(file.originalname);
  const sanitizedName = path.basename(file.originalname, extension)
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 30); // Limitar longitud del nombre original
  
  return `pdfs/${userId}/${timestamp}-${randomStr}-${sanitizedName}${extension}`;
};

/**
 * Middleware de multer para subir archivos a S3
 */
const uploadPdfMiddleware = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName || 'uboost-pdf-storage',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        userId: req.user._id.toString(),
        originalName: file.originalname,
        uploadTime: Date.now().toString()
      });
    },
    key: (req, file, cb) => {
      const filePath = generateUniqueFileName(file, req.user._id);
      cb(null, filePath);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
}).single('pdf'); // 'pdf' es el nombre del campo del formulario

/**
 * Sube un archivo a S3 programáticamente
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {String} fileName - Nombre del archivo
 * @param {String} mimeType - Tipo MIME del archivo
 * @param {String} userId - ID del usuario
 * @returns {Promise<Object>} - Información del archivo subido
 */
const uploadFile = async (fileBuffer, fileName, mimeType, userId) => {
  try {
    const key = generateUniqueFileName({ originalname: fileName }, userId);
    
    const params = {
      Bucket: bucketName || 'uboost-pdf-storage',
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'private',
      Metadata: {
        userId: userId.toString(),
        originalName: fileName,
        uploadTime: Date.now().toString()
      }
    };
    
    const result = await s3.upload(params).promise();
    
    return {
      fileName,
      storagePath: key,
      location: result.Location,
      size: fileBuffer.length,
      contentType: mimeType,
      etag: result.ETag,
      userId,
      uploadDate: new Date()
    };
  } catch (error) {
    console.error('Error en uploadFile:', error);
    throw error;
  }
};

/**
 * Elimina un archivo de S3
 * @param {String} key - Clave del objeto en S3
 * @returns {Promise<Object>} - Resultado de la operación
 */
const deleteFile = async (key) => {
  try {
    const params = {
      Bucket: bucketName || 'uboost-pdf-storage',
      Key: key
    };
    
    return await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error al eliminar archivo de S3:', error);
    throw error;
  }
};

/**
 * Genera una URL firmada para acceso temporal
 * @param {String} key - Clave del objeto en S3
 * @param {Number} expiresInSeconds - Segundos que la URL será válida
 * @returns {String} - URL firmada
 */
const getSignedUrl = (key, expiresInSeconds = 3600) => {
  try {
    const params = {
      Bucket: bucketName || 'uboost-pdf-storage',
      Key: key,
      Expires: expiresInSeconds
    };
    
    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('Error al generar URL firmada:', error);
    throw error;
  }
};

/**
 * Lista todos los archivos en un prefijo específico
 * @param {String} prefix - Prefijo para listar (por ejemplo, 'pdfs/user123/')
 * @returns {Promise<Array>} - Lista de objetos
 */
const listFiles = async (prefix) => {
  try {
    const params = {
      Bucket: bucketName || 'uboost-pdf-storage',
      Prefix: prefix
    };
    
    const data = await s3.listObjectsV2(params).promise();
    return data.Contents;
  } catch (error) {
    console.error('Error al listar archivos de S3:', error);
    throw error;
  }
};

module.exports = {
  s3,
  uploadPdfMiddleware,
  uploadFile,
  deleteFile,
  getSignedUrl,
  listFiles,
  generateUniqueFileName
};
