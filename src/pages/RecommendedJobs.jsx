
import React, { useState, useEffect } from 'react';
import './RecommendedJobs.css';
import { graphqlRequest } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';
import { NotificationsApiSecure } from '../services/api';

export default function RecommendedJobs() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentJobId, setCurrentJobId] = useState(null);

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
            description
            salary_range
            req_skills
            start_date
            end_date
          }
        }
      `;
      try {
        setLoading(true);
        const response = await graphqlRequest(query);
        if (Array.isArray(response.data.jobs)) {
          setJobOfferings(response.data.jobs);
        } else {
          console.warn('API did not return an array for job offerings:', response.data);
          setJobOfferings([]);
        }
      } catch (error) {
        console.error('Error fetching job offerings:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch job offerings');
        setJobOfferings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOfferings();
  }, []);

  const handleApply = async (job) => {
    console.log('Starting application process for job:', job.id || job.jobid || null);
    setSuccess(false);
    setError('');
    setCurrentJobId(job.id || job.jobid || null);
    if (!user) {
      toast.error('Please login to apply for jobs.');
      return;
    }
    console.log('User details:', user);
    console.log('Job details:', job);
    try {
      const res = await NotificationsApiSecure.post('/forms', {
        user_name: user.name || user.user_name || user.fullName || user.username || '',
        user_email: user.email || user.user_email || '',
        user_id: user.id || user.user_id || '',
        jobid: job.id || job.jobid || '',
      }, { withCredentials: true });
      console.log('Response from application submission:', res);
      const result = res.data;
      if (res.status === 200 || res.status === 201) {
        console.log('Response from application submission:', res);
        toast.success(result?.message || 'Your application was submitted successfully!');
        setSuccess(true);
        if (job.apply_link) {
          window.open(job.apply_link, '_blank', 'noopener,noreferrer');
        }
      } else {
        console.error('Error submitting application:', result);
        setError(result?.message || 'Failed to submit your application. Please try again later.');
        toast.error(result?.message || 'Failed to submit your application. Please try again later.');
      }
    } catch (err) {
      console.log('Response from application submission:', err.response);
      console.error('Network error while submitting application:', err);
      setError('Network error: Unable to submit application.');
      toast.error('Network error: Unable to submit application.');
    } finally {
      console.log('Finished handling application for job:', job.id || job.jobid || null);
    }
  };

  if (loading) {
    return (
      <div className="recommended-jobs-container">
        <h1 className="recommended-jobs-title">Jobs</h1>
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="recommended-jobs-container">
      <div className="recommended-jobs-header">
        <h1 className="recommended-jobs-title">Jobs</h1>
        {/* <p className="recommended-jobs-subtitle">Jobs tailored to your profile.</p> */}
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
                {error && currentJobId === job.id && <p className="error-message">{error}</p> }
                {success && currentJobId === job.id && <p className="success-message">Application submitted successfully!</p>}
                {/* <p>{error}</p> */}
                <div className="job-card-footer">
                  {/* <a href={`/jobs/${job.id}`} className="view-details-btn">View Details</a> */}
                  <button className="apply-now-btn" onClick={() => handleApply(job)}>
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No recommended jobs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}