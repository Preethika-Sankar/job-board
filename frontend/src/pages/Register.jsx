import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API = process.env.REACT_APP_API_URL;

    try {
      const res = await axios.post(`${API}/register`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Registration successful ✅');
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setMessage('Registration failed ❌');
    }
  };

  return (
    <div className="page-container">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="Password"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}