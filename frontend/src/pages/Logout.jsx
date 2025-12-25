import React, { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    // Clear session
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    // Redirect to login
    window.location.href = "/login";
  }, []);

  return <p style={{ textAlign: "center" }}>Logging out...</p>;
};

export default Logout;