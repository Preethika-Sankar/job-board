import React, { useState } from 'react';
import axios from 'axios';

export default function PostJob() {
  const [jobData, setJobData] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API = process.env.REACT_APP_API_URL;

    try {
      const res = await axios.post(`${API}/jobs`, jobData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('Job posted successfully ✅');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to post job ❌');
    }
  };

  return (
    <div className="page-container">
      <h2>Post a Job</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={jobData.title}
          onChange={e => setJobData({ ...jobData, title: e.target.value })}
          placeholder="Job Title"
        />
        <textarea
          value={jobData.description}
          onChange={e => setJobData({ ...jobData, description: e.target.value })}
          placeholder="Job Description"
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}