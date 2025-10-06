import React, { useState } from 'react';
import './StudentProfile.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    major: 'Computer Science',
    graduationYear: 2024,
    cgpa: 3.8,
    skills: ['React', 'Node.js', 'Python', 'SQL'],
    resume: 'resume.pdf',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    // Handle file upload logic here
    if (e.target.files.length > 0) {
      setProfile({ ...profile, resume: e.target.files[0].name });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-section">
        <h2 className="section-title">Personal Details</h2>
        {isEditing ? (
          <div className="form-grid">
            <input type="text" name="name" value={profile.name} onChange={handleInputChange} placeholder="Full Name" />
            <input type="email" name="email" value={profile.email} onChange={handleInputChange} placeholder="Email" />
            <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} placeholder="Phone" />
          </div>
        ) : (
          <div className="details-grid">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2 className="section-title">Education</h2>
        {isEditing ? (
          <div className="form-grid">
            <input type="text" name="major" value={profile.major} onChange={handleInputChange} placeholder="Major" />
            <input type="number" name="graduationYear" value={profile.graduationYear} onChange={handleInputChange} placeholder="Graduation Year" />
            <input type="number" name="cgpa" value={profile.cgpa} onChange={handleInputChange} placeholder="CGPA" step="0.1" />
          </div>
        ) : (
          <div className="details-grid">
            <p><strong>Major:</strong> {profile.major}</p>
            <p><strong>Graduation Year:</strong> {profile.graduationYear}</p>
            <p><strong>CGPA:</strong> {profile.cgpa}</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2 className="section-title">Skills</h2>
        <div className="skills-container">
          {profile.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
        {isEditing && <input type="text" placeholder="Add a skill (comma-separated)" className="skills-input" />}
      </div>

      <div className="profile-section">
        <h2 className="section-title">Resume</h2>
        <div className="resume-section">
          <p>{profile.resume}</p>
          {isEditing && <input type="file" onChange={handleFileChange} />}
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

export default StudentProfile;