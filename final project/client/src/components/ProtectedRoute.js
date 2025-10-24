import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (!auth || !auth.accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
