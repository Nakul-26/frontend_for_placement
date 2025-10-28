import React, { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, fetchStudentDetails, studentDetails } = useAuth();

  console.log("test2");
  useEffect(() => {
    console.log("test1");
    fetchStudentDetails(user.id);
  }, [user, fetchStudentDetails]);

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <p>Here is a summary of your placement activities.</p>
      </div>
      {studentData && (
        <div className="dashboard-card student-data-card"> {/* Added student-data-card for specific styling if needed */}
          <div className="card-icon">👨‍🎓</div> {/* Student icon */}
          <h2>Student Information</h2>
          <div className="student-details-grid"> {/* New div for better layout of details */}
            <p><strong>Student ID:</strong> {studentData.id}</p>
            <p><strong>Official Email:</strong> {studentData.offical_email}</p>
            <p><strong>Personal Email:</strong> {studentData.personal_email}</p>
            <p><strong>Phone Number:</strong> {studentData.phone_number}</p>
            <p><strong>CGPA:</strong> {studentData.CGPA}</p>
            {studentData.resume && <p><strong>Resume:</strong> <a href={studentData.resume} target="_blank" rel="noopener noreferrer" className="card-link">View Resume</a></p>}
            {studentData.LeetCode && <p><strong>LeetCode:</strong> <a href={studentData.LeetCode} target="_blank" rel="noopener noreferrer" className="card-link">Profile</a></p>}
            {studentData.HackerRank && <p><strong>HackerRank:</strong> <a href={studentData.HackerRank} target="_blank" rel="noopener noreferrer" className="card-link">Profile</a></p>}
            {studentData.HackerEarth && <p><strong>HackerEarth:</strong> <a href={studentData.HackerEarth} target="_blank" rel="noopener noreferrer" className="card-link">Profile</a></p>}
            {studentData.linkedin && <p><strong>LinkedIn:</strong> <a href={studentData.linkedin} target="_blank" rel="noopener noreferrer" className="card-link">Profile</a></p>}
            <p><strong>Account Created:</strong> {new Date(studentData.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      )}
      <div className="dashboard-grid">
        {/* The rest of the dashboard cards remain unchanged */}
        <div className="dashboard-card">
          <div className="card-icon">🔍</div>
          <h2>Job Search</h2>
          <p>Advanced search (filters/sorting) on job postings.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📄</div>
          <h2>My Applications</h2>
          <p>List of all applications with status.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">❓</div>
          <h2>My Quizzes/Tests</h2>
          <p>List of scheduled, pending, and completed assessments.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📈</div>
          <h2>Score History</h2>
          <p>Detailed breakdown of past assessment scores.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h2>Skill Development</h2>
          <p>Continue your learning journey.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🗺️</div>
          <h2>Skill Roadmaps</h2>
          <p>Access to tutorials, content, and learning paths.</p>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🔖</div>
          <h2>My Saved Content</h2>
          <p>Bookmarks for tutorials/resources.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
