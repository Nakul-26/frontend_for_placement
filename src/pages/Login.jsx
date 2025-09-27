import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h1 className="login-title">Welcome Back</h1>
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
            {loading ? 'Redirecting...' : 'Sign in with Google'}
          </button>

          {/* <hr className="login-divider" /> */}
          {/* <hr /> */}
          <br />

          {/* <p className="login-signup-text">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="login-signup-link">
              Sign Up
            </Link>
          </p> */}
        </form>
      </div>
    </div>
  );
}