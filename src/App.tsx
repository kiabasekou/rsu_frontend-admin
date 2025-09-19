// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { CssBaseline } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { theme } from './theme';
import { AppLayout } from './components/layout/AppLayout';
import { LoginForm } from './components/auth/LoginForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages existantes
import { Dashboard } from './pages/Dashboard';
import { IdentityManagement } from './pages/IdentityManagement';
import { ProgramsPage } from './pages/programs/ProgramsPage'; // Import corrigé

// Call the dayjs.locale function after all imports
dayjs.locale('fr');

// Pages temporaires pour éviter les erreurs
const Reports: React.FC = () => (
  <div>
    <h1>Rapports</h1>
    <p>Page en cours de développement...</p>
  </div>
);

const Settings: React.FC = () => (
  <div>
    <h1>Paramètres</h1>
    <p>Page en cours de développement...</p>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Chargement...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredPermission="dashboard.read">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/identities"
          element={
            <ProtectedRoute requiredPermission="identity.read">
              <IdentityManagement />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/programs"
          element={
            <ProtectedRoute requiredPermission="programs.read">
              <ProgramsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredPermission="reports.read">
              <Reports />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute requiredPermission="settings.read">
              <Settings />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;