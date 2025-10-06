import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.jsx';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 2, // default role (user)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.includes('@')) return 'Invalid email address';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/register', form, { withCredentials: true });
      if (res.data.success) {
        setSuccess('✅ Registered successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-paper">
        <h1 className="register-title">Create an Account</h1>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <form noValidate onSubmit={handleSubmit} className="register-form">
          <input
            className="register-input"
            type="text"
            id="name"
            placeholder="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="register-input"
            type="email"
            id="email"
            placeholder="Email Address"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="register-input"
            type="password"
            id="password"
            placeholder="Password"
            name="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />
          <select
            className="register-select"
            id="role_id"
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
          >
            <option value={1}>Admin</option>
            <option value={2}>User</option>
            <option value={3}>Manager</option>
          </select>
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <div className="register-link">
            <Link to="/login">{"Already have an account? Sign In"}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;