import React from 'react';
import { useAuth } from '../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="student-dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <p>Here is a summary of your placement activities.</p>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📝</div>
          <h2>Upcoming Assessments</h2>
          <p>You have 2 upcoming assessments.</p>
          <a href="/student/assessments" className="card-link">View Assessments</a>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">📄</div>
          <h2>My Applications</h2>
          <p>You have applied to 5 jobs.</p>
          <a href="#" className="card-link">Track Applications</a>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">💼</div>
          <h2>Recommended Jobs</h2>
          <p>We have found 10 jobs that match your profile.</p>
          <a href="#" className-="card-link">View Jobs</a>
        </div>
        <div className="dashboard-card">
          <div className="card-icon">📚</div>
          <h2>Skill Development</h2>
          <p>Continue your learning journey.</p>
          <a href="/student/skill-development" className="card-link">Browse Resources</a>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
