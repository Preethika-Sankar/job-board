import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example: call backend login API
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");
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
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="card">
      <h2 style={{ textAlign: "center", color: "#1e90ff" }}>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don’t have an account?{" "}
        <a href="/register" style={{ color: "#1e90ff" }}>Register</a>
      </p>
    </div>
  );
};

export default Login;