import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Landing.css';

const PublicJobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/job-offerings');
        setJobs(res.data || []);
      } catch (error) {
        console.error('Error fetching job offerings:', error);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-tab-panel">
      <h2 className="landing-section-title">Job Listings</h2>
      <div className="job-listings">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.description}</p>
            <Link to={`/jobs/${job.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicJobListing;
