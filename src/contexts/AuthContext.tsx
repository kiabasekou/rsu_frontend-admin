// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PROGRAM_MANAGER = 'program_manager',
  DATA_ANALYST = 'data_analyst',
  FIELD_AGENT = 'field_agent'
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: ['*'],
  [UserRole.PROGRAM_MANAGER]: [
    'programs.read', 'programs.create', 'programs.edit', 'programs.delete',
    'identity.read', 'identity.edit', 'beneficiaries.read', 'beneficiaries.edit',
    'reports.read', 'exports.create'
  ],
  [UserRole.DATA_ANALYST]: [
    'programs.read', 'identity.read', 'beneficiaries.read',
    'reports.read', 'reports.create', 'exports.create', 'analytics.read'
  ],
  [UserRole.FIELD_AGENT]: [
    'identity.read', 'identity.create', 'identity.edit',
    'beneficiaries.read', 'surveys.create', 'surveys.edit'
  ]
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mode démo en développement
    if (process.env.NODE_ENV === 'development') {
      setUser({
        id: '1',
        username: 'demo',
        email: 'demo@rsu.ga',
        firstName: 'Utilisateur',
        lastName: 'Démo',
        role: UserRole.SUPER_ADMIN,
        permissions: PERMISSIONS[UserRole.SUPER_ADMIN],
        isActive: true
      });
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      validateToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser({
          ...userData,
          permissions: PERMISSIONS[userData.role as UserRole] || []
        });
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    // Mode démo - connexion automatique en développement
    if (process.env.NODE_ENV === 'development') {
      setUser({
        id: '1',
        username: credentials.username,
        email: 'demo@rsu.ga',
        firstName: 'Utilisateur',
        lastName: 'Démo',
        role: UserRole.SUPER_ADMIN,
        permissions: PERMISSIONS[UserRole.SUPER_ADMIN],
        isActive: true
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      setUser({
        ...data.user,
        permissions: PERMISSIONS[data.user.role as UserRole] || []
      });
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};