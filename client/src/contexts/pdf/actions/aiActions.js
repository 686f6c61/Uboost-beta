import * as aiService from '../api/aiService';
import * as queryHistoryService from '../api/queryHistoryService';
import { calculateCost } from '../utils/helpers';

// AI Processing actions
export const createAiActions = (state) => {
  const {
    setSearchResults,
    setSummary,
    setReviewArticle,
    setCurrentSection,
    setSummaryLoading,
    setQueryLoading,
    setReviewArticleLoading,
    setError,
    // Seguimiento de tokens y coste
    setInputTokens,
    setOutputTokens,
    setTotalCostUSD,
    setPdfsProcessed,
    setCurrentModel,
    // Batch processing
    setBatchProcessing,
    setBatchProgress,
    setBatchSummaries
  } = state;

  // Process a query using AI
  const processQuery = async (query, model = 'gpt-4o-mini', selectedPdfIds = [], maxTokens = 4000, temperature = 0.7, apiEndpoint = 'openai') => {
    // Incrementar contador de PDFs procesados cuando hay PDFs seleccionados
    const pdfIdsToUse = selectedPdfIds.length > 0 ? selectedPdfIds : state.selectedPdfs;
    if (pdfIdsToUse.length > 0) {
      setPdfsProcessed(prev => prev + pdfIdsToUse.length);
    }
    
    // Actualizar el modelo actual para cálculos de coste
    setCurrentModel(model);
    
    try {
      setQueryLoading(true);
      setError(null);
      
      const responseData = await aiService.processQuery(query, model, pdfIdsToUse, maxTokens, temperature);
      
      // Variables para tokens (por defecto cero si no hay información)
      let newInputTokens = 0;
      let newOutputTokens = 0;
      let totalTokens = 0;
      
      // Actualizar contador de tokens si la respuesta incluye información de uso
      if (responseData.tokenUsage) {
        const { promptTokens, completionTokens, totalTokens: respTotalTokens } = responseData.tokenUsage;
        
        // Convertir a números y asegurar que no son NaN
        newInputTokens = Number(promptTokens) || 0;
        newOutputTokens = Number(completionTokens) || 0;
        totalTokens = respTotalTokens;
        
        // Actualizar los tokens de entrada y salida
        setInputTokens(prev => prev + newInputTokens);
        setOutputTokens(prev => prev + newOutputTokens);
        
        // Calcular coste basado en el modelo actual
        const coste = calculateCost(model, newInputTokens, newOutputTokens);
        setTotalCostUSD(prev => prev + coste);
        
        console.log(`Tokens: ${newInputTokens} entrada, ${newOutputTokens} salida, ${totalTokens} total. Coste: $${coste.toFixed(6)}`);
      }
      
      // Preparar datos para guardar en base de datos
      const queryData = {
        queryType: 'simple_query',
        prompt: query,
        promptType: 'custom',
        model,
        configuration: {
          temperature,
          maxTokens
        },
        tokens: {
          input: newInputTokens,
          output: newOutputTokens,
          total: totalTokens
        },
        processingTime: new Date() - new Date(Date.now()),
        processedFiles: pdfIdsToUse.length > 0 ? 
          pdfIdsToUse.map(id => {
            const pdf = state.pdfs.find(p => p.id === id);
            return pdf ? {
              filename: pdf.filename,
              fileSize: pdf.fileSize || 0,
              pageCount: pdf.pageCount || 0
            } : { filename: id }
          }) : [],
        response: responseData.content || responseData.response || '',
        keywords: [query.split(' ').slice(0, 5).join(' ')],
        starred: false
      };
      
      // Guardar en MongoDB
      await queryHistoryService.saveQueryToDatabase(queryData);
      
      setSearchResults(responseData);
      return responseData;
    } catch (err) {
      console.error('Error procesando consulta:', err.response || err);
      
      // Mensaje de error más informativo
      let errorMessage = 'Error al procesar la consulta';
      
      if (err.response) {
        // El servidor respondió con un código de estado que cae fuera del rango de 2xx
        errorMessage += `: ${err.response.status} ${err.response.statusText}`;
        if (err.response.data && err.response.data.message) {
          errorMessage += ` - ${err.response.data.message}`;
        }
      } else if (err.request) {
        // La petición fue hecha pero no se recibió respuesta
        errorMessage += ': No se recibió respuesta del servidor';
      } else {
        // Algo ocurrió al configurar la petición
        errorMessage += `: ${err.message}`;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setQueryLoading(false);
    }
  };

  // Generate a summary using AI
  const generateSummary = async (query, language = "Español", modelConfig = "gpt-4o-mini", modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }, specificFileIds = null) => {
    // Actualizar el modelo actual para cálculos de coste
    setCurrentModel(modelConfig);
    
    // Usar los IDs de archivo específicos si se proporcionan, de lo contrario usar selectedPdfs
    const fileIdsToUse = specificFileIds || state.selectedPdfs;
    
    // Incrementar contador de PDFs procesados cuando hay PDFs seleccionados
    if (fileIdsToUse.length > 0) {
      setPdfsProcessed(prev => prev + fileIdsToUse.length);
    }
    try {
      setSummaryLoading(true);
      setError(null);
      
      // Si modelParams es un string (para compatibilidad con versiones anteriores), convertirlo a objeto
      const modelName = typeof modelParams === 'string' 
        ? modelParams 
        : modelParams.model || modelConfig;
      
      const responseData = await aiService.generateSummary(query, language, modelName, modelParams, fileIdsToUse);
      
      // Variables para tokens (por defecto cero si no hay información)
      let newInputTokens = 0;
      let newOutputTokens = 0;
      let totalTokens = 0;
      
      // Actualizar contador de tokens si la respuesta incluye información de uso
      if (responseData.tokenUsage) {
        const { promptTokens, completionTokens, totalTokens: respTotalTokens } = responseData.tokenUsage;
        
        // Convertir a números y asegurar que no son NaN
        newInputTokens = Number(promptTokens) || 0;
        newOutputTokens = Number(completionTokens) || 0;
        totalTokens = respTotalTokens;
        
        // Actualizar los tokens de entrada y salida
        setInputTokens(prev => prev + newInputTokens);
        setOutputTokens(prev => prev + newOutputTokens);
        
        // Calcular coste basado en el modelo actual
        const coste = calculateCost(modelName, newInputTokens, newOutputTokens);
        setTotalCostUSD(prev => prev + coste);
        
        console.log(`Tokens: ${newInputTokens} entrada, ${newOutputTokens} salida, ${totalTokens} total. Coste: $${coste.toFixed(6)}`);
      }
      
      // Preparar datos para guardar en base de datos
      const queryData = {
        queryType: 'structured_summary',
        prompt: query,
        promptType: modelParams.useDefaultPrompt ? 'default_uboost' : 'custom',
        model: modelName,
        configuration: {
          temperature: modelParams.temperature,
          maxTokens: modelParams.max_tokens,
          topP: modelParams.top_p,
          frequencyPenalty: modelParams.frequency_penalty,
          presencePenalty: modelParams.presence_penalty,
          language
        },
        tokens: {
          input: newInputTokens,
          output: newOutputTokens,
          total: totalTokens
        },
        processingTime: new Date() - new Date(Date.now()),
        processedFiles: fileIdsToUse.length > 0 ? 
          fileIdsToUse.map(id => {
            const pdf = state.pdfs.find(p => p.id === id);
            return pdf ? {
              filename: pdf.filename,
              fileSize: pdf.fileSize || 0,
              pageCount: pdf.pageCount || 0
            } : { filename: id }
          }) : [],
        response: responseData.summary || '',
        keywords: query.split(/\s+/).filter(word => word.length > 3).slice(0, 10),
        starred: false
      };
      
      // Guardar en MongoDB
      await queryHistoryService.saveQueryToDatabase(queryData);
      
      setSummary(responseData);
      return responseData;
    } catch (err) {
      setError('Error generating summary: ' + (err.response?.data?.message || err.message));
      console.error('Error generating summary:', err);
      throw err;
    } finally {
      setSummaryLoading(false);
    }
  };

  // Clear search results
  const clearSearchResults = () => {
    setSearchResults(null);
  };

  // Clear summary
  const clearSummary = () => {
    setSummary(null);
  };

  // Procesar PDFs en lote secuencialmente
  const processBatchSummaries = async (language = 'Español', model = 'gpt-4o-mini', modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }) => {
    if (state.selectedPdfs.length === 0) {
      setError('Por favor, selecciona al menos un PDF para procesar');
      return;
    }

    try {
      setBatchProcessing(true);
      setBatchProgress({ current: 0, total: state.selectedPdfs.length });
      setBatchSummaries([]);
      setError(null);

      const summaries = [];

      // Procesar cada PDF secuencialmente
      for (let i = 0; i < state.selectedPdfs.length; i++) {
        const pdfId = state.selectedPdfs[i];
        setBatchProgress({ current: i + 1, total: state.selectedPdfs.length });
        
        // Encontrar información del PDF actual
        const currentPdf = state.pdfs.find(pdf => pdf.id === pdfId);
        
        try {
          // Generar resumen para este PDF específico
          const response = await generateSummary(
            'Genera un resumen estructurado del documento', 
            language, 
            model, 
            modelParams,
            [pdfId] // Enviamos solo el ID del PDF actual
          );
          
          summaries.push({
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: response.summary,
            timestamp: new Date().toISOString()
          });
          
          // Actualizar la lista de resúmenes después de cada procesamiento exitoso
          setBatchSummaries(prev => [...prev, {
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: response.summary,
            timestamp: new Date().toISOString()
          }]);
          
        } catch (err) {
          // Continuar con el siguiente PDF incluso si hay error
          console.error(`Error procesando PDF ${pdfId}:`, err);
          summaries.push({
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: `Error al procesar este PDF: ${err.message}`,
            error: true,
            timestamp: new Date().toISOString()
          });
          
          setBatchSummaries(prev => [...prev, {
            id: pdfId,
            filename: currentPdf?.filename || `PDF ${pdfId}`,
            content: `Error al procesar este PDF: ${err.message}`,
            error: true,
            timestamp: new Date().toISOString()
          }]);
        }
      }

      return summaries;
    } catch (err) {
      setError('Error en el procesamiento por lotes: ' + err.message);
      console.error('Error en procesamiento por lotes:', err);
    } finally {
      setBatchProcessing(false);
    }
  };

  // Generar un artículo de revisión a partir de los resúmenes seleccionados
  const generateReviewArticle = async (language = 'Español', model = 'gpt-4o-mini', modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }, specificInstructions = '') => {
    if (state.selectedBatchSummaries.length === 0) {
      setError('Por favor, selecciona al menos un resumen para el artículo de revisión');
      return;
    }

    try {
      setReviewArticleLoading(true);
      setError(null);
      
      // Obtener los resúmenes seleccionados
      const selectedSummaries = state.batchSummaries.filter(summary => 
        state.selectedBatchSummaries.includes(summary.id)
      );
      
      if (selectedSummaries.length === 0) {
        throw new Error('No se encontraron los resúmenes seleccionados');
      }
      
      // Combinar todos los contenidos de los resúmenes
      const combinedContent = selectedSummaries.map(summary => {
        return `--- DOCUMENTO: ${summary.filename} ---\n\n${summary.content}\n\n`;
      }).join('\n');
      
      // Secciones del artículo de revisión
      const sections = [
        {
          title: "Abstract, título y referencias",
          prompt: "Genera un resumen académico (abstract), título científico adecuado y lista de referencias principales para un artículo de revisión basado en los siguientes documentos científicos. El título debe ser específico y describir con precisión el tema central de revisión. El abstract debe ser conciso (250 palabras máximo) y seguir estructura IMRAD. Las referencias deben estar en formato APA."
        },
        {
          title: "Introducción y antecedentes",
          prompt: "Redacta una introducción completa para un artículo de revisión científica basado en los siguientes documentos. Incluye: 1) Contextualización del tema, 2) Relevancia y justificación, 3) Estado actual del conocimiento, 4) Vacíos o controversias en la literatura, 5) Objetivos claros de la revisión. Usa un estilo académico formal con referencias en formato APA."
        },
        {
          title: "Metodología",
          prompt: "Describe detalladamente la metodología utilizada en esta revisión científica basada en los siguientes documentos. Incluye: 1) Estrategia de búsqueda bibliográfica, 2) Criterios de inclusión/exclusión, 3) Método de análisis y síntesis de la información, 4) Características de los estudios incluidos. Usa formato académico y escribe como si fuera la sección de metodología de un artículo de revisión sistemática."
        },
        {
          title: "Datos y resultados",
          prompt: "Sintetiza y presenta los principales resultados encontrados en estos documentos científicos para un artículo de revisión. Organiza los hallazgos de manera lógica por temas o categorías relevantes. Incluye datos cuantitativos cuando sea posible (estadísticas, tendencias, porcentajes). Presenta los resultados de manera objetiva sin interpretación. Utiliza tablas o estructuras organizadas para resumir hallazgos cuando sea apropiado. Cita apropiadamente en formato APA."
        },
        {
          title: "Discusión y conclusiones",
          prompt: "Desarrolla una discusión científica completa para un artículo de revisión basado en los documentos proporcionados. Incluye: 1) Interpretación crítica de los hallazgos principales, 2) Comparación con el conocimiento previo, 3) Implicaciones teóricas y prácticas, 4) Limitaciones de los estudios revisados, 5) Direcciones futuras de investigación, 6) Conclusiones generales que respondan a los objetivos de la revisión. Mantén un estilo académico riguroso con referencias APA."
        },
        {
          title: "Evaluación global",
          prompt: "Proporciona una evaluación crítica general sobre el conjunto de documentos revisados. Analiza: 1) Calidad metodológica general, 2) Fortalezas y debilidades de la evidencia colectiva, 3) Consistencia o contradicciones entre estudios, 4) Relevancia para la teoría y práctica actual, 5) Recomendaciones fundamentadas para investigadores y profesionales. Finaliza con una valoración integral del estado del conocimiento en este campo específico."
        }
      ];
      
      // Artículo completo
      let fullArticle = '';
      
      // Procesar cada sección secuencialmente
      for (const section of sections) {
        try {
          // Actualizar la sección actual que se está procesando
          setCurrentSection(section.title);
          // Preparar el prompt incluyendo las instrucciones específicas si existen
          let enhancedPrompt = section.prompt;
          if (specificInstructions && specificInstructions.length > 0) {
            enhancedPrompt = `${section.prompt}\n\nCONSIDERACIONES ESPECÍFICAS: ${specificInstructions}`;
          }
          
          const response = await aiService.generateReviewArticleSection(
            combinedContent,
            section.title,
            enhancedPrompt,
            language,
            model,
            modelParams
          );
          
          // Agregar la sección al artículo completo
          fullArticle += `## ${section.title}\n\n${response.content}\n\n`;
          
          // Actualizar contador de tokens
          if (response.tokenUsage) {
            const { promptTokens, completionTokens } = response.tokenUsage;
            const newInputTokens = Number(promptTokens) || 0;
            const newOutputTokens = Number(completionTokens) || 0;
            
            setInputTokens(prev => prev + newInputTokens);
            setOutputTokens(prev => prev + newOutputTokens);
            
            const coste = calculateCost(model, newInputTokens, newOutputTokens);
            setTotalCostUSD(prev => prev + coste);
          }
        } catch (err) {
          console.error(`Error generando sección "${section.title}":`, err);
          fullArticle += `## ${section.title}\n\n**Error generando esta sección: ${err.message}**\n\n`;
        }
      }
      
      // Guardar el artículo completo en el estado con el formato esperado por ReviewArticleDisplay
      setReviewArticle({
        content: fullArticle,
        timestamp: Date.now(),
        id: `review-${Date.now()}`,
        model: model
      });
      
      // Guardar en el historial como una consulta especial
      await queryHistoryService.saveQueryToDatabase({
        queryType: 'review_article',
        prompt: `Artículo de revisión basado en ${selectedSummaries.length} documentos`,
        promptType: 'default_uboost',
        model,
        configuration: {
          language,
          ...(typeof modelParams !== 'string' && modelParams)
        },
        response: fullArticle,
        // Registrar los tokens utilizados para el cálculo correcto de costes
        tokensUsed: {
          input: state.inputTokens,
          output: state.outputTokens,
          total: state.inputTokens + state.outputTokens
        },
        processedFiles: selectedSummaries.map(summary => ({
          filename: summary.filename,
          id: summary.id
        }))
      });
      
      return fullArticle;
    } catch (err) {
      setError('Error generando artículo de revisión: ' + err.message);
      console.error('Error generating review article:', err);
    } finally {
      setReviewArticleLoading(false);
      setCurrentSection(null);
    }
  };

  // Limpiar artículo de revisión
  const clearReviewArticle = () => {
    setReviewArticle(null);
    setCurrentSection(null);
  };

  // Toggle batch summary selection
  const toggleBatchSummarySelection = (id) => {
    state.setSelectedBatchSummaries(prev => {
      if (prev.includes(id)) {
        return prev.filter(summaryId => summaryId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Clear batch summaries
  const clearBatchSummaries = () => {
    setBatchSummaries([]);
    state.setSelectedBatchSummaries([]);
  };

  return {
    processQuery,
    generateSummary,
    clearSearchResults,
    clearSummary,
    processBatchSummaries,
    toggleBatchSummarySelection,
    clearBatchSummaries,
    generateReviewArticle,
    clearReviewArticle
  };
};
