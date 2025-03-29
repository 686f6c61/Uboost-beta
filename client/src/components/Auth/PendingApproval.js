import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  AlertTitle
} from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import { useAuth } from '../../contexts/AuthContext';

const PendingApproval = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            bgcolor: 'warning.main',
            color: 'white',
            borderRadius: '50%',
            p: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PendingIcon fontSize="large" />
        </Box>

        <Typography component="h1" variant="h4" gutterBottom>
          Account Pending Approval
        </Typography>

        <Alert severity="info" sx={{ width: '100%', mb: 4 }}>
          <AlertTitle>Registration Successful!</AlertTitle>
          Your account is pending administrator approval. You will be able to access the system once your account has been approved.
        </Alert>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Current status: <strong>{currentUser.status.toUpperCase()}</strong>
          </Typography>
          <Typography variant="body1" paragraph>
            You are registered with email: <strong>{currentUser.email}</strong>
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
              sx={{ px: 4, py: 1 }}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PendingApproval;
