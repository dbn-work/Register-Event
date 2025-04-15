// admin/Dashboard.js
import React from 'react';
import StatCard from '../Dashboard/StatCard';
import DataTable from '../Dashboard/Datatable';
import './Dashboard.css'
import '../../../App.css'
const Dashboard = () => {
  return (
    <div>
      <div className="title">Dashboard</div>
      <div className="subtitle">Registration Details</div>
      <div className="stats-grid">
        <StatCard color="blue" icon="👥" label="Total Registration" value={425} />
        <StatCard color="green" icon="🔍" label="Search" value={39} />
        <StatCard color="orange" icon="➕" label="New Registration" value={262} />
        <StatCard color="red" icon="💳" label="Scan Card" value={124} />
      </div>
      <DataTable />
    </div>
  );
};

export default Dashboard;
