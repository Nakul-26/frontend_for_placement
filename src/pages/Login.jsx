import { use, useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login, refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already authenticated, redirect to role dashboard
    const checkAuth = async () => {
      try {
        setLoading(true);
        const { success } = await refresh();
        if (success) {
          // First check location state, then fallback to role dashboard
          const from = location.state?.from || `/${role}/dashboard`;
          navigate(from);
          return;
        }
      } catch {
        // Not authenticated, no action needed
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [refresh, navigate, location.state, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password || !role) {
      setError('All fields are required.');
      return;
    }
    try {
      setLoading(true);
      const result = await login(email, password, role);
      if (!result?.success) {
        setError(result?.error?.response?.data?.message || 'Login failed.');
        return;
      }
      setSuccess('Login successful! Redirecting...');
      // Prefer the server-provided user role to avoid mismatches
      const loggedInUser = result?.data?.user ?? null;
      if (loggedInUser && loggedInUser.role && loggedInUser.role.toLowerCase() !== role.toLowerCase()) {
        setError(`Logged in user role (${loggedInUser.role}) does not match the selected role (${role}).`);
        setSuccess('');
        return;
      }
      // Navigate to the original requested location (if any), else to role dashboard
      const requested = typeof location.state?.from === 'string' ? location.state.from : (location.state?.from ?? null);
      const from = requested || `/${role}/dashboard`;
      setTimeout(() => {
        navigate(from);
      }, 1000);
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Sign in to continue to your dashboard</p>

        {error && (
          <div className="login-alert" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="login-success" role="alert">
            {success}
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
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              id='password'
              className="login-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="role-select-container">
            {/* <label htmlFor="role" className="role-label">Role:</label> */}
            <select
              id="role"
              className="role-select"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {/* <Link to="/register" className="register-link">Don't have an account? Register</Link> */}
      </div>
    </div>
  );
};

export default Login;
