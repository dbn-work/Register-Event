// frontend/AdminLogin.jsx

import React, { useState } from "react";
import "./AdminLogin.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
const handleSubmit = async (e) => {
    e.preventDefault();  
    const validationErrors = {};
    if (!username.trim()) validationErrors.username = "Username is required";
    if (!password.trim()) validationErrors.password = "Password is required";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await fetch("https://register-event-cwsv.onrender.com/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          navigate("/admin/dashboard");
        } else {
          toast.error(data.msg || "Login failed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

return (
    <section className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Panel</h2>
        <form onSubmit={handleSubmit}>
          <div className={`admin-input-field ${errors.username ? "error" : ""}`}>
            <FaUser className="admin-input-icon" />
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {errors.username && <p className="error-text">{errors.username}</p>}
          <div className={`admin-input-field ${errors.password ? "error" : ""}`}>
            <FaLock className="admin-input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && <p className="error-text">{errors.password}</p>}
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="admin-note">Authorized Personnel Only</p>
      </div>
    </section>
  );
};

export default AdminLogin;
