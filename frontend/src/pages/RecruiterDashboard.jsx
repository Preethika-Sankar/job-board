import React, { useEffect, useState } from "react";

const RecruiterDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://job-board-backend-rhph.onrender.com/api/applications/employer",
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
          alert(data.error || "Failed to fetch recruiter applications");
        }
      } catch (err) {
        console.error("Error fetching recruiter applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>Loading applications for your jobs...</p>;

  return (
    <div>
      <h2>Applications for My Posted Jobs</h2>
      {applications.length === 0 ? (
        <p>No one has applied to your jobs yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <strong>{app.candidate_email}</strong> applied for{" "}
              <strong>{app.title}</strong> at {app.company} ({app.location})
              <br />
              Resume:{" "}
              <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecruiterDashboard;