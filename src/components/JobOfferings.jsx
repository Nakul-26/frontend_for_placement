
import React from 'react';
import './JobOfferings.css';
import { graphqlRequest } from '../services/api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';

export default function JobOfferings() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error2, setError2] = React.useState(null);

  const handleViewDetails = () => {
  try {
    const fromPath = user?.role ? `/${user.role}/jobs`:`/jobs`;
   // navigate('/login', { state: { from: fromPath } });
   navigate('/login');

  } catch(err) {
    setError2(err.message);
    console.log(" error on click:", err);
  }
  };

  const handleApply = () => {
    try {
      const fromPath = user?.role ? `/${user.role}/jobs`:`/jobs`;
     // navigate('/login', { state: { from: fromPath } });
     navigate('/login');
  
    } catch(err) {
      setError2(err.message);
      console.log(" error on click:", err);
    }
  };

  useEffect(() => {
    const fetchJobOfferings = async () => {
      const query = `
        query GetAllJobs {
          jobs {
            id
            title
            company_name
            company_logo
            location
            start_date
            end_date
          }
        }
      `;
      try {
        setLoading(true);
        const response = await graphqlRequest(query);
        setJobs(response.data.jobs || []);
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
      {error2 && <p>{error2}</p>}
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
                {/* <button >Apply</button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}