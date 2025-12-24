import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
      <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
      <NavLink to="/jobs" className={({ isActive }) => isActive ? "active" : ""}>Jobs</NavLink>
      <NavLink to="/post-job" className={({ isActive }) => isActive ? "active" : ""}>Post Job</NavLink>
    </div>
  );
}