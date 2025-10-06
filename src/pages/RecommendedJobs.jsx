import React, { useState } from 'react';
import './RecommendedJobs.css';

export default function RecommendedJobs() {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Google',
      location: 'Mountain View, CA',
      description: 'Design, develop, test, deploy, maintain and improve software.',
      match: 98,
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Facebook',
      location: 'Menlo Park, CA',
      description: 'Own the product strategy and roadmap.',
      match: 95,
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Amazon',
      location: 'Seattle, WA',
      description: 'Use data to drive business decisions.',
      match: 92,
    },
  ]);

  return (
    <div className="recommended-jobs-container">
      <div className="recommended-jobs-header">
        <h1 className="recommended-jobs-title">Recommended Jobs</h1>
        <p className="recommended-jobs-subtitle">Jobs tailored to your profile.</p>
      </div>
      <div className="recommended-jobs-content">
        <div className="job-listings">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h2 className="job-card-title">{job.title}</h2>
                <p className="job-card-company">{job.company}</p>
              </div>
              <div className="job-card-body">
                <p>{job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Match:</strong> {job.match}%</p>
              </div>
              <div className="job-card-footer">
                <a href={`/jobs/${job.id}`} className="view-details-btn">View Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}