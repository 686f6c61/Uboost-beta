import { useState } from 'react';

// Hook centralizado para manejar el estado del contexto
export const usePdfState = () => {
  // PDF State
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPdfs, setSelectedPdfs] = useState([]);
  
  // Storage State
  const [storageInfo, setStorageInfo] = useState({
    limitMB: 200,
    usedBytes: 0
  });

  // Search and Queries State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);

  // Tokens and Cost State
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0); 
  const [totalCostUSD, setTotalCostUSD] = useState(0);
  const [currentModel, setCurrentModel] = useState('gpt-4o-mini');
  const [pdfsProcessed, setPdfsProcessed] = useState(0);

  // Query History State
  const [queryHistory, setQueryHistory] = useState([]);
  const [selectedQueries, setSelectedQueries] = useState([]);

  // Batch Processing State
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [batchSummaries, setBatchSummaries] = useState([]);
  const [selectedBatchSummaries, setSelectedBatchSummaries] = useState([]);

  // Review Article State
  const [reviewArticle, setReviewArticle] = useState(null);
  const [reviewArticleLoading, setReviewArticleLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

  // Reset method
  const resetAllState = () => {
    console.log('Limpiando completamente el estado del contexto PDF');
    setPdfs([]);
    setSelectedPdfs([]);
    setQueryHistory([]);
    setSelectedQueries([]);
    setSearchResults(null);
    setSummary(null);
    setReviewArticle(null);
    setBatchSummaries([]);
    setSelectedBatchSummaries([]);
    setStorageInfo({
      limitMB: 200,
      usedBytes: 0
    });
    setError(null);
    setInputTokens(0);
    setOutputTokens(0);
    setTotalCostUSD(0);
    setPdfsProcessed(0);
  };

  return {
    // PDF State
    pdfs, setPdfs,
    loading, setLoading,
    error, setError,
    selectedPdfs, setSelectedPdfs,
    storageInfo, setStorageInfo,

    // Search and Queries State
    searchQuery, setSearchQuery,
    searchResults, setSearchResults,
    summary, setSummary,
    summaryLoading, setSummaryLoading,
    queryLoading, setQueryLoading,

    // Tokens and Cost State
    inputTokens, setInputTokens,
    outputTokens, setOutputTokens,
    totalCostUSD, setTotalCostUSD,
    currentModel, setCurrentModel,
    pdfsProcessed, setPdfsProcessed,

    // Query History State
    queryHistory, setQueryHistory,
    selectedQueries, setSelectedQueries,

    // Batch Processing State
    batchProcessing, setBatchProcessing,
    batchProgress, setBatchProgress,
    batchSummaries, setBatchSummaries,
    selectedBatchSummaries, setSelectedBatchSummaries,

    // Review Article State
    reviewArticle, setReviewArticle,
    reviewArticleLoading, setReviewArticleLoading,
    currentSection, setCurrentSection,

    // Reset method
    resetAllState
  };
};
