import React from 'react';
import './Notifications.css';

export default function Notifications() {
  return (
    <div className="notifications-container">
      {/* <h2 className="notifications-title">Notifications</h2> */}
      <div className="notifications-list">
        <div className="notification-card important">
          <div className="notification-header">
            <span className="notification-badge">Important</span>
            <span className="notification-time">2h ago</span>
          </div>

          <div className="notification-body">
            <h5 className="notification-title">Campus Recruitment Drive</h5>
            <h6 className="notification-subtitle">From: Placement Cell</h6>
            <p className="notification-text">
              Infosys is conducting an on-campus recruitment drive for final-year students.
              Please register before <strong>Oct 1, 2025</strong>.
            </p>
          </div>

          <div className="notification-footer">
            <a href="#" className="notification-link">View Details</a>
            <a href="mailto:placement@college.edu" className="notification-link">Contact Placement Officer</a>
          </div>
        </div>

        <div className="notification-card important">
          <div className="notification-header">
            <span className="notification-badge">Important</span>
            <span className="notification-time">2h ago</span>
          </div>

          <div className="notification-body">
            <h5 className="notification-title">Campus Recruitment Drive</h5>
            <h6 className="notification-subtitle">From: Placement Cell</h6>
            <p className="notification-text">
              Infosys is conducting an on-campus recruitment drive for final-year students.
              Please register before <strong>Oct 1, 2025</strong>.
            </p>
          </div>

          <div className="notification-footer">
            <a href="#" className="notification-link">View Details</a>
            <a href="mailto:placement@college.edu" className="notification-link">Contact Placement Officer</a>
          </div>
        </div>

        <div className="notification-card important">
          <div className="notification-header">
            <span className="notification-badge">Important</span>
            <span className="notification-time">2h ago</span>
          </div>

          <div className="notification-body">
            <h5 className="notification-title">Campus Recruitment Drive</h5>
            <h6 className="notification-subtitle">From: Placement Cell</h6>
            <p className="notification-text">
              Infosys is conducting an on-campus recruitment drive for final-year students.
              Please register before <strong>Oct 1, 2025</strong>.
            </p>
          </div>

          <div className="notification-footer">
            <a href="#" className="notification-link">View Details</a>
            <a href="mailto:placement@college.edu" className="notification-link">Contact Placement Officer</a>
          </div>
        </div>

        <div className="notification-card important">
          <div className="notification-header">
            <span className="notification-badge">Important</span>
            <span className="notification-time">2h ago</span>
          </div>

          <div className="notification-body">
            <h5 className="notification-title">Campus Recruitment Drive</h5>
            <h6 className="notification-subtitle">From: Placement Cell</h6>
            <p className="notification-text">
              Infosys is conducting an on-campus recruitment drive for final-year students.
              Please register before <strong>Oct 1, 2025</strong>.
            </p>
          </div>

          <div className="notification-footer">
            <a href="#" className="notification-link">View Details</a>
            <a href="mailto:placement@college.edu" className="notification-link">Contact Placement Officer</a>
          </div>
        </div>

        <div className="notification-card important">
          <div className="notification-header">
            <span className="notification-badge">Important</span>
            <span className="notification-time">2h ago</span>
          </div>

          <div className="notification-body">
            <h5 className="notification-title">Campus Recruitment Drive</h5>
            <h6 className="notification-subtitle">From: Placement Cell</h6>
            <p className="notification-text">
              Infosys is conducting an on-campus recruitment drive for final-year students.
              Please register before <strong>Oct 1, 2025</strong>.
            </p>
          </div>

          <div className="notification-footer">
            <a href="#" className="notification-link">View Details</a>
            <a href="mailto:placement@college.edu" className="notification-link">Contact Placement Officer</a>
          </div>
        </div>

        <div className="notification-card important">
          <div className="notification-header">
            <span className="notification-badge">Important</span>
            <span className="notification-time">2h ago</span>
          </div>

          <div className="notification-body">
            <h5 className="notification-title">Campus Recruitment Drive</h5>
            <h6 className="notification-subtitle">From: Placement Cell</h6>
            <p className="notification-text">
              Infosys is conducting an on-campus recruitment drive for final-year students.
              Please register before <strong>Oct 1, 2025</strong>.
            </p>
          </div>

          <div className="notification-footer">
            <a href="#" className="notification-link">View Details</a>
            <a href="mailto:placement@college.edu" className="notification-link">Contact Placement Officer</a>
          </div>
        </div>

        {/* <div className='notifications-card'>
          <h1>this is another notification</h1>
          <p>this is the content of the new notification</p>
        </div>
        <div className='notifications-card'>
          <h1>this is a third notification</h1>
          <p>this is the content of the third notification</p>
        </div> */}
      </div>
    </div>
  );
}