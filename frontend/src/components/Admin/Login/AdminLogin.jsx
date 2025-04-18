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
        const res = await fetch("http://localhost:5000/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          toast.success("Login successful!");
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000); // 1 second delay
        } else {
          toast.error(data.msg || "Login failed!");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      }
    } else {
      // Show validation errors as toast messages
      if (validationErrors.username) toast.error(validationErrors.username);
      if (validationErrors.password) toast.error(validationErrors.password);
    }
  };

  return (
    <section className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Panel</h2>
        <form onSubmit={handleSubmit}>
          <div className={`input-field ${errors.username ? "error" : ""}`}>
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {errors.username && <p className="error-text">{errors.username}</p>}
          <div className={`input-field ${errors.password ? "error" : ""}`}>
            <FaLock className="input-icon" />
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
