import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './UserManagement';

// Componente wrapper para la página de administración
// Que verifica explícitamente si el usuario es admin
const UserManagementWrapper = () => {
  const { currentUser, isAdmin } = useAuth();
  
  // Redirigir si no es admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <UserManagement />;
};

export default UserManagementWrapper;
