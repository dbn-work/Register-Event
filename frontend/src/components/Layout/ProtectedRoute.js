import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds
            // Check if the token is expired
            if (decodedToken.exp && decodedToken.exp < currentTime) {
                localStorage.removeItem("token"); // Remove expired token
                toast.error("Session expired. Please login again.");
                return <Navigate to="/admin/login" />;
            }

            return children; // Token is valid
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token"); // Remove invalid token
            toast.error("Invalid token. Please login again.");
            return <Navigate to="/admin/login" />;
        }
    }
    toast.info("Please login to access this page.");
    return <Navigate to="/admin/login" />;
};

export default ProtectedRoute;