import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import ApiKeysConfig from '../ApiKeysConfig';

// Componente para gestionar las API Keys desde el Panel de (U)Boost
const ApiKeyManagement = () => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
        Gestión de API Keys
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Typography paragraph>
        Configure las claves de API para los diferentes modelos de lenguaje utilizados en la aplicación.
        Para el correcto funcionamiento, se necesita al menos una API key válida de OpenAI o Anthropic.
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <ApiKeysConfig adminView={true} />
      </Box>
    </Paper>
  );
};

export default ApiKeyManagement;
