// Utility functions for PDF Context

// Calcular coste basado en tokens utilizados y modelo
export const calculateCost = (model, inputTokens, outputTokens) => {
  // Precios en USD por millón de tokens
  const prices = {
    'gpt-4o': {
      input: 2.50 / 1000000,      // $2.50 por millón de tokens de entrada
      cachedInput: 1.25 / 1000000, // $1.25 por millón de tokens de entrada en caché
      output: 10.00 / 1000000     // $10.00 por millón de tokens de salida
    },
    'gpt-4o-mini': {
      input: 0.15 / 1000000,      // $0.15 por millón de tokens de entrada
      cachedInput: 0.075 / 1000000, // $0.075 por millón de tokens de entrada en caché
      output: 0.60 / 1000000      // $0.60 por millón de tokens de salida
    },
    'claude-3-7-sonnet-20250219': {
      input: 3.00 / 1000000,        // $3.00 por millón de tokens de entrada
      cachedInputWrite: 3.75 / 1000000, // $3.75 por millón de tokens de entrada en caché (escritura)
      cachedInputRead: 0.30 / 1000000,  // $0.30 por millón de tokens de entrada en caché (lectura)
      cachedInput: 0.30 / 1000000,   // $0.30 por millón de tokens en caché (usamos el precio de lectura por defecto)
      output: 15.00 / 1000000       // $15.00 por millón de tokens de salida
    },
  };

  // Usar el modelo por defecto si el proporcionado no está en la lista
  const modelPrices = prices[model] || prices['gpt-4o-mini'];
  
  // Para el cálculo, usamos el precio estándar de entrada (no caché)
  // En una implementación más avanzada, se podría determinar si fue caché de lectura o escritura
  const inputCost = inputTokens * modelPrices.input;
  const outputCost = outputTokens * modelPrices.output;
  
  return inputCost + outputCost;
};

// Generate a readable title for a PDF
export const getReadableTitle = (pdf) => {
  if (!pdf) return '';
  
  // Si el nombre del archivo tiene un nombre descriptivo (no solo un UUID), usarlo
  if (pdf.filename && !pdf.filename.match(/^PDF [a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
    // Eliminar la extensión .pdf si existe
    return pdf.filename.replace(/\.pdf$/i, '');
  }
  
  // Si hay título de metadatos, usarlo
  if (pdf.metadata && pdf.metadata.title) {
    return pdf.metadata.title;
  }
  
  // Crear un título más amigable basado en la fecha de subida
  const uploadDate = pdf.createdAt ? new Date(pdf.createdAt) : new Date();
  const formattedDate = uploadDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return `Documento PDF (${formattedDate})`;
};

// Generate search keywords from tokens
export const getSearchKeywords = (text) => {
  if (!text) return [];
  
  return text.split(/\s+/)
    .filter(word => word.length > 2)
    .map(word => word.toLowerCase());
};
