import React, { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example: call backend register API
      const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();

      // Save role in localStorage for ProtectedRoute
      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "candidate") {
        window.location.href = "/jobs";
      } else if (data.role === "recruiter") {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="card">
      <h2 style={{ textAlign: "center", color: "#1e90ff" }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#1e90ff" }}>Login</a>
      </p>
    </div>
  );
};

export default Register;