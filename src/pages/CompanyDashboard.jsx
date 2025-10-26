
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const { user, companyDetails, fetchCompanyDetails, loading } = useAuth();

  useEffect(() => {
    if (!companyDetails) {
      fetchCompanyDetails();
    }
  }, [companyDetails, fetchCompanyDetails]);

  return (
    <div className="company-dashboard-container">
      <h1 className="page-title">Welcome, {user?.name || 'Company User'}!</h1>
      <p className="page-subtitle">This is your dashboard. More features will be available soon.</p>

      {loading && !companyDetails ? (

      <p>Loading company details...</p>
      ) : companyDetails ? (
        <div className="company-details">
          <img src={companyDetails.logo} alt={`${companyDetails.name} logo`} className="company-logo" />
          <h2>{companyDetails.name}</h2>
          <p>{companyDetails.description}</p>
          <p><strong>Email:</strong> {companyDetails.email}</p>
          <p><strong>Phone:</strong> {companyDetails.phone}</p>
          <p><strong>Headquarters:</strong> {companyDetails.headquarters.join(', ')}</p>
          <p><strong>Sub-branches:</strong> {companyDetails.sub_branch_location.join(', ')}</p>
          <p><strong>Industry Type:</strong> {companyDetails.type.join(', ')}</p>
        </div>
      ) : (
        <p>Could not load company details.</p>
      )}
      
      <div className="dashboard-grid">
        {/* <div className="dashboard-card">
          <h3>Manage Job Postings</h3>
          <p>Create, edit, and view your company's job postings.</p>
          <Link to="/company/jobs" className="button">Manage Jobs</Link>
        </div> */}
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

