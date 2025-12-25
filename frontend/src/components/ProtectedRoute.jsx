import React from "react";
import { Navigate } from "react-router-dom";

// children = the page you want to protect
// allowedRole = "recruiter" or "candidate"
const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role"); // ✅ role stored at login

  if (role !== allowedRole) {
    // 🚫 If role doesn’t match, redirect to login
    return <Navigate to="/login" replace />;
  }

  // ✅ If role matches, render the page
  return children;
};

export default ProtectedRoute;