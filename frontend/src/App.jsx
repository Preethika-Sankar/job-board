import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobsList from "./pages/JobsList"; // ✅ matches your actual file
import PostJob from "./pages/PostJob";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Recruiter-only routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* Candidate-only routes */}
       <Route
  path="/jobs"
  element={
    <ProtectedRoute allowedRole="candidate">
      <JobsList />
    </ProtectedRoute>
  }
/>

        {/* Default fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;