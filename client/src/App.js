import React from 'react';
import { Container, Box, CssBaseline, Stack } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Context Providers
import { PdfContextProvider } from './contexts/PdfContext';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import MainContent from './components/MainContent';
import AuthStatus from './components/Auth/AuthStatus';

// Auth Components
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProfilePage from './components/Auth/ProfilePage';
import PendingApproval from './components/Auth/PendingApproval';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Admin Components
import UserManagement from './components/Admin/UserManagement';
import UserManagementWrapper from './components/Admin/UserManagementWrapper';

// History Components
import QueryHistoryFixWrapper from './components/QueryHistory/QueryHistoryFixWrapper';

// Landing Page
import LandingPage from './components/Landing/LandingPage';
import AboutUs from './components/Landing/AboutUs';
import ContactPage from './components/Landing/ContactPage';
import { LandingRoute, HomeRoute } from './components/Landing/LandingRoutes';

// Font Awesome para la landing page (ya instalado como dependencia)
import '@fortawesome/fontawesome-free/css/all.min.css';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <PdfContextProvider>
        <Router>
          <Routes>
            {/* Landing Page Routes - Solo para usuarios no autenticados */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Rutas públicas de autenticación - Accesibles directamente */}
            <Route path="/login" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
                <CssBaseline />
                <Header />
                <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
                  <LoginForm />
                </Container>
                <Footer />
              </Box>
            } />
            
            <Route path="/register" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
                <CssBaseline />
                <Header />
                <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
                  <RegisterForm />
                </Container>
                <Footer />
              </Box>
            } />
            
            <Route path="/pending" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
                <CssBaseline />
                <Header />
                <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
                  <PendingApproval />
                </Container>
                <Footer />
              </Box>
            } />
            
            <Route path="/forgot-password" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
                <CssBaseline />
                <Header />
                <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
                  <ForgotPasswordForm />
                </Container>
                <Footer />
              </Box>
            } />
            
            <Route path="/reset-password" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
                <CssBaseline />
                <Header />
                <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
                  <ResetPasswordForm />
                </Container>
                <Footer />
              </Box>
            } />
            
            {/* Rutas para el SaaS - Con layout común */}
            <Route path="/" element={
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
                <CssBaseline />
                <Header />
                <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
                  <Outlet />
                </Container>
                <Footer />
              </Box>
            }>
              {/* Rutas anidadas dentro del layout principal */}
              <Route index element={
                <ProtectedRoute>
                  <MainContent />
                </ProtectedRoute>
              } />
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="history" element={
                <ProtectedRoute>
                  <QueryHistoryFixWrapper />
                </ProtectedRoute>
              } />
              
              <Route path="admin" element={
                <ProtectedRoute>
                  <UserManagementWrapper />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Redirección por defecto para rutas desconocidas */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </PdfContextProvider>
    </AuthProvider>
  );
}

export default App;
