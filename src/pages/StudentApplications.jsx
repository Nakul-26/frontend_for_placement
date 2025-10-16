
import React, { useEffect, useState } from "react";
import styles from './StudentApplication.module.css';
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = "https://notification-31at.onrender.com/forms";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        console.log('Fetched applications response:', response);
        const data = response.data.data;
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className={`${styles['student-applications-container']} ${styles.loading}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`${styles['student-applications-container']} ${styles['error-message']}`}>Error: {error}</div>;
  }

  return (
    <div className={styles['student-applications-container']}>
      <h2>Student Applications</h2>
      <table className={styles['student-applications-table']}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Applied At</th>
            <th>User ID</th>
            <th>Job ID</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.user_name}</td>
              <td>{app.user_email}</td>
              <td>{new Date(app.created_at).toLocaleString()}</td>
              <td>{app.user_id}</td>
              <td>{app.jobid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentApplications;