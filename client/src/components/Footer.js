import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.main,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" gutterBottom>
            (U)Boost scientific paper - Marzo 2025
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Licencia MIT - Software de código abierto para uso educativo y académico
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
