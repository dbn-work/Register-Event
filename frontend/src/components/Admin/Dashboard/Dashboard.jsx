import React, { useEffect, useState } from 'react';
import StatCard from '../Dashboard/StatCard';
import './Dashboard.css';
import '../../../App.css';
import axios from 'axios';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    total: 0,
    userCount: 0,
    registrationCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get('https://register-event-cwsv.onrender.com/api/dashboard/counts');
        setCounts(res.data);
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <div className="title">Dashboard</div>
      <div className="subtitle">Registration Details</div>
      <div className="stats-grid">
        <StatCard color="blue" icon="👥" label="Total Registration" value={counts.total} />
        <StatCard color="green" icon="🔍" label="Search" value={counts.userCount} />
        <StatCard color="orange" icon="➕" label="New Registration" value={counts.registrationCount} />
        <StatCard color="red" icon="💳" label="Scan Card" value={124} /> {/* You can also make this dynamic later */}
      </div>
    </div>
  );
};

export default Dashboard;
