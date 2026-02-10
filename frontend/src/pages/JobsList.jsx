import React, { useEffect, useState } from "react";

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/jobs`);
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/apply/${jobId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      console.error("Error applying:", err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", color: "#1e90ff" }}>Available Jobs</h2>
      {message && (
        <p style={{ textAlign: "center", color: "#4CAF50", fontWeight: "bold" }}>{message}</p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {jobs.map((job) => (
          <div key={job.id} className="card" style={{ width: "300px", margin: "1rem", padding: "1rem", background: "#1e1e1e", color: "#fff", borderRadius: "8px" }}>
            <h3 style={{ color: "#1e90ff" }}>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> ₹{job.salary}</p>
            <button onClick={() => applyJob(job.id)} style={{ marginTop: "1rem", backgroundColor: "#1e90ff", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;