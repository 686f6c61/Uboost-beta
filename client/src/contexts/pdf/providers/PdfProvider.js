import React, { createContext, useContext, useEffect } from 'react';
import { usePdfState } from '../hooks/usePdfState';
import { createPdfActions } from '../actions/pdfActions';
import { createQueryHistoryActions } from '../actions/queryHistoryActions';
import { createAiActions } from '../actions/aiActions';
import { getReadableTitle } from '../utils/helpers';
import * as queryHistoryService from '../api/queryHistoryService';

// Crear el contexto
const PdfContext = createContext();

// Hook para usar el contexto
export const usePdf = () => useContext(PdfContext);

// Acción específica para reset completo del contexto que se llamará al cerrar sesión
export const resetPdfContext = (pdfContextRef) => {
  if (pdfContextRef && pdfContextRef.current) {
    // Limpiar todo el estado
    pdfContextRef.current.resetAllState();
  }
};

// Proveedor del contexto
export const PdfContextProvider = ({ children }) => {
  // Obtener el estado centralizado
  const state = usePdfState();
  
  // Crear las acciones usando el estado
  const pdfActions = createPdfActions(state);
  const queryHistoryActions = createQueryHistoryActions(state);
  const aiActions = createAiActions(state);

  // Crear una referencia global para que AuthContext pueda acceder a la función de reset
  useEffect(() => {
    window.pdfContextRef = {
      current: { resetAllState: state.resetAllState }
    };
    return () => {
      window.pdfContextRef = null;
    };
  }, [state.resetAllState]);

  // Load PDFs and query history when component mounts
  // Controlar la carga inicial de datos una sola vez
  useEffect(() => {
    // Referencia para verificar si el componente está montado
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (isMounted) {
        try {
          // Cargar PDFs, consultas e información de almacenamiento en paralelo para mayor eficiencia
          await Promise.all([
            pdfActions.fetchPdfs(),
            queryHistoryActions.fetchQueryHistory(),
            pdfActions.getUserStorageInfo()
          ]);
        } catch (error) {
          console.error('Error al cargar datos iniciales:', error);
        }
      }
    };
    
    loadInitialData();
    
    // Limpiar al desmontar
    return () => {
      isMounted = false;
    };
  // Incluimos las acciones como dependencias para que ESLint no se queje,
  // pero estas acciones no cambian durante el ciclo de vida del componente
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PdfContext.Provider value={{
      // Estados
      pdfs: state.pdfs,
      loading: state.loading,
      error: state.error,
      selectedPdfs: state.selectedPdfs,
      searchQuery: state.searchQuery,
      searchResults: state.searchResults,
      summary: state.summary,
      summaryLoading: state.summaryLoading,
      queryLoading: state.queryLoading,
      totalTokensUsed: state.inputTokens + state.outputTokens, // Calculado dinámicamente
      inputTokens: state.inputTokens,
      outputTokens: state.outputTokens,
      totalCostUSD: state.totalCostUSD,
      currentModel: state.currentModel,
      pdfsProcessed: state.pdfsProcessed,
      
      // Query History State
      queryHistory: state.queryHistory,
      selectedQueries: state.selectedQueries,
      
      // Batch Processing State
      batchProcessing: state.batchProcessing,
      batchProgress: state.batchProgress,
      batchSummaries: state.batchSummaries,
      selectedBatchSummaries: state.selectedBatchSummaries,
      
      // Review Article State
      reviewArticle: state.reviewArticle,
      reviewArticleLoading: state.reviewArticleLoading,
      currentSection: state.currentSection,

      // Acciones
      setSearchQuery: state.setSearchQuery,
      setError: state.setError,
      
      // PDF actions
      fetchPdfs: pdfActions.fetchPdfs,
      uploadPdf: pdfActions.uploadPdf,
      deletePdf: pdfActions.deletePdf,
      deleteAllPdfs: pdfActions.deleteAllPdfs,
      togglePdfSelection: pdfActions.togglePdfSelection,
      selectAllPdfs: () => pdfActions.selectAllPdfs(state.pdfs),
      vectorizePdf: pdfActions.vectorizePdf,
      getUserStorageInfo: pdfActions.getUserStorageInfo,
      
      // Query History actions
      fetchQueryHistory: queryHistoryActions.fetchQueryHistory,
      saveQueryToDatabase: queryHistoryService.saveQueryToDatabase,
      deleteQueryFromHistory: queryHistoryActions.deleteQueryFromHistory,
      clearQueryHistory: queryHistoryActions.clearQueryHistory,
      toggleQuerySelection: queryHistoryActions.toggleQuerySelection,
      
      // AI Processing actions
      processQuery: aiActions.processQuery,
      generateSummary: aiActions.generateSummary,
      clearSearchResults: aiActions.clearSearchResults,
      clearSummary: aiActions.clearSummary,
      processBatchSummaries: aiActions.processBatchSummaries,
      toggleBatchSummarySelection: aiActions.toggleBatchSummarySelection,
      clearBatchSummaries: aiActions.clearBatchSummaries,
      generateReviewArticle: aiActions.generateReviewArticle,
      clearReviewArticle: aiActions.clearReviewArticle,
      
      // Utilities
      getReadableTitle,
      resetAllState: state.resetAllState,
      
      // Storage info
      storageInfo: state.storageInfo
    }}>
      {children}
    </PdfContext.Provider>
  );
};

export default PdfContextProvider;
