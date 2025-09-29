import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container role-selection-container">
      <div className="login-paper role-selection-paper">
        <h1 className="login-title">Choose Your Role</h1>
        <p className="login-subtitle">Select your role to sign in</p>
        <div className="role-buttons-container">
          <button className="role-button" onClick={() => navigate('/login/student')}>
            <h2>Student</h2>
            <p>Access your dashboard, apply for jobs, and track your progress.</p>
          </button>
          <button className="role-button" onClick={() => navigate('/login/faculty')}>
            <h2>Faculty</h2>
            <p>Monitor student progress, manage placements, and view analytics.</p>
          </button>
          <button className="role-button" onClick={() => navigate('/login/admin')}>
            <h2>Admin</h2>
            <p>Manage users, roles, permissions, and site-wide settings.</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
