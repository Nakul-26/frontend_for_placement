
import React, { useEffect, useState } from "react";
import "./StudentApplication.css";

const API_URL = "https://notification-31at.onrender.com/forms";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setApplications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="student-applications-container">Loading...</div>;

  return (
    <div className="student-applications-container">
      <h2>Student Applications</h2>
      <table className="student-applications-table">
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