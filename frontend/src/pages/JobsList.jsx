import React, { useEffect, useState } from "react";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/jobs`);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} style={{
            backgroundColor: "#1e1e2f",
            border: "1px solid #3a3a5a",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem"
          }}>
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company || "N/A"}</p>
            <p><strong>Location:</strong> {job.location || "N/A"}</p>
            <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
            <p><strong>Tags:</strong> {job.tags || "N/A"}</p>
            <p>{job.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default JobsList;