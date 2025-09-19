// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useAuth, UserRole } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback
}) => {
  const { isAuthenticated, isLoading, hasPermission, hasRole, user } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Alert severity="error">
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </Alert>
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Alert severity="error">
        Votre rôle ({user?.role}) ne permet pas d'accéder à cette page.
      </Alert>
    );
  }

  return <>{children}</>;
};
