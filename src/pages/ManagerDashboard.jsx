import React from 'react';
import { Link } from 'react-router-dom';
import './ManagerDashboard.css';

const DummyCredentials = () => (
  <div className="dummy-credentials">
    <h3>Test Credentials</h3>
    <div className="credentials-card">
      <p><strong>Email:</strong> manager@test.com</p>
      <p><strong>Password:</strong> test123</p>
      <p><strong>Role:</strong> Manager</p>
      <div className="note">
        <strong>Note:</strong> These are test credentials. In a production environment, please use proper authentication.
      </div>
    </div>
  </div>
);

const ManagerDashboard = () => {
  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p className="dashboard-subtitle">Welcome to the Manager Portal. You can manage job offerings and notifications from here.</p>
      </div>

      <DummyCredentials />

      <div className="dashboard-grid">
        <Link to="/manager/notifications" className="dashboard-card">
          <h2>Manage Notifications</h2>
          <p>Create, edit, and manage notifications for all users</p>
          <div className="card-actions">
            <span className="card-arrow">→</span>
          </div>
        </Link>
        <Link to="/manager/job-offerings" className="dashboard-card">
          <h2>Manage Job Offerings</h2>
          <p>Post and manage job opportunities</p>
          <div className="card-actions">
            <span className="card-arrow">→</span>
          </div>
        </Link>
      </div>

      <div className="dashboard-info">
        <h3>Quick Tips</h3>
        <ul>
          <li>Use the navigation menu on the left to quickly access different sections</li>
          <li>You can manage job postings and send notifications to all users</li>
          <li>Make sure to log out when you're done to protect account security</li>
        </ul>
      </div>
    </div>
  );
};

export default ManagerDashboard;