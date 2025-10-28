import React, { useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, fetchStudentDetails, studentDetails } = useAuth();

  useEffect(() => {
    fetchStudentDetails(user.id);
  }, [fetchStudentDetails]);

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <p>Here is a summary of your placement activities.</p>
      </div>

      {/* 👇 Student details section */}
      {studentDetails ? (
        <div className="student-info-card">
          <h2>🎓 Student Details</h2>
          <div className="student-info-grid">
            <p><strong>Name:</strong> {studentDetails.name}</p>
            <p><strong>Email:</strong> {studentDetails.email}</p>
            {/* <p><strong>Registration No:</strong> {studentDetails.registration_no}</p> */}
            {/* <p><strong>Department:</strong> {studentDetails.department}</p> */}
            {/* <p><strong>Year:</strong> {studentDetails.year}</p> */}
            <p><strong>CGPA:</strong> {studentDetails.cgpa}</p>
            
          </div>
        </div>
      ) : (
        <p className="loading-text">Loading your details...</p>
      )}

      <div className="dashboard-grid">
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
