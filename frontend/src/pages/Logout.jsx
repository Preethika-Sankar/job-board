import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Clear all auth-related data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("auth");

    // ✅ Redirect to login
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;