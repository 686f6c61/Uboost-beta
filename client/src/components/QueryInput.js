import React from 'react';
import {
  TextField,
  Box,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
// Eliminado el import de ModelSelector para evitar duplicidad

const QueryInput = ({
  query,
  setQuery,
  handleSubmit,
  isSimpleQuery,
  selectedPdfs,
  // model y setModel ya no se necesitan aquí
  isLoading,
  error
}) => {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        fullWidth
        id="query"
        label={isSimpleQuery ? "Escribe tu pregunta sobre los PDFs seleccionados" : "Describe qué tipo de resumen necesitas"}
        placeholder={isSimpleQuery 
          ? "Ej: ¿Cuáles son los principales hallazgos del estudio?" 
          : "Ej: Necesito un resumen detallado sobre la metodología y resultados del estudio"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
        variant="outlined"
        disabled={isLoading}
      />
      
      {/* Botón para enviar la consulta */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color={query.trim() && selectedPdfs.length > 0 ? "primary" : "secondary"}
          disabled={isLoading || !query.trim()}
          endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ 
            py: 1.5, 
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 'bold',
            minWidth: '200px',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 4,
            }
          }}
        >
          {isLoading ? 'Procesando...' : 'Enviar consulta'}
        </Button>
      </Box>
    </Box>
  );
};

export default QueryInput;
