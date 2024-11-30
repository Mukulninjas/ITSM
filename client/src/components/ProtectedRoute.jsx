import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { isAuthenticated, permissions } = useSelector((state) => state.auth);

  console.log("IsAuthenticated: " + isAuthenticated + " permissions: " + permissions);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const hasPermission = requiredPermissions.every((perm) => permissions.includes(perm));
  if (!hasPermission) {
    return <div>You do not have the necessary permissions to access this page.</div>;
  }

  return children;
};

export default ProtectedRoute;