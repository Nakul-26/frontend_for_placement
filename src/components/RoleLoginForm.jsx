import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import '../pages/Login.css';

const RoleLoginForm = ({ role }) => {
  const { login, refresh, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const attemptRefresh = async () => {
      if (isAuthenticated) {
        setLoading(true);
        const from = location.state?.from || `/${role}/dashboard`;
        navigate(from);
        return;
      }
      try {
        setLoading(true);
        const { success } = await refresh();
        if (!cancelled && success) {
          const from = location.state?.from || `/${role}/dashboard`;
          navigate(from);
        }
      } catch (err) {
        // a toast is already shown in the refresh function
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    attemptRefresh();
    return () => { cancelled = true; };
  }, [isAuthenticated, refresh, navigate, location.state, role]);

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
      const result = await login(email, password, role);
      console.debug('RoleLoginForm: login result', result);
      if (!result?.success) {
        setError(result?.error?.response?.data?.message || 'Login failed.');
        return;
      }
      // Prefer the server-provided user role to avoid mismatches
      const loggedInUser = result?.data?.user ?? null;
      if (loggedInUser && loggedInUser.role && loggedInUser.role.toLowerCase() !== role.toLowerCase()) {
        setError(`Logged in user role (${loggedInUser.role}) does not match the requested role (${role}).`);
        return;
      }

      // Navigate to the original requested location (if any), else to role dashboard
      const requested = typeof location.state?.from === 'string' ? location.state.from : (location.state?.from ?? null);
      const from = requested || `/${role}/dashboard`;
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

  if (loading) {
    return <div className="login-container"><div className="login-paper"><h1>Loading...</h1></div></div>;
  }

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
