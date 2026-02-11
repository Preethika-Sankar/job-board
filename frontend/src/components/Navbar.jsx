import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Watch for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
      setToken(localStorage.getItem("token"));
    };

    // Listen for storage changes (like login/logout)
    window.addEventListener("storage", handleStorageChange);

    // Also run once immediately in case localStorage changed
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="navbar">
      {/* Public links */}
      {!token && (
        <>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
            Register
          </NavLink>
        </>
      )}

      {/* Candidate links */}
      {role === "candidate" && (
        <>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>
            Jobs
          </NavLink>
          <NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
            Logout
          </NavLink>
        </>
      )}

      {/* Recruiter links */}
      {role === "recruiter" && (
        <>
          <NavLink to="/recruiter-dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Recruiter Dashboard
          </NavLink>
          <NavLink to="/post-job" className={({ isActive }) => (isActive ? "active" : "")}>
            Post Job
          </NavLink>
          <NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>
            Logout
          </NavLink>
        </>
      )}
    </div>
  );
}