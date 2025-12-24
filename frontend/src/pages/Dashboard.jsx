import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL;

    axios.get(`${API}/jobs?recruiterId=${userId}`)
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="page-container">
      <h2>Recruiter Dashboard</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
}