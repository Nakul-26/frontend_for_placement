import React from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Admin Overview</h1>
        <p className="admin-dashboard-subtitle">
          A quick overview of the placement activities.
        </p>
      </header>

      <div className="admin-dashboard-grid">
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Users</h3>
          <p className="info-value">Number of users will appear here.</p>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Job Offerings</h3>
          <p className="info-value">Number of job offerings will appear here.</p>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Notifications</h3>
          <p className="info-value">Number of notifications will appear here.</p>
        </div>
      </div>
    </div>
  );
}