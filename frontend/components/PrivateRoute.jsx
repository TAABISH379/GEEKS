import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.user.role)) {
    return <Navigate to="/" />; // Redirect unauthorized users
  }

  return children;
};

export default PrivateRoute;
