import React from 'react';
import './StudentApplication.css'; // Re-using some styles for buttons

const SkillRoadmapPage = () => {

  const handleRedirect = (url) => {
    window.location.href = url;
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 className="page-title">Skill Roadmap Tools</h2>
      <p className="page-subtitle">Choose an option to proceed.</p>
      <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
        {/* <button 
          className="button" 
          onClick={() => handleRedirect('https://skilldeveloupment.netlify.app/student')}
        >
          Generate New Roadmap
        </button> */}
        <button 
          className="button" 
          onClick={() => handleRedirect('https://skilldeveloupment.netlify.app/student')}
        >
          View Saved Roadmaps
        </button>
      </div>
    </div>
  );
};

export default SkillRoadmapPage;
