import React from 'react';
import { Box, Typography } from '@mui/material';

// Componente simple que redirige al usuario al nuevo historial
const QueryHistoryFixed = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1">
        El historial de consultas está disponible en la pestaña dedicada.
      </Typography>
    </Box>
  );
};

export default QueryHistoryFixed;
