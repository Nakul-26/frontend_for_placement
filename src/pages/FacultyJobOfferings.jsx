import React, { useState, useEffect } from 'react';
// import './RecommendedJobs.css'; // Reusing the CSS for now
import { getJobOfferings } from '../services/api';
import { toast } from 'react-toastify';

export default function FacultyJobOfferings() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobOfferings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getJobOfferings();
        if (Array.isArray(response.data.jobs)) {
          setJobOfferings(response.data.jobs);
          toast.success('Job offerings fetched successfully!');
        } else {
          console.warn('API did not return an array for job offerings:', response.data);
          setJobOfferings([]);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch job offerings';
        setError(errorMessage);
        toast.error(errorMessage);
        setJobOfferings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOfferings();
  }, []);

  if (loading) {
    return (
      <div className="recommended-jobs-container">
        <h1 className="recommended-jobs-title">Job Offerings</h1>
        <p>Loading job offerings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommended-jobs-container">
        <h1 className="recommended-jobs-title">Job Offerings</h1>
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="recommended-jobs-container">
      <div className="recommended-jobs-header">
        <h1 className="recommended-jobs-title">Job Offerings</h1>
      </div>
      <div className="recommended-jobs-content">
        <div className="job-listings">
          {jobOfferings.length > 0 ? (
            jobOfferings.map((job) => (
              <div key={job.id || job.title} className="job-card">
                <div className="job-card-header">
                  {job.company_logo && <img src={job.company_logo} alt={`${job.company_name} logo`} className="company-logo" />}
                  <div>
                    <h2 className="job-card-title">{job.title}</h2>
                    <p className="job-card-company">{job.company_name}</p>
                  </div>
                </div>
                <div className="job-card-body">
                  <p>{job.description}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> {job.salary_range}</p>
                  <div>
                    <strong>Skills:</strong>
                    <ul className="skills-list">
                      {Array.isArray(job.req_skills) && job.req_skills.map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                  </div>
                  <p><strong>Applications Opens from:</strong> {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Applications Closes on:</strong> {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No job offerings available.</p>
          )}
        </div>
      </div>
    </div>
  );
}