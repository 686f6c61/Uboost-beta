// Este archivo sirve como un proxy para la nueva estructura modular
// Exporta exactamente las mismas funciones y componentes que el archivo original
// para mantener la compatibilidad con el código existente

import PdfContextProvider, { 
  usePdf, 
  resetPdfContext 
} from './pdf';

// Re-exportar todo para mantener la compatibilidad
export { 
  PdfContextProvider, 
  usePdf, 
  resetPdfContext 
};

// Exportar el proveedor como default export para mantener la compatibilidad
export default PdfContextProvider;
