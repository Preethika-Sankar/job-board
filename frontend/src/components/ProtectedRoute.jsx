import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  // Get role from localStorage (set during login/register)
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // If not logged in, redirect to login
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn’t match, block access
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;