import React, { useEffect, useState } from 'react';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('https://job-board-backend-rhph.onrender.com/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error('Failed to fetch jobs:', err));
  }, []);

  return (
    <div className="page-container">
      <h2 style={{ color: '#00bfff' }}>Available Jobs</h2>

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="job-card" style={{
            backgroundColor: '#1e1e2f',
            color: '#fff',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ color: '#00bfff' }}>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ₹{job.salary}</p>
            <p><strong>Tags:</strong> {job.tags}</p>
            <p>{job.description}</p>
          </div>
        ))
      ) : (
        <p style={{ color: '#ccc' }}>No jobs available.</p>
      )}
    </div>
  );
}