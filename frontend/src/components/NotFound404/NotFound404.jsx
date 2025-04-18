// src/components/NotFound404/NotFound404.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./NotFound404.css";

const NotFound404 = () => {
  return (
    <div className="notfound-full">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-subtitle">Page Not Found</p>
      <p className="notfound-text">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="notfound-button">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound404;
