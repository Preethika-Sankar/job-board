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

  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to apply");
        return;
      }

      console.log("Applying to job:", jobId, "with token:", token);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to apply");
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Apply error:", err);
      alert("Error applying for job. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Available Jobs</h2>
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company || "N/A"}</p>
            <p><strong>Location:</strong> {job.location || "N/A"}</p>
            <p><strong>Salary:</strong> {job.salary || "N/A"}</p>
            <p><strong>Tags:</strong> {job.tags || "N/A"}</p>
            <p>{job.description}</p>
            <button onClick={() => handleApply(job.id)}>Apply</button>
          </div>
        ))
      )}
    </div>
  );
};

export default JobsList;