import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import ForumIcon from '@mui/icons-material/Forum';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import { usePdf } from '../contexts/PdfContext';
// Historial eliminado, ahora aparece en su propia pestaña
import ResultsDisplay from './ResultsDisplay';
import QueryInput from './QueryInput';
import AdvancedOptions from './AdvancedOptions';
import ModelSelector from './ModelSelector';
import QueryExamples from './QueryExamples';

const QueryForm = ({ isSimpleQuery }) => {
  const { 
    processQuery, 
    generateSummary, 
    selectedPdfs,
    queryLoading,
    summaryLoading,
    queryHistory = [], // Proporcionar un array vacío por defecto
    searchResults
  } = usePdf();
  
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('Español');
  const [model, setModel] = useState('gpt-4o-mini');
  const [useDefaultPrompt, setUseDefaultPrompt] = useState(true);
  const [error, setError] = useState(null);
  const [queryExamplesOpen, setQueryExamplesOpen] = useState(false);
  const [resumeInfoOpen, setResumeInfoOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState('query'); // Inicializar en 'query' por defecto
  
  // Parámetros avanzados para los modelos
  const [maxTokens, setMaxTokens] = useState(8000); // Actualizado a 8000 para Claude 3.7 Sonnet
  const [useMaxTokens, setUseMaxTokens] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);

  // El historial ahora está en su propia pestaña principal
  useEffect(() => {
    // Siempre mantenemos la vista en modo consulta
    if (viewMode !== 'query') {
      setViewMode('query');
    }
  }, [viewMode]);

  // Esta funcionalidad ahora está en la pestaña de historial

  const handleCopyExample = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setQuery(text);
      setQueryExamplesOpen(false);
    });
  };

  // Función para obtener el prompt final según la configuración
  const getFinalPrompt = () => {
    if (isSimpleQuery || !useDefaultPrompt) {
      // Si es consulta simple o no se usa el prompt predefinido, usar la consulta ingresada directamente
      return query;
    } else {
      // Este es un placeholder - el prompt real se construye en el backend
      // El backend usará el prompt predefinido de prompts.js
      // Para el prompt predefinido, solo pasamos un placeholder ya que no se usa
      return "Generar resumen estructurado con el formato predefinido UBoost";
    }
  };

  const handleSubmit = async (e) => {
    // Prevenir el comportamiento predeterminado solo si es un evento real de formulario
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError(null);
    
    // Si es un resumen estructurado con prompt por defecto, permitimos consulta vacía
    if (!query.trim() && (isSimpleQuery || !useDefaultPrompt)) {
      setError('Por favor ingresa una consulta');
      return;
    }
    
    // Determinar si estamos usando un modelo de Claude
    const isClaudeModel = model.includes('claude');
    const apiEndpoint = isClaudeModel ? 'anthropic' : 'openai';
    
    try {
      if (isSimpleQuery) {
        // Pasar el modelo, configuración y endpoint API
        await processQuery(query, model, selectedPdfs, maxTokens, temperature, apiEndpoint);
        setQuery(''); // Limpiar el campo de consulta
        // El historial ahora está en su propia pestaña principal
      } else {
        // Crear objeto con parámetros avanzados
        const modelParams = {
          model: model,
          temperature: temperature,
          top_p: topP,
          frequency_penalty: frequencyPenalty,
          presence_penalty: presencePenalty
        };
        
        // Solo añadir max_tokens si no se usa el máximo por defecto
        if (!useMaxTokens) {
          modelParams.max_tokens = maxTokens;
        }
        
        // Claude no usa frequency_penalty ni presence_penalty, pero no hay problema
        // ya que el backend ignorará los parámetros que no apliquen
        
        // Obtener el prompt final según la configuración
        const finalPrompt = getFinalPrompt();
        
        // Añadir un flag para indicar si debe usar el prompt predefinido
        modelParams.useDefaultPrompt = useDefaultPrompt;
        
        // Pasar modelo como parámetro separado
        await generateSummary(finalPrompt, language, model, modelParams);
      }
    } catch (err) {
      setError('Error al procesar la consulta: ' + err.message);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* El historial ahora está en su propia pestaña principal */}
      
      {/* Vista de consulta */}
        <>
          {/* Encabezado con título y botón de ayuda */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              {isSimpleQuery ? 'CONSULTA SOBRE ARTÍCULO' : 'GENERAR RESUMEN ESTRUCTURADO'}
            </Typography>
            
            <Tooltip title={isSimpleQuery ? "Ver ejemplos de consultas" : "Ver ejemplos de instrucciones para resúmenes"}>
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => isSimpleQuery ? setQueryExamplesOpen(true) : setResumeInfoOpen(true)}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mostrar errores */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Alerta de PDFs no seleccionados */}
          {selectedPdfs.length === 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No has seleccionado ningún PDF. Se buscarán en todos los documentos disponibles.
            </Alert>
          )}
          
          {/* Formulario de consulta - mostrar diferente según el tipo de consulta */}
          {isSimpleQuery ? (
            <QueryInput 
              query={query}
              setQuery={setQuery}
              handleSubmit={handleSubmit}
              isSimpleQuery={isSimpleQuery}
              selectedPdfs={selectedPdfs}
              model={model}
              setModel={setModel}
              isLoading={queryLoading || summaryLoading}
              error={error}
            />
          ) : (
            <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#fafafa', border: '1px solid #f0f0f0' }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#424242', mb: 1 }}>
                Modelo de IA para generar el resumen:
              </Typography>
              <ModelSelector 
                model={model} 
                setModel={setModel} 
                disabled={queryLoading || summaryLoading} 
              />
            </Paper>
          )}
          
          {/* Opciones avanzadas solo para resúmenes */}
          {!isSimpleQuery && (
            <>
              <Paper sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 500, mb: 2 }}>
                  Configuración del resumen estructurado
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={useDefaultPrompt}
                        onChange={(e) => setUseDefaultPrompt(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 1, fontWeight: useDefaultPrompt ? 500 : 400 }}>
                          Usar formato académico UBoost
                        </Typography>
                        <Tooltip title="El formato académico UBoost genera un resumen estructurado completo con todas las secciones necesarias para trabajos científicos.">
                          <InfoIcon fontSize="small" color="primary" />
                        </Tooltip>
                      </Box>
                    }
                  />
                </Box>
                
                {useDefaultPrompt ? (
                  <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd', borderRadius: 1, border: '1px solid #bbdefb' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#0d47a1', mb: 1.5 }}>
                      El resumen incluirá las siguientes secciones:
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                      <Box component="div" sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Título</span>: Descriptivo del estudio</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Contexto y objetivos</span>: Marco académico</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Metodología</span>: Diseño y procedimientos</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Resultados y conclusiones</span>: Hallazgos</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Referencias clave</span>: Bibliografía APA</Typography>
                      </Box>
                      
                      <Box component="div" sx={{ pl: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Ideas clave</span>: Conceptos fundamentales</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Clasificación</span>: Tipo de investigación</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Detalles metodológicos</span>: Paradigma</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Países del estudio</span>: Ubicación</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>• <span style={{ color: '#1976d2' }}>Muestra y variables</span>: Participantes</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#fff3e0', borderRadius: 1, border: '1px solid #ffe0b2' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: '#e65100', mb: 1 }}>
                      Estás usando un prompt personalizado
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Escribe instrucciones detalladas para el tipo de resumen que deseas generar. Especifica el formato, extensión y las secciones que necesitas incluir.
                    </Typography>
                    
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Ej: Genera un resumen enfocado en la metodología y resultados, destacando las aportaciones principales..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      variant="outlined"
                      sx={{ 
                        backgroundColor: '#fffaf6',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#ffe0b2',
                          },
                          '&:hover fieldset': {
                            borderColor: '#ffb74d',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#ff9800',
                          }
                        },
                        mb: 2
                      }}
                    />
                    
                    <Accordion sx={{ boxShadow: 'none', border: '1px solid #ffe0b2', borderRadius: 1, mb: 1 }}>
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon color="primary" />}
                        sx={{ bgcolor: '#FFF8E1', borderBottom: '1px solid #ffe0b2' }}
                      >
                        <Typography sx={{ fontWeight: 500, color: '#E65100', fontSize: '0.9rem' }}>
                          Ejemplos de prompts personalizados
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2, bgcolor: '#FFFAF6' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: '#616161', fontSize: '0.85rem' }}>
                          Selecciona y personaliza alguno de estos ejemplos para tu resumen:
                        </Typography>
                        
                        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f1f8e9', border: '1px solid #dcedc8', borderRadius: 1, borderLeft: '4px solid #8bc34a', position: 'relative' }}>
                          <Typography variant="body2" sx={{ color: '#33691e', fontStyle: 'italic', fontSize: '0.85rem', pr: 5 }}>
                            "Genera un resumen enfocado en la metodología experimental y las técnicas de análisis estadístico utilizadas en esta investigación, con especial énfasis en la validez interna y externa del estudio. Incluye una sección sobre limitaciones metodológicas."
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyExample("Genera un resumen enfocado en la metodología experimental y las técnicas de análisis estadístico utilizadas en esta investigación, con especial énfasis en la validez interna y externa del estudio. Incluye una sección sobre limitaciones metodológicas.")} 
                            sx={{ position: 'absolute', top: 8, right: 8, color: '#689f38' }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                        
                        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 1, borderLeft: '4px solid #4caf50', position: 'relative' }}>
                          <Typography variant="body2" sx={{ color: '#1b5e20', fontStyle: 'italic', fontSize: '0.85rem', pr: 5 }}>
                            "Elabora un resumen ejecutivo de 600 palabras dirigido a tomadores de decisiones que destaque: 1) El problema de investigación, 2) Los principales hallazgos, 3) Las implicaciones prácticas y 4) Las recomendaciones concretas basadas en la evidencia presentada en el artículo."
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyExample("Elabora un resumen ejecutivo de 600 palabras dirigido a tomadores de decisiones que destaque: 1) El problema de investigación, 2) Los principales hallazgos, 3) Las implicaciones prácticas y 4) Las recomendaciones concretas basadas en la evidencia presentada en el artículo.")} 
                            sx={{ position: 'absolute', top: 8, right: 8, color: '#2e7d32' }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                        
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#e0f7fa', border: '1px solid #b2ebf2', borderRadius: 1, borderLeft: '4px solid #00bcd4', position: 'relative' }}>
                          <Typography variant="body2" sx={{ color: '#006064', fontStyle: 'italic', fontSize: '0.85rem', pr: 5 }}>
                            "Sintetiza este artículo científico en un formato académico que incluya: 1) Antecedentes teóricos, 2) Hipótesis y preguntas de investigación, 3) Hallazgos principales con valores estadísticos significativos, y 4) Cómo se relacionan estos resultados con la literatura previa sobre el tema."
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyExample("Sintetiza este artículo científico en un formato académico que incluya: 1) Antecedentes teóricos, 2) Hipótesis y preguntas de investigación, 3) Hallazgos principales con valores estadísticos significativos, y 4) Cómo se relacionan estos resultados con la literatura previa sobre el tema.")} 
                            sx={{ position: 'absolute', top: 8, right: 8, color: '#0097a7' }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Paper>
                      </AccordionDetails>
                    </Accordion>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                      <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color={selectedPdfs.length > 0 ? "primary" : "secondary"}
                        disabled={queryLoading || summaryLoading || !query.trim() || selectedPdfs.length === 0}
                        endIcon={queryLoading || summaryLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        sx={{ 
                          py: 1.5, 
                          px: 5,
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          minWidth: '60%',
                          boxShadow: selectedPdfs.length > 0 ? 3 : 1,
                          '&:hover': {
                            boxShadow: selectedPdfs.length > 0 ? 4 : 1,
                          }
                        }}
                      >
                        {queryLoading || summaryLoading ? 'Procesando...' : 
                         selectedPdfs.length > 0 ? 'Generar resumen personalizado' : 'Selecciona al menos un PDF'}
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Paper>
              
              {/* El selector de ejemplos de prompts se ha movido junto al campo de texto */}
              
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontWeight: 500, color: '#1976d2', mb: 2 }}>
                  Opciones avanzadas
                </Typography>
                <AdvancedOptions 
                  maxTokens={maxTokens}
                  setMaxTokens={setMaxTokens}
                  useMaxTokens={useMaxTokens}
                  setUseMaxTokens={setUseMaxTokens}
                  temperature={temperature}
                  setTemperature={setTemperature}
                  topP={topP}
                  setTopP={setTopP}
                  frequencyPenalty={frequencyPenalty}
                  setFrequencyPenalty={setFrequencyPenalty}
                  presencePenalty={presencePenalty}
                  setPresencePenalty={setPresencePenalty}
                  language={language}
                  setLanguage={setLanguage}
                />
              </Paper>
              
              {/* Botón para generar el resumen estructurado */}
              {useDefaultPrompt && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 3 }}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color={selectedPdfs.length > 0 ? "primary" : "secondary"}
                    disabled={queryLoading || summaryLoading || selectedPdfs.length === 0}
                    sx={{ 
                      py: 1.5, 
                      px: 5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      minWidth: '60%',
                      boxShadow: selectedPdfs.length > 0 ? 3 : 1,
                      '&:hover': {
                        boxShadow: selectedPdfs.length > 0 ? 4 : 1,
                      }
                    }}
                    endIcon={queryLoading || summaryLoading ? 
                      <CircularProgress size={20} color="inherit" /> : 
                      <SendIcon />
                    }
                  >
                    {queryLoading || summaryLoading ? 'Procesando...' : 
                     selectedPdfs.length > 0 ? 'Generar resumen estructurado' : 'Selecciona al menos un PDF'}
                  </Button>
                </Box>
              )}
            </>
          )}
          
          {/* Los resultados ahora se muestran solo en MainContent.js */}
        </>


      {/* Modal de ejemplos de consultas */}
      <QueryExamples 
        open={queryExamplesOpen || resumeInfoOpen}
        onClose={() => {
          setQueryExamplesOpen(false);
          setResumeInfoOpen(false);
        }}
        onCopyExample={handleCopyExample}
        isSimpleQuery={isSimpleQuery}
      />

      {/* Snackbar para confirmar copia */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        message="Instrucción copiada al campo de texto"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default QueryForm;
