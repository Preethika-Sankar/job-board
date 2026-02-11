import React, { useEffect, useState } from "react";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://job-board-backend-rhph.onrender.com/api/jobs");
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://job-board-backend-rhph.onrender.com/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        job_id: jobId,
        resume_url: "https://example.com/resume.pdf" // replace with actual resume URL
      })
    });

    const data = await response.json();
    console.log("Apply response:", data);
    alert(data.message);
  } catch (err) {
    console.error("Apply error:", err);
  }
};

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map(job => (
        <div key={job.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{job.title}</h3>
          <p>{job.company} - {job.location}</p>
          <button onClick={() => handleApply(job.id)}>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default JobsList;