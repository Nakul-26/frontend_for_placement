import React from 'react';
import './JobOfferings.css';
import api from '../services/api';
import { useEffect } from 'react';

export default function JobOfferings() {
    const [jobs, setJobs] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchJobOfferings = async () => {
      try {
        setLoading(true);
        const config = {
            withCredentials: true,
        }
        const res = await api.get('https://notification-31at.onrender.com/alljobdata', config);
        console.log('job offerings res: ', res);
        setJobs(res.data.jobs || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch job offerings');
      } finally {
        setLoading(false);
      }
    };
    fetchJobOfferings();
  }, []);


  return (
    <div className="job-offerings-container">
      {/* <h2 className="job-offerings-title">Job Offerings</h2> */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
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
                {/* <p>{job.description}</p> */}
                <p><strong>Location:</strong> {job.location}</p>
                {/* <p><strong>Salary:</strong> {job.salary_range}</p> */}
                {/* <div>
                    <strong>Skills:</strong>
                    <ul className="skills-list">
                        {job.req_skills.map(skill => <li key={skill}>{skill}</li>)}
                    </ul>
                </div> */}
                <p><strong>Start Date:</strong> {new Date(job.start_date).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(job.end_date).toLocaleDateString()}</p>
            </div>
            <div className="job-card-footer">
                <a href={`/jobs/${job.id}`} className="view-details-btn">View Details</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}