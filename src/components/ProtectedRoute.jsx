import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/unauthorized" />;
  }
  const userRole = currentUser.userRole;
  if (!allowedRoles.includes(userRole)) {
    // If user does not have the required role, redirect to unauthorized page
    return <Navigate to="/unauthorized" />;
  }
  // If user has the required role, render the children components
  return children;
};

export default ProtectedRoute;
