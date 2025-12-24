// src/api/client.js

const API = process.env.REACT_APP_API_URL;

// ✅ Jobs API
export async function getJobs() {
  const response = await fetch(`${API}/api/jobs`);
  return response.json();
}

export async function postJob(jobData) {
  const response = await fetch(`${API}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  return response.json();
}

// ✅ Auth API
export async function registerUser(userData) {
  const response = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return response.json();
}