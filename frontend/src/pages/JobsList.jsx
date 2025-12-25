import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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

  // ✅ Apply function
  const handleApply = async (jobId) => {
    try {
      const API = process.env.REACT_APP_API_URL;

      // Candidate_id = 1 for now (your test user)
      const res = await axios.post(`${API}/applications`, {
        job_id: jobId,
        candidate_id: 1,
        resume_url: "https://example.com/resume.pdf"
      });

      setMessage(`Applied successfully to job: ${res.data.job_id}`);
    } catch (err) {
      console.error("Apply error:", err);
      setMessage("Failed to apply ❌");
    }
  };

  return (
    <div className="jobs-container">
      <h2>Available Jobs</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p>{job.description}</p>
              <button onClick={() => handleApply(job.id)}>Apply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}