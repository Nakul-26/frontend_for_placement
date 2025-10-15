import React from 'react';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Faculty Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Student Placement Rate</h2>
          <p>85%</p>
        </div>
        <div className="dashboard-card">
          <h2>Recent Placements</h2>
          <p>No recent placements.</p>
        </div>
        <div className="dashboard-card">
          <h2>Companies Onboarded</h2>
          <p>56</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
