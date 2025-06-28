// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || (requiredRole && role !== requiredRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;


