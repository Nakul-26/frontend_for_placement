import React from 'react';
import { useAuth } from '../context/useAuth';
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
        {/* <div className="dashboard-card">
          <div className="card-icon">📝</div>
          <h2>My Profile</h2>
          <p>Create/Edit profile, academic details, skills, experience. Upload/View Resume.</p>
          <a href="/student/profile" className="card-link">View Profile</a>
        </div> */}
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
        {/* <div className="dashboard-card">
          <div className="card-icon">💼</div>
          <h2>Recommended Jobs</h2>
          <p>List of jobs tailored to your profile.</p>
          <a href="/student/recommended-jobs" className="card-link">View Jobs</a>
        </div> */}
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
        {/* <div className="dashboard-card">
          <div className="card-icon">🔔</div>
          <h2>Notifications</h2>
          <p>In-app alerts for job status, quiz schedules, announcements.</p>
          <a href="/student/notifications" className="card-link">View Notifications</a>
        </div> */}
        {/* <div className="dashboard-card">
          <div className="card-icon">💬</div>
          <h2>Chat</h2>
          <p>Real-time chat with Faculty/Company recruiters.</p>
          <a href="/chat" className="card-link">Open Chat</a>
        </div> */}
      </div>
    </div>
  );
};

export default StudentDashboard;
