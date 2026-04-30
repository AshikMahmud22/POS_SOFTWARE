import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../lib/AuthProvider';

export const ROLES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin'
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN) {
    return <>{children}</>;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};