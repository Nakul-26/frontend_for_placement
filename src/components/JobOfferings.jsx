import React from 'react';
import './JobOfferings.css';
import { api } from '../services/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } form '../context/AuthProvider';

export default function JobOfferings() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewDetails = () => {
    navigate('/login', { state: { from: `/${user.role}/jobs` } });
  };

  useEffect(() => {
    const fetchJobOfferings = async () => {
      try {
        setLoading(true);
        const config = {
            withCredentials: true,
        }
        const res = await api.get(`${import.meta.env.VITE_NOTIFICATIONS_URL}/jobs`, config);
        console.log('job offerings res: ', res);
        setJobs(res.data.jobs || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch job offerings');
      } finally {
        setLoading(false);
      }
    };
    fetchJobOfferings();
  }, []);


  return (
    <div className="job-offerings-container">
      {loading && <p>Loading...</p>}
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