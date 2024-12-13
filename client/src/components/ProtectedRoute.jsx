import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, permissions } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasPermission = requiredPermissions.every((perm) => permissions.includes(perm));
  if (!hasPermission) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;