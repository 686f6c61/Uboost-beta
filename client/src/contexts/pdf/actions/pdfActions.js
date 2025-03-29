import * as pdfService from '../api/pdfService';

// PDF action creators
export const createPdfActions = (state) => {
  const {
    setPdfs,
    setLoading,
    setError,
    setSelectedPdfs,
    setStorageInfo
  } = state;

  // Fetch all PDFs from the server
  const fetchPdfs = async () => {
    try {
      setLoading(true);
      setError(null);
      const pdfsData = await pdfService.fetchPdfs();
      setPdfs(pdfsData || []);
    } catch (err) {
      setError('Error loading PDFs: ' + (err.response?.data?.message || err.message));
      console.error('Error fetching PDFs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload a PDF
  const uploadPdf = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const newPdf = await pdfService.uploadPdf(file);
      
      // Add the new PDF to the list
      setPdfs(prev => [...prev, newPdf]);
      return newPdf;
    } catch (err) {
      setError('Error uploading PDF: ' + (err.response?.data?.message || err.message));
      console.error('Error uploading PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a PDF
  const deletePdf = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await pdfService.deletePdf(id);
      
      // Remove the PDF from the list
      setPdfs(prev => prev.filter(pdf => pdf.id !== id));
      
      // Remove from selected PDFs if it was selected
      setSelectedPdfs(prev => prev.filter(pdfId => pdfId !== id));
    } catch (err) {
      setError('Error deleting PDF: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete all PDFs
  const deleteAllPdfs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pdfService.deleteAllPdfs();
      
      // Clear all PDFs from the list
      setPdfs([]);
      
      // Clear selected PDFs
      setSelectedPdfs([]);
      
      return response; // Retornar la respuesta para notificaciones en la UI
    } catch (err) {
      setError('Error eliminando todos los PDFs: ' + (err.response?.data?.message || err.message));
      console.error('Error eliminando todos los PDFs:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle PDF selection
  const togglePdfSelection = (id) => {
    setSelectedPdfs(prev => {
      if (prev.includes(id)) {
        return prev.filter(pdfId => pdfId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Select or deselect all PDFs
  const selectAllPdfs = (pdfs) => {
    // Si todos los PDFs ya están seleccionados, deseleccionar todos
    setSelectedPdfs(prev => {
      if (pdfs.length > 0 && pdfs.length === prev.length) {
        return [];
      } else {
        // Seleccionar todos los PDFs
        return pdfs.map(pdf => pdf.id);
      }
    });
  };

  // Vectorize a PDF for better search
  const vectorizePdf = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await pdfService.vectorizePdf(id);
      
      // Update the PDF in the list
      setPdfs(prev => prev.map(pdf => 
        pdf.id === id ? { ...pdf, vectorized: true } : pdf
      ));
      
      return true;
    } catch (err) {
      setError('Error vectorizing PDF: ' + (err.response?.data?.message || err.message));
      console.error('Error vectorizing PDF:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener información de almacenamiento del usuario
  const getUserStorageInfo = async () => {
    try {
      const storageData = await pdfService.getUserStorageInfo();
      setStorageInfo(storageData);
      return storageData;
    } catch (err) {
      setError('Error al obtener información de almacenamiento: ' + (err.response?.data?.message || err.message));
      console.error('Error al obtener información de almacenamiento:', err);
      return { limitMB: 200, usedBytes: 0 };
    }
  };

  return {
    fetchPdfs,
    uploadPdf,
    deletePdf,
    deleteAllPdfs,
    togglePdfSelection,
    selectAllPdfs,
    vectorizePdf,
    getUserStorageInfo
  };
};
