import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// ProtectedRoute component for regular users and admins
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated and status is approved
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.status !== 'approved') {
    return <Navigate to="/pending" />;
  }

  return children;
};

// AdminRoute component specifically for admin users
export const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated, approved, and has admin role
  if (!currentUser || !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};
