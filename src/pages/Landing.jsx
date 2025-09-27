import { useState } from 'react';
import { Link } from 'react-router-dom';
import Notifications from '../components/Notifications.jsx';
import JobOfferings from '../components/JobOfferings.jsx';
import './Landing.css';

function TabPanel({ children, value, index }) {
  return (
    <div className="landing-tab-panel" hidden={value !== index}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

export default function Landing() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="landing-container">
      {/* Header Section */}
      <header className="landing-header">
        <h1 className="landing-title">Placement Portal</h1>
        <Link to="/login">
          <button className="landing-login-button">Login</button>
        </Link>
      </header>

      {/* Tabs Section */}
      <main className="landing-tabs-section">
        <div className="landing-tabs-header">
          <div className="landing-tabs">
            <button
              className={`landing-tab ${tabValue === 0 ? 'active' : ''}`}
              onClick={() => handleTabChange(0)}
              aria-selected={tabValue === 0}
            >
              Notifications
            </button>

            <button
              className={`landing-tab ${tabValue === 1 ? 'active' : ''}`}
              onClick={() => handleTabChange(1)}
              aria-selected={tabValue === 1}
            >
              Job Offerings
            </button>
          </div>
        </div>

        <TabPanel value={tabValue} index={0}>
          <Notifications />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <JobOfferings />
        </TabPanel>
      </main>
    </div>
  );
}
