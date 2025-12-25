import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API = process.env.REACT_APP_API_URL;

    try {
      const res = await axios.post(`${API}/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      setMessage("Login successful ✅");
      console.log("User:", res.data);
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p>{message}</p>}
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
    </div>
  );
}