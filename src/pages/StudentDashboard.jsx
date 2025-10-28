import React from 'react';
import { useAuth } from '../context/useAuth';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, studentData, fetchStudentDetails } = useAuth();

  // The useEffect for fetching student details is now handled in AuthProvider.jsx
  // This useEffect is no longer needed here.

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
          {/* <a href="/student/job-search" className="card-link">Search Jobs</a> */}
        </div>
        <div className="dashboard-card">
          <div className="card-icon">📄</div>
          <h2>My Applications</h2>
          <p>List of all applications with status.</p>
          {/* <a href="/student/my-applications" className="card-link">Track Applications</a> */}
        </div>
        <div className="dashboard-card">
          <div className="card-icon">❓</div>
          <h2>My Quizzes/Tests</h2>
          <p>List of scheduled, pending, and completed assessments.</p>
          {/* <a href="/student/assessments" className="card-link">View Assessments</a> */}
        </div>
        <div className="dashboard-card">
          <div className="card-icon">📈</div>
          <h2>Score History</h2>
          <p>Detailed breakdown of past assessment scores.</p>
          {/* <a href="/student/score-history" className="card-link">View Scores</a> */}
        </div>
        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h2>Skill Development</h2>
          <p>Continue your learning journey.</p>
          {/* <a href="/student/skill-development" className="card-link">Browse Resources</a> */}
        </div>
        <div className="dashboard-card">
          <div className="card-icon">🗺️</div>
          <h2>Skill Roadmaps</h2>
          <p>Access to tutorials, content, and learning paths.</p>
          {/* <a href="/student/skill-roadmaps" className="card-link">Browse Roadmaps</a> */}
        </div>
        <div className="dashboard-card">
          <div className="card-icon">🔖</div>
          <h2>My Saved Content</h2>
          <p>Bookmarks for tutorials/resources.</p>
          {/* <a href="/student/my-saved-content" className="card-link">View Content</a> */}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
