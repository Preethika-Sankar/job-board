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

  const applyToJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://job-board-backend-rhph.onrender.com/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Apply response:", data);
        // ✅ Use job details returned from backend
        alert(`Applied to ${data.title} at ${data.company}`);
      } else {
        alert(data.error || "Failed to apply");
      }
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job.id} className="card">
          <h3>{job.title}</h3>
          <p>{job.company} — {job.location}</p>
          <button onClick={() => applyToJob(job.id)}>Apply</button>
        </div>
      ))}
    </div>
  );
};

export default JobsList;