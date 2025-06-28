import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = ({ allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
