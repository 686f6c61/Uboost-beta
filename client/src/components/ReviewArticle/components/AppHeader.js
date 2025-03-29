import React from 'react';
import {
  Typography,
  Paper,
  Grid,
  Box,
  Chip
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

/**
 * Encabezado principal de la aplicación
 */
const AppHeader = () => {
  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <RocketLaunchIcon color="primary" sx={{ mr: 1.5 }} />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
          Generador de artículos de revisión científica
        </Typography>
      </Box>
    </Paper>
  );
};

export default AppHeader;
