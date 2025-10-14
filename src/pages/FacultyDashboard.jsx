import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const [data, setData] = useState({
    placementRate: '0%',
    recentPlacements: 'No recent placements.',
    companiesOnboarded: 0,
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
          placementRate: '85%',
          recentPlacements: 'John Doe at Google, Jane Smith at Microsoft',
          companiesOnboarded: 56,
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
    <div className="dashboard-container">
      <h1 className="dashboard-title">Faculty Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Student Placement Rate</h2>
          <p>{data.placementRate}</p>
        </div>
        <div className="dashboard-card">
          <h2>Recent Placements</h2>
          <p>{data.recentPlacements}</p>
        </div>
        <div className="dashboard-card">
          <h2>Companies Onboarded</h2>
          <p>{data.companiesOnboarded}</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
