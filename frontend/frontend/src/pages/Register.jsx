import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5050/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });
      alert('Registered successfully!');
      navigate('/login');
    } catch (err) {
      console.error('❌ Registration failed:', err);
      alert('Registration failed');
    }
  };

  return (
    <div className="page-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Name</label>
        <input {...register('name', { required: true })} />

        <label>Email</label>
        <input {...register('email', { required: true })} />

        <label>Password</label>
        <input type="password" {...register('password', { required: true })} />

        <label>Role</label>
        <select {...register('role', { required: true })}>
          <option value="">Select role</option>
          <option value="employer">Employer</option>
          <option value="candidate">Candidate</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}