import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';  // ✅ add Navigate
import './App.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/JobsList'; // ✅ Match filename
import PostJob from './pages/PostJob';

function App() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <Routes>
          {/* Default route: redirect "/" to "/login" */}
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/post-job" element={<PostJob />} />
        </Routes>
      </div>
    </>
  );
}

export default App;