import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();

  return (
    <>
      <Header />
      <div className="job-detail-container">
        <div className="job-detail-card">
          <h2 className="job-detail-title">Job Detail</h2>
          <p>Details for job with ID: {id}</p>
          {/* More job details can be added here */}
        </div>
      </div>
    </>
  );
};

export default JobDetail;
