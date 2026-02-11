import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  return (
    <div className="navbar">
      {/* Public links (only when not logged in) */}
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