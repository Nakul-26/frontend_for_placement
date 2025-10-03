import React, { useState } from 'react';
import './JobSearch.css';

const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    description: 'Design, develop, test, deploy, maintain and improve software.',
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Facebook',
    location: 'Menlo Park, CA',
    description: 'Own the product strategy and roadmap.',
    type: 'Full-time',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Amazon',
    location: 'Seattle, WA',
    description: 'Use data to drive business decisions.',
    type: 'Full-time',
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    description: 'Create amazing user experiences.',
    type: 'Full-time',
  },
  {
    id: 5,
    title: 'Software Engineer Intern',
    company: 'Microsoft',
    location: 'Redmond, WA',
    description: 'Work on real projects and make an impact.',
    type: 'Internship',
  },
];

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState('all');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  const filteredJobs = jobs
    .filter((job) => {
      if (jobType !== 'all' && job.type !== jobType) {
        return false;
      }
      if (location && !job.location.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'relevance') {
        return 0;
      }
      if (sortBy === 'date') {
        return 0; // Replace with actual date sorting
      }
      return 0;
    });

  return (
    <div className="job-search-container">
      <div className="job-search-header">
        <h1 className="job-search-title">Job Search</h1>
        <p className="job-search-subtitle">Find your next opportunity.</p>
      </div>
      <div className="job-search-filters">
        <input
          type="text"
          className="form-input"
          placeholder="Search for jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="form-select" value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="all">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
        </select>
        <input
          type="text"
          className="form-input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="relevance">Sort by Relevance</option>
          <option value="date">Sort by Date</option>
        </select>
      </div>
      <div className="job-search-content">
        <div className="job-listings">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="job-card-header">
                <h2 className="job-card-title">{job.title}</h2>
                <p className="job-card-company">{job.company}</p>
              </div>
              <div className="job-card-body">
                <p>{job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.type}</p>
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
