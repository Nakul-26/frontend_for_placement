import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  const [data, setData] = useState({
    jobOfferings: 0,
    notifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success
        const mockData = {
          jobOfferings: 10,
          notifications: 5,
        };
        setData(mockData);
        toast.success("Dashboard data loaded successfully!");

        // To test error state, uncomment the following lines and comment out the success part.
        // throw new Error("Failed to fetch dashboard data");

      } catch (err) {
        const errorMessage = err.message || "Failed to fetch dashboard data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

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
          <p>You have sent {data.notifications} notifications.</p>
          <div className="card-actions">
            <span className="card-arrow">→</span>
          </div>
        </Link>
        <Link to="/manager/job-offerings" className="dashboard-card">
          <h2>Manage Job Offerings</h2>
          <p>You have posted {data.jobOfferings} job offerings.</p>
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