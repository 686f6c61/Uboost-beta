import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Obtiene la lista de todos los PDFs almacenados en el servidor
 * @returns {Promise<Array>} - Lista de PDFs disponibles
 */
export const getAllPdfs = async () => {
  try {
    // Incluir token de autenticación en la solicitud si existe
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await axios.get(`${API_BASE_URL}/pdf/list`, { headers });
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener la lista de PDFs:', error);
    throw error;
  }
};

/**
 * Obtiene los metadatos de un PDF específico
 * @param {string} pdfId - ID del PDF
 * @returns {Promise<Object>} - Metadatos del PDF
 */
export const getPdfMetadata = async (pdfId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/pdf/${pdfId}/metadata`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener metadatos del PDF ${pdfId}:`, error);
    throw error;
  }
};

/**
 * Sube un nuevo PDF al servidor
 * @param {File} file - Archivo PDF a subir
 * @param {Function} onProgress - Callback para seguimiento del progreso
 * @returns {Promise<Object>} - Información del PDF subido
 */
export const uploadPdf = async (file, onProgress = () => {}) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await axios.post(`${API_BASE_URL}/pdf/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error al subir PDF:', error);
    throw error;
  }
};

/**
 * Elimina un PDF del servidor
 * @param {string} pdfId - ID del PDF a eliminar
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deletePdf = async (pdfId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/pdf/${pdfId}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar PDF ${pdfId}:`, error);
    throw error;
  }
};
