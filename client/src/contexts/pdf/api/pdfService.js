import apiClient from './client';

// PDF Services
export const fetchPdfs = async () => {
  const response = await apiClient.get('/api/pdf/list');
  return response.data.data || [];
};

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post('/api/pdf/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data.data;
};

export const deletePdf = async (id) => {
  await apiClient.delete(`/api/pdf/delete/${id}`);
};

export const deleteAllPdfs = async () => {
  return await apiClient.delete('/api/pdf/delete-all');
};

// Obtener información de almacenamiento del usuario
export const getUserStorageInfo = async () => {
  const response = await apiClient.get('/api/users/storage-info');
  return response.data.data || { limitMB: 200, usedBytes: 0 };
};

export const vectorizePdf = async (id) => {
  const response = await apiClient.post('/api/openai/vectorize', {
    fileId: id
  });
  return response.data.data;
};
