import React from 'react';
import { useParams } from 'react-router-dom';
import './Landing.css';

const JobDetail = () => {
  const { id } = useParams();

  return (
    <div className="landing-tab-panel">
      <h2 className="landing-section-title">Job Detail</h2>
      <p>Details for job with ID: {id}</p>
    </div>
  );
};

export default JobDetail;
