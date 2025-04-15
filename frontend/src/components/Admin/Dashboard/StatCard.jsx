//StatCard.jsx

import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, label, value, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="icon">{icon}</div>
      <div className="info">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
