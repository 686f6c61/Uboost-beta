import apiClient from './client';

// AI Processing Services
export const processQuery = async (query, model = 'gpt-4o-mini', selectedPdfIds = [], maxTokens = 4000, temperature = 0.7) => {
  // Determinar el endpoint correcto basado en el modelo
  const isClaudeModel = model.includes('claude');
  let actualEndpoint = 'openai';
  
  if (isClaudeModel) {
    actualEndpoint = 'anthropic';
  }
  
  console.log(`Procesando consulta con modelo: ${model} a través del endpoint: /api/${actualEndpoint}/query`);
  
  const payload = {
    query,
    fileIds: selectedPdfIds.length > 0 ? selectedPdfIds : undefined,
    model: model,
    max_tokens: maxTokens,
    temperature: temperature
  };
  
  console.log('Enviando payload:', payload);
  
  const response = await apiClient.post(`/api/${actualEndpoint}/query`, payload);
  return response.data.data;
};

export const generateSummary = async (query, language = "Español", modelConfig = "gpt-4o-mini", modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }, specificFileIds = null) => {
  // Determinar qué API utilizar
  const modelName = typeof modelParams === 'string' 
    ? modelParams 
    : modelParams.model || modelConfig;
    
  const isClaudeModel = modelName.includes('claude');
  let apiEndpoint = 'openai';
  
  if (isClaudeModel) {
    apiEndpoint = 'anthropic';
  }
  
  const response = await apiClient.post(`/api/${apiEndpoint}/summary`, {
    query,
    fileIds: specificFileIds && specificFileIds.length > 0 ? specificFileIds : undefined,
    language,
    model: modelName,
    // Añadir los parámetros avanzados separados del nombre del modelo
    ...(typeof modelParams !== 'string' && {
      temperature: modelParams.temperature,
      max_tokens: modelParams.max_tokens,
      top_p: modelParams.top_p,
      frequency_penalty: modelParams.frequency_penalty,
      presence_penalty: modelParams.presence_penalty
    })
  });
  
  return response.data.data;
};

export const generateReviewArticleSection = async (
  content, 
  section, 
  prompt, 
  language = 'Español', 
  model = 'gpt-4o-mini', 
  modelParams = { temperature: 0.7, max_tokens: 4096, top_p: 1, frequency_penalty: 0, presence_penalty: 0 }
) => {
  // Determinar la API a usar
  const isClaudeModel = model.includes('claude');
  const apiEndpoint = isClaudeModel ? 'anthropic' : 'openai';
  
  const response = await apiClient.post(`/api/${apiEndpoint}/review-article-section`, {
    content,
    section,
    prompt,
    language,
    model,
    ...(typeof modelParams !== 'string' && {
      temperature: modelParams.temperature,
      max_tokens: modelParams.max_tokens,
      top_p: modelParams.top_p,
      frequency_penalty: modelParams.frequency_penalty,
      presence_penalty: modelParams.presence_penalty
    })
  });
  
  return response.data.data;
};
