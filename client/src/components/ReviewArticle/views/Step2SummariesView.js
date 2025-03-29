import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid
} from '@mui/material';
import { SummaryList, AdvancedOptions } from '../components';
import { getCommonStyles } from '../../../styles/commonStyles';

/**
 * Componente para el Paso 2: Visualización y selección de resúmenes
 */
const Step2SummariesView = ({
  // Estados
  batchSummaries,
  selectedBatchSummaries,
  setSelectedBatchSummaries,
  showAdvancedOptions,
  modelParams,
  setModelParams,
  useMaxTokens,
  setUseMaxTokens,
  isGeneratingArticle,
  
  // Manejadores
  handleOpenSummaryDialog,
  handleGenerateReviewArticle
}) => {
  const styles = getCommonStyles();
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Paso 2: Selecciona los resúmenes para tu artículo de revisión
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Los siguientes resúmenes han sido generados a partir de los PDFs seleccionados.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Selecciona los resúmenes que deseas incluir en tu artículo de revisión final.
        </Typography>
        
        <SummaryList 
          summaries={batchSummaries} 
          selectedSummaries={selectedBatchSummaries} 
          setSelectedSummaries={setSelectedBatchSummaries}
          onViewSummary={handleOpenSummaryDialog}
        />
        
        {showAdvancedOptions && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Opciones avanzadas
            </Typography>
            <AdvancedOptions
              modelParams={modelParams}
              setModelParams={setModelParams}
              useMaxTokens={useMaxTokens}
              setUseMaxTokens={setUseMaxTokens}
            />
          </Box>
        )}
        
        <Grid container spacing={2} sx={{ mt: 4 }}>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              sx={styles.secondaryButton}
              onClick={() => window.location.reload()}
            >
              Volver a empezar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGenerateReviewArticle}
              disabled={selectedBatchSummaries.length === 0 || isGeneratingArticle}
              sx={styles.actionButton}
            >
              {isGeneratingArticle ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Generando artículo...
                </>
              ) : (
                'Generar artículo de revisión'
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Step2SummariesView;
