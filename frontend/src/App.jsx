import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import JobsList from "./pages/JobsList";
import PostJob from "./pages/PostJob";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Routes */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <JobsList />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* Logout */}
        <Route
          path="/logout"
          element={
            <ProtectedRoute allowedRoles={["candidate", "recruiter"]}>
              <Logout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
