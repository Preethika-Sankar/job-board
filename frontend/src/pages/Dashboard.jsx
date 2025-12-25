import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // ✅ Custom styles

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  // ✅ Fetch applications from backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/applications`)
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error("Error fetching applications:", err));
  }, []);

  // ✅ Update application status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: updated.status } : app))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status ❌");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Recruiter Dashboard</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Candidate Email</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.candidate_email}</td>
              <td>{app.job_title}</td>
              <td>{app.company}</td>
              <td>
                {app.resume_url ? (
                  <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                ) : (
                  "No resume"
                )}
              </td>
              <td>
                <span className={`status-badge ${app.status}`}>{app.status}</span>
              </td>
              <td>
                <button className="btn accept" onClick={() => updateStatus(app.id, "accepted")}>
                  Accept
                </button>
                <button className="btn reject" onClick={() => updateStatus(app.id, "rejected")}>
                  Reject
                </button>
                <button className="btn pending" onClick={() => updateStatus(app.id, "pending")}>
                  Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;