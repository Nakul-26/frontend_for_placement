import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="company-dashboard-container">
      <h1 className="page-title">Welcome, {user?.name || 'Company User'}!</h1>
      <p className="page-subtitle">This is your dashboard. More features will be available soon.</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Manage Job Postings</h3>
          <p>Create, edit, and view your company's job postings.</p>
          <Link to="/company/jobs" className="button">Manage Jobs</Link>
        </div>
        {/* <div className="dashboard-card">
          <h3>View Applicants</h3>
          <p>Review applications from students who applied to your jobs.</p>
          <button className="button" disabled>Coming Soon</button>
        </div>
        <div className="dashboard-card">
          <h3>Company Profile</h3>
          <p>Update your company's public profile and information.</p>
          <button className="button" disabled>Coming Soon</button>
        </div> */}
      </div>
    </div>
  );
};

export default CompanyDashboard;
