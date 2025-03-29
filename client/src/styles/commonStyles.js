/**
 * Estilos comunes para la aplicación UBoost
 * Este archivo centraliza los estilos utilizados en múltiples componentes
 * para mantener la consistencia visual en toda la aplicación.
 */

/**
 * Obtiene los estilos comunes para botones y componentes de la aplicación
 * @returns {Object} - Objeto con los estilos comunes
 */
export const getCommonStyles = () => {
  return {
    // Estilos para botones de acción principales
    actionButton: {
      fontWeight: 500,
      textTransform: 'none',
      borderRadius: '8px',
      minWidth: '180px',
      py: 1.2,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      '&:hover': {
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
      }
    },
    
    // Estilos para botones secundarios
    secondaryButton: {
      fontWeight: 500,
      textTransform: 'none',
      borderRadius: '8px',
      minWidth: '160px',
      py: 1.2,
      color: 'text.primary',
      borderColor: 'divider',
      '&:hover': {
        borderColor: 'primary.main',
        backgroundColor: 'rgba(25, 118, 210, 0.04)',
      }
    },
    
    // Estilos para tarjetas y contenedores
    card: {
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      }
    },
    
    // Estilos para contenedores de sección
    sectionContainer: {
      p: 3, 
      mt: 3,
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      bgcolor: 'background.paper'
    },
    
    // Estilos para campos de formulario
    formField: {
      mb: 2.5
    },
    
    // Estilos para títulos de sección
    sectionTitle: {
      fontWeight: 600,
      color: 'text.primary',
      mb: 2
    },
    
    // Estilos para texto enfatizado
    highlight: {
      color: 'primary.main',
      fontWeight: 600
    }
  };
};

/**
 * Obtiene los estilos específicos para botones principales
 * @returns {Object} - Objeto con estilos de botones principales
 */
export const getPrimaryButtonStyles = () => {
  return {
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '8px',
    px: 3,
    py: 1.2,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    }
  };
};
