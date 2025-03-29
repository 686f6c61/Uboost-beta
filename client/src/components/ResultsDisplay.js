import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Chip,
  IconButton,
  Grid,
  Tooltip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ID único para evitar duplicados (solución para el bug de respuestas duplicadas)
const INSTANCE_ID = Date.now().toString();
let renderedInstances = [];

// Componente para mostrar resultados (consultas/resúmenes)
const ResultsDisplay = ({ type, data }) => {
  // Estado para controlar si debe renderizarse (evitar duplicados)
  const [shouldRender, setShouldRender] = useState(false);
  
  // Checkeo para prevenir renderizado duplicado
  useEffect(() => {
    // Esta instancia ya se ha renderizado?
    const isAlreadyRendered = renderedInstances.some(id => id === INSTANCE_ID);
    
    if (!isAlreadyRendered) {
      // Si no está renderizada, añadirla a la lista y permitir renderizado
      renderedInstances.push(INSTANCE_ID);
      setShouldRender(true);
    }
    
    // Limpiar al desmontar
    return () => {
      renderedInstances = renderedInstances.filter(id => id !== INSTANCE_ID);
    };
  }, []);
  
  // Si no debe renderizarse (duplicado), no mostrar nada
  if (!shouldRender) return null;
  const { response, summary, sources, tokenUsage, model } = data;
  const content = type === 'query' ? response : summary;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };
  
  const handleDownload = (format = 'md') => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${type === 'query' ? 'respuesta' : 'resumen'}_${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  

  
  const handleDownloadMd = () => handleDownload('md');
  const handleDownloadTxt = () => handleDownload('txt');

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {type === 'query' ? 'Respuesta' : 'Resumen Estructurado'}
        </Typography>
        <Box>
          <Tooltip title="Copiar al portapapeles">
            <IconButton onClick={handleCopy}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar como markdown (.md)">
            <IconButton onClick={handleDownloadMd}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Descargar como texto (.txt)">
            <IconButton onClick={handleDownloadTxt}>
              <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 'bold' }}>TXT</Typography>
            </IconButton>
          </Tooltip>

        </Box>
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'grey.200',
          borderRadius: 2,
          mb: 2
        }}
      >
        <Box className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </Box>
      </Paper>
      
      {tokenUsage && (
        <Box sx={{ mt: 2, mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Información de procesamiento:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Modelo:</strong> {model || 'No disponible'}
              </Typography>
              <Typography variant="body2">
                <strong>Tokens totales:</strong> {tokenUsage.totalTokens?.toLocaleString() || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Tokens de entrada:</strong> {tokenUsage.promptTokens?.toLocaleString() || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Tokens de salida:</strong> {tokenUsage.completionTokens?.toLocaleString() || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" gutterBottom>
        Fuentes utilizadas:
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {sources && sources.map((source) => (
          <Chip 
            key={source.id} 
            label={source.originalName} 
            variant="outlined" 
            size="small"
            sx={{ bgcolor: 'background.paper' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ResultsDisplay;
