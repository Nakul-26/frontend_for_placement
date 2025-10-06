import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import '../pages/Login.css';

const RoleLoginForm = ({ role }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      setLoading(true);
      // Pass the role to the login function
      await login(email, password, role);
      // Navigate to a role-specific dashboard
      const from = location.state?.from || `/${role}/dashboard`;
      navigate(from);
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Add role to the Google login URL if needed
    window.location.href = `http://localhost:3000/auth/google?role=${role}`;
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h1 className="login-title">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h1>
        <p className="login-subtitle">Sign in to continue to your dashboard</p>

        {error && (
          <div className="login-alert" role="alert">
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <input
            id='email'
            className="login-input"
            type="email"
            placeholder="Email Address"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id='password'
            className="login-input"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            type="button"
            className="login-google-button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? 'Redirecting...' : `Sign in with Google`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleLoginForm;
