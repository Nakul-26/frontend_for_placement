import React from 'react';
import './JobOfferings.css';
import { api } from '../services/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';

export default function JobOfferings() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = () => {
  try {
   navigate('/login');

  } catch(err) {
    setError(err.message);
    console.log(" error on click:", err);
  }
  };

  useEffect(() => {
    const fetchJobOfferings = async () => {
      try {
        setLoading(true);
        setError(null);
        const config = {
            withCredentials: true,
        }
        const res = await api.get(`${import.meta.env.VITE_NOTIFICATIONS_URL}/alljobdata`, config);
        console.log('job offerings res: ', res);
        setJobs(res.data.jobs || []);
        toast.success('Job offerings fetched successfully!');
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch job offerings';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchJobOfferings();
  }, []);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="job-offerings-container">
      <div className="job-listings">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
                <img src={job.company_logo} alt={`${job.company_name} logo`} className="company-logo" />
                <div>
                    <div className="job-title">{job.title}</div>
                    <div className="company-name">{job.company_name}</div>
                </div>
            </div>
            <div className="job-card-body">
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Start Date:</strong> {new Date(job.start_date).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(job.end_date).toLocaleDateString()}</p>
            </div>
            <div className="job-card-footer">
                <button onClick={handleViewDetails} className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}