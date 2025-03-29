import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ExistingPdfList, ModelSelector } from '../components';
import { getCommonStyles } from '../../../styles/commonStyles';

/**
 * Componente para el Paso 1: Selección de PDFs y configuración
 */
const Step1PdfSelection = ({
  // Estados
  pdfs,
  setPdfs,
  language,
  setLanguage,
  model,
  setModel,
  showAdvancedOptions,
  setShowAdvancedOptions,
  specificInstructions,
  setSpecificInstructions,
  useDefaultPrompt, 
  setUseDefaultPrompt,
  modelParams,
  isProcessing,
  
  // Manejadores
  handleModelChange,
  handleProcessPdfs,
  handleToggleInstructionsHelp
}) => {
  const styles = getCommonStyles();
  
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Paso 1: Selecciona PDFs y configura el artículo de revisión
      </Typography>
      
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Selecciona los PDFs científicos para tu artículo de revisión
        </Typography>
        
        <ExistingPdfList 
          onPdfsSelected={setPdfs}
          disabled={isProcessing}
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Configura las opciones del artículo de revisión
        </Typography>
        
        <Box 
          sx={{ 
            mt: 2, 
            p: 2, 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="language-select-label">Idioma</InputLabel>
                <Select
                  labelId="language-select-label"
                  id="language-select"
                  value={language}
                  label="Idioma"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="Español">Español</MenuItem>
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Français">Français</MenuItem>
                  <MenuItem value="Deutsch">Deutsch</MenuItem>
                  <MenuItem value="Italiano">Italiano</MenuItem>
                  <MenuItem value="Português">Português</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <ModelSelector 
                model={model} 
                setModel={setModel} 
                handleModelChange={handleModelChange} 
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={showAdvancedOptions} 
                    onChange={(e) => setShowAdvancedOptions(e.target.checked)}
                  />
                }
                label="Opciones avanzadas"
                sx={{ height: '40px', display: 'flex', alignItems: 'center' }}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1">
              Instrucciones específicas (opcional)
            </Typography>
            <Tooltip title="Ver ejemplos de instrucciones">
              <IconButton 
                size="small" 
                onClick={handleToggleInstructionsHelp}
                sx={{ ml: 1 }}
              >
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <FormControlLabel
            control={
              <Switch 
                checked={useDefaultPrompt} 
                onChange={(e) => setUseDefaultPrompt(e.target.checked)}
              />
            }
            label="Utilizar formato predefinido UBoost"
            sx={{ mb: 1 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={
              useDefaultPrompt
                ? "El formato predefinido UBoost se utilizará para generar el artículo de revisión. Puedes añadir instrucciones adicionales aquí (opcional)."
                : "Escribe instrucciones específicas para personalizar el artículo de revisión..."
            }
            variant="outlined"
            value={specificInstructions}
            onChange={(e) => setSpecificInstructions(e.target.value)}
            disabled={isProcessing}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: useDefaultPrompt ? 'rgba(0, 0, 0, 0.03)' : 'white'
              }
            }}
          />
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleProcessPdfs}
            disabled={pdfs.length === 0 || isProcessing}
            sx={styles.actionButton}
          >
            {isProcessing ? 'Procesando...' : 'Procesar PDFs'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Step1PdfSelection;
