import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid
} from '@mui/material';
import { ReviewArticleDisplay } from '../components';
import { getCommonStyles } from '../../../styles/commonStyles';

/**
 * Componente para el Paso 3: Visualización del artículo generado
 */
const Step3ArticleView = ({
  // Estados
  reviewArticle,
  language,
  model,
  selectedBatchSummaries,
  
  // Acciones
  handleDownloadArticle,
  handleCopyArticle
}) => {
  const styles = getCommonStyles();
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Paso 3: Artículo de revisión generado
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Tu artículo de revisión ha sido generado exitosamente
        </Typography>
        
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'rgba(0, 0, 0, 0.02)'
        }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Idioma: <strong>{language}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Modelo: <strong>{model}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                PDFs utilizados: <strong>{selectedBatchSummaries.length}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <ReviewArticleDisplay 
            article={reviewArticle} 
            onDownload={handleDownloadArticle}
            onCopy={handleCopyArticle}
          />
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="outlined"
            size="large"
            sx={styles.secondaryButton}
            onClick={() => window.location.reload()}
          >
            Iniciar nueva revisión
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Step3ArticleView;
