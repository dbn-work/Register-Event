import React from 'react';
import './Home.css';
import { useNavigate } from "react-router-dom";
const Home = () => {
 
const navigate = useNavigate();
const handleRegisterClick = () => 
{
    navigate("/register");
};

const handleAdminClick = () => 
{
    navigate("/admin/login");
};

const handleSearchClick = () => 
{
    navigate("/search");
};

return (
    <div className='home-body'>
     <div className="home-container">
      <section className="hero-section">
        {/* Admin Button */}
        <button className="admin-button" onClick={handleAdminClick}>Admin</button>
        <div className="hero-overlay">
          <h1>We have the best events.<br />Get your ticket now!</h1>
          <div className="button-group">
            <button className="event-button" onClick={handleRegisterClick}>Register</button>
            <button className="event-button" onClick={handleSearchClick}>Search</button>
            <button className="event-button">Scan QR</button>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};
export default Home;
