
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { NotificationsApiSecure } from '../services/api';
import './CompanyDashboard.css';
import { toast } from 'react-toastify';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await NotificationsApiSecure.get('/companyonly');
        setCompanyDetails(response.data.company);
      } catch (error) {
        console.error('Error fetching company details:', error);
        toast.error('Failed to load company details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  return (
    <div className="company-dashboard-container">
      <h1 className="page-title">Welcome, {user?.name || 'Company User'}!</h1>
      <p className="page-subtitle">This is your dashboard. More features will be available soon.</p>

      {/* {loading ? (
        <p>Loading company details...</p>
      ) : companyDetails ? (
        <div className="company-details">
          <h2>{companyDetails.name}</h2>
          <p>{companyDetails.description}</p>
          <p><strong>Website:</strong> <a href={companyDetails.website} target="_blank" rel="noopener noreferrer">{companyDetails.website}</a></p>
          <p><strong>Industry:</strong> {companyDetails.industry}</p>
          <p><strong>Location:</strong> {companyDetails.location}</p>
        </div>
      ) : (
        <p>Could not load company details.</p>
      )} */}
      
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

