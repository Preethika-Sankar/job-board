import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");   // ✅ feedback message
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setMessage("Login failed. Please check your credentials.");
        setMessageType("error");
        return;
      }

      const data = await res.json();

      // Save role + token
      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.token);

      // ✅ Show success message
      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      // Redirect after short delay
      setTimeout(() => {
        if (data.role === "candidate") {
          window.location.href = "/jobs";
        } else if (data.role === "recruiter") {
          window.location.href = "/dashboard";
        }
      }, 1500);
    } catch (err) {
      console.error(err.message);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
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

      {/* ✅ Feedback message */}
      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: messageType === "success" ? "#4CAF50" : "#FF4C4C",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don’t have an account?{" "}
        <a href="/register" style={{ color: "#1e90ff" }}>Register</a>
      </p>
    </div>
  );
};

export default Login;