import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LandingPage from './LandingPage';

// Este componente dirige a los usuarios no autenticados a la landing page
// y a los usuarios autenticados a la página principal del SaaS
export const LandingRoute = () => {
  const { currentUser, loading } = useAuth();
  
  // Si está cargando, muestra un estado de carga
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si el usuario está autenticado, redirige a la página principal del SaaS
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si no está autenticado, muestra la landing page
  return <LandingPage />;
};

// Este componente dirige a los usuarios autenticados a la página principal del SaaS
// y a los usuarios no autenticados a la landing page
export const HomeRoute = () => {
  const { currentUser, loading } = useAuth();
  
  // Si está cargando, muestra un estado de carga
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si el usuario no está autenticado, redirige a la landing page
  if (!currentUser) {
    return <Navigate to="/landing" replace />;
  }
  
  // Si está autenticado, permite el acceso a la ruta protegida (usa children)
  return null; // La ruta protegida real se maneja en el app.js con ProtectedRoute
};
