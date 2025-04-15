
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        try {
            const res = await axios.post("https://register-event-cwsv.onrender.com/api/admin/login", {
                email,
                password
            });
            localStorage.setItem("token", res.data.token);
            navigate("/admin/dashboard");
        } catch (err) {
            setShowToast(true);  // Show toast if credentials are invalid
            setTimeout(() => setShowToast(false), 3000);  // Hide toast after 3 seconds
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Admin Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <button onClick={handleLogin}>Login</button>
            </div>
            
            {showToast && (
                <div className="toast-message">
                    Invalid Credentials!
                </div>
            )}
        </div>
    );
};

export default AdminLogin;

