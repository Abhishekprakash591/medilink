import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route and redirects to /login if:
 * 1. User is not authenticated, OR
 * 2. User's role doesn't match allowedRole
 */
export const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to the user's correct dashboard
    const redirects = { patient: '/patient/dashboard', doctor: '/doctor/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={redirects[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
