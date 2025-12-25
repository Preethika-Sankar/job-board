import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRole, children }) => {
  // Example: role stored in localStorage after login/register
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    // If no role, force login
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    // If role doesn’t match, block access
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;