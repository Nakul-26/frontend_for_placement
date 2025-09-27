import { useAuth } from "../context/AuthContext.jsx";
import './Dashboard.css';

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <h1 className="page-title">Placement Dashboard</h1>
      <p className="page-subtitle">
        Manage users, roles, and placement activities all in one place.
      </p>

      {user && (
        <div className="table-container">
          <h2 className="page-title">Hello, {user.name}</h2>
          <div className="dashboard-user-info">
            <div className="dashboard-user-info-item">
              <EmailIcon />
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">{user.email}</p>
              </div>
            </div>
            <div className="dashboard-user-info-item">
              <KeyIcon />
              <div>
                <p className="info-label">Role</p>
                <p className="info-value">{user.role_id}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <h3 className="page-title">Quick Metrics</h3>
        <p className="info-value">Metrics and widgets will appear here.</p>
      </div>

      <div className="table-container">
        <h3 className="page-title">Another Card</h3>
        <p className="info-value">This is another example card.</p>
      </div>
    </div>
  );
}
