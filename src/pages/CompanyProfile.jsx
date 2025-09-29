import React, { useState } from 'react';
import './CompanyProfile.css';

const initialProfile = {
  name: 'Tech Solutions Inc.',
  website: 'www.techsolutions.com',
  industry: 'Information Technology',
  description: 'A leading provider of innovative tech solutions.',
};

const jobPostings = [
  { id: 1, title: 'Frontend Developer', applications: 45, status: 'Open' },
  { id: 2, title: 'Backend Developer', applications: 32, status: 'Open' },
  { id: 3, title: 'Data Analyst', applications: 50, status: 'Closed' },
];

const CompanyProfile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div className="company-profile-container">
      <div className="profile-header">
        <h1>{profile.name}</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Company Details</h2>
        {isEditing ? (
          <div className="form-grid">
            <input type="text" name="name" value={profile.name} onChange={handleInputChange} placeholder="Company Name" />
            <input type="text" name="website" value={profile.website} onChange={handleInputChange} placeholder="Website" />
            <input type="text" name="industry" value={profile.industry} onChange={handleInputChange} placeholder="Industry" />
            <textarea name="description" value={profile.description} onChange={handleInputChange} placeholder="Description" rows="4"></textarea>
          </div>
        ) : (
          <div className="details-view">
            <p><strong>Website:</strong> <a href={`http://${profile.website}`} target="_blank" rel="noopener noreferrer">{profile.website}</a></p>
            <p><strong>Industry:</strong> {profile.industry}</p>
            <p><strong>About:</strong> {profile.description}</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2 className="section-title">Manage Job Postings</h2>
        <div className="job-postings-list">
          <div className="job-table-header">
            <span>Title</span>
            <span>Applications</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {jobPostings.map((job) => (
            <div key={job.id} className="job-row">
              <span>{job.title}</span>
              <span>{job.applications}</span>
              <td><span className={`status status-${job.status.toLowerCase()}`}>{job.status}</span></td>
              <div className="job-actions">
                <button className="action-btn">View</button>
                <button className="action-btn">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="profile-actions">
          <button className="save-button" onClick={() => setIsEditing(false)}>Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;