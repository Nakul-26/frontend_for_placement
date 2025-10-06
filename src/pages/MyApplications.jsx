import React, { useState } from 'react';
import './MyApplications.css';

export default function MyApplications() {
  const [myApplications] = useState([
    {
      id: 1,
      jobTitle: 'Software Engineer',
      company: 'Google',
      status: 'Applied',
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      company: 'Facebook',
      status: 'Shortlisted',
    },
    {
      id: 3,
      jobTitle: 'Data Scientist',
      company: 'Amazon',
      status: 'Interview',
    },
    {
      id: 4,
      jobTitle: 'UX Designer',
      company: 'Apple',
      status: 'Rejected',
    },
    {
      id: 5,
      jobTitle: 'Software Engineer Intern',
      company: 'Microsoft',
      status: 'Placed',
    },
  ]);

  return (
    <div className="my-applications-container">
      <div className="my-applications-header">
        <h1 className="my-applications-title">My Applications</h1>
        <p className="my-applications-subtitle">Track the status of your job applications.</p>
      </div>
      <div className="my-applications-content">
        <div className="application-list">
          {myApplications.map((app) => (
            <div key={app.id} className={`application-card status-${app.status.toLowerCase()}`}>
              <div className="application-card-header">
                <h2 className="application-card-title">{app.jobTitle}</h2>
                <p className="application-card-company">{app.company}</p>
              </div>
              <div className="application-card-body">
                <p className="application-card-status">{app.status}</p>
              </div>
              <div className="application-card-footer">
                <a href={`/jobs/${app.id}`} className="view-details-btn">View Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
