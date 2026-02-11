import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://job-board-backend-rhph.onrender.com/api/applications/me",
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
          console.error("Failed to fetch applications:", data.error);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading your applications...</p>;

  return (
    <div>
      <h2>My Applications</h2>
      {applications.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <strong>{app.title}</strong> at {app.company} ({app.location})
              <br />
              Status: <span className={`status-${app.status?.toLowerCase()}`}>
                {app.status || "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;