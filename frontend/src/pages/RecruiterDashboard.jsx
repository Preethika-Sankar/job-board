import React, { useEffect, useState } from "react";

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all applications for jobs posted by this recruiter
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://job-board-backend-rhph.onrender.com/api/applications", // recruiter endpoint
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setApplications(data);
        } else {
          alert(data.error || "Failed to fetch applications");
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Update application status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://job-board-backend-rhph.onrender.com/api/applications/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        // Update local state so UI reflects immediately
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id ? { ...app, status: data.status } : app
          )
        );
      } else {
        alert(data.error || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div>
      <h2>Recruiter Dashboard</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <strong>{app.title}</strong> — Candidate ID: {app.candidate_id}
              <br />
              Status: <span className={`status-${app.status?.toLowerCase()}`}>
                {app.status}
              </span>
              <br />
              <button onClick={() => updateStatus(app.id, "Selected")}>
                Select
              </button>
              <button onClick={() => updateStatus(app.id, "Rejected")}>
                Reject
              </button>
              <button onClick={() => updateStatus(app.id, "Pending")}>
                Keep Pending
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterDashboard;