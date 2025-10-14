import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [data, setData] = useState({
    users: 0,
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
          users: 150,
          jobOfferings: 25,
          notifications: 50,
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
          <p className="info-value">{data.users}</p>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Job Offerings</h3>
          <p className="info-value">{data.jobOfferings}</p>
        </div>

        <div className="dashboard-card">
          <h3 className="dashboard-card-title">Notifications</h3>
          <p className="info-value">{data.notifications}</p>
        </div>
      </div>
    </div>
  );
}