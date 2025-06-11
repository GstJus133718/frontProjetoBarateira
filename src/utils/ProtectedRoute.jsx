import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirecionar para login se não autenticado
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Verificar role se especificada
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;