import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        'https://job-board-backend-rhph.onrender.com/login',
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      localStorage.setItem('auth', true);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('role', res.data.user.role);

      setLoginMessage('Login successful ✅');
      setMessageColor('green');

      if (res.data.user.role === 'recruiter') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      console.error(err);
      setLoginMessage('Login failed ❌');
      setMessageColor('red');
    }
  };

  return (
    <div className="page-container">
      <h2>Login</h2>

      {loginMessage && (
        <p style={{ color: messageColor, fontWeight: 'bold' }}>{loginMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input {...register('email', { required: true })} />

        <label>Password</label>
        <input type="password" {...register('password', { required: true })} />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}