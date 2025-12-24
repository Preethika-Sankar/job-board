import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function PostJob() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Please log in before posting a job ❌');
      return;
    }

    try {
      await axios.post(
        'https://job-board-backend-rhph.onrender.com/jobs',
        {
          ...data,
          posted_by: userId
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      alert('Job posted successfully ✅');
    } catch (err) {
      console.error('Error posting job:', err.response?.data || err.message);
      alert('Failed to post job ❌');
    }
  };

  return (
    <div className="page-container">
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Title</label>
        <input {...register('title', { required: true })} />

        <label>Company</label>
        <input {...register('company', { required: true })} />

        <label>Location</label>
        <input {...register('location', { required: true })} />

        <label>Salary</label>
        <input {...register('salary', { required: true })} />

        <label>Tags</label>
        <input {...register('tags')} />

        <label>Description</label>
        <textarea {...register('description', { required: true })}></textarea>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}