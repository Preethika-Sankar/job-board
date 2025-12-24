import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [myJobs, setMyJobs] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    axios.get(`http://localhost:5050/my-jobs/${userId}`)
      .then(res => setMyJobs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="page-container">
      <h2>My Posted Jobs</h2>
      {myJobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        myJobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p>{job.salary}</p>
            <small>Posted on {new Date(job.created_at).toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}