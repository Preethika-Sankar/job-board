import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL;

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API}/jobs`);
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err.response?.data?.message || "Failed to load jobs ❌");
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Job Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}