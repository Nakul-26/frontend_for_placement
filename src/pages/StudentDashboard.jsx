import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { toast } from 'react-toastify';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    applications: 0,
    recommendedJobs: 0,
    pendingQuizzes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success
        const mockData = {
          applications: 5,
          recommendedJobs: 10,
          pendingQuizzes: 2,
        };
        setData(mockData);
        toast.success("Dashboard data loaded successfully!");

        // To test error state, uncomment the following lines and comment out the success part.
        // throw new Error("Failed to fetch dashboard data");

      } catch (err) {
        const errorMessage = err.message || "Failed to fetch dashboard data";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

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
          <p>You have {data.applications} active applications.</p>
          {/* <a href="/student/my-applications" className="card-link">Track Applications</a> */}
        </div>
        {/* <div className="dashboard-card">
          <div className="card-icon">💼</div>
          <h2>Recommended Jobs</h2>
          <p>There are {data.recommendedJobs} jobs recommended for you.</p>
          <a href="/student/recommended-jobs" className="card-link">View Jobs</a>
        </div> */}
        <div className="dashboard-card">
          <div className="card-icon">❓</div>
          <h2>My Quizzes/Tests</h2>
          <p>You have {data.pendingQuizzes} pending assessments.</p>
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
