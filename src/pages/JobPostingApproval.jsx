import React, { useState, useEffect } from 'react';
import './JobPostingApproval.css';

const jobPostings = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Google',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Facebook',
    status: 'Approved',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Amazon',
    status: 'Rejected',
  },
];

export default function JobPostingApproval() {
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    setPostings(jobPostings);
  }, []);

  const handleApprove = (id) => {
    setPostings(
      postings.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p))
    );
  };

  const handleReject = (id) => {
    setPostings(
      postings.map((p) => (p.id === id ? { ...p, status: 'Rejected' } : p))
    );
  };

  return (
    <div className="job-posting-approval-container">
      <div className="job-posting-approval-header">
        <h1 className="job-posting-approval-title">Job Posting Approval</h1>
        <p className="job-posting-approval-subtitle">Review and approve/reject company job postings.</p>
      </div>
      <div className="job-posting-approval-content">
        <div className="posting-list">
          {postings.map((posting) => (
            <div key={posting.id} className={`posting-card status-${posting.status.toLowerCase()}`}>
              <div className="posting-card-header">
                <h2 className="posting-card-title">{posting.title}</h2>
                <p className="posting-card-company">{posting.company}</p>
              </div>
              <div className="posting-card-body">
                <p className="posting-card-status">{posting.status}</p>
              </div>
              {posting.status === 'Pending' && (
                <div className="posting-card-footer">
                  <button className="approve-btn" onClick={() => handleApprove(posting.id)}>Approve</button>
                  <button className="reject-btn" onClick={() => handleReject(posting.id)}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
