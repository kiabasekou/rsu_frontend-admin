// src/hooks/usePermissions.ts
import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { hasPermission, hasRole, user } = useAuth();

  return {
    canCreateIdentity: hasPermission('identity.create'),
    canEditIdentity: hasPermission('identity.edit'),
    canDeleteIdentity: hasPermission('identity.delete'),
    canCreateProgram: hasPermission('programs.create'),
    canEditProgram: hasPermission('programs.edit'),
    canDeleteProgram: hasPermission('programs.delete'),
    canViewReports: hasPermission('reports.read'),
    canCreateReports: hasPermission('reports.create'),
    canExportData: hasPermission('exports.create'),
    canViewAnalytics: hasPermission('analytics.read'),
    isAdmin: hasRole('super_admin' as any),
    isProgramManager: hasRole('program_manager' as any),
    isAnalyst: hasRole('data_analyst' as any),
    isFieldAgent: hasRole('field_agent' as any),
    currentUser: user
  };
};