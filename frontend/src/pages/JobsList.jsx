import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const API = process.env.REACT_APP_API_URL;

    axios.get(`${API}/jobs`)
      .then(res => setJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h2>Available Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
}