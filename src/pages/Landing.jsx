import { useState } from 'react';
import { Link } from 'react-router-dom';
import Notifications from '../components/Notifications.jsx';
import JobOfferings from '../components/JobOfferings.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import PublicJobListing from './PublicJobListing.jsx';
import SkillDevelopment from './SkillDevelopment.jsx';
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

            <button
              className={`landing-tab ${tabValue === 2 ? 'active' : ''}`}
              onClick={() => handleTabChange(2)}
              aria-selected={tabValue === 2}
            >
              About Us
            </button>

            <button
              className={`landing-tab ${tabValue === 3 ? 'active' : ''}`}
              onClick={() => handleTabChange(3)}
              aria-selected={tabValue === 3}
            >
              Contact Us
            </button>

            <button
              className={`landing-tab ${tabValue === 4 ? 'active' : ''}`}
              onClick={() => handleTabChange(4)}
              aria-selected={tabValue === 4}
            >
              Job Listings
            </button>

            <button
              className={`landing-tab ${tabValue === 5 ? 'active' : ''}`}
              onClick={() => handleTabChange(5)}
              aria-selected={tabValue === 5}
            >
              Skill Development
            </button>
          </div>
        </div>

        <TabPanel value={tabValue} index={0}>
          <Notifications />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <JobOfferings />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <About />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Contact />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <PublicJobListing />
        </TabPanel>
        <TabPanel value={tabValue} index={5}>
          <SkillDevelopment />
        </TabPanel>
      </main>
    </div>
  );
}
