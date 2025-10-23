
import React, { useEffect, useState } from "react";
import "./StudentApplication.css";
import { toast } from "react-toastify";
import axios from "axios";
import { api, NotificationsApi, NotificationsApiSecure } from "../services/api";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [jobOfferings, setJobOfferings] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobOfferings = async () => {
      try {
        const response = await api.get('/jobs'); // Assuming this endpoint fetches all jobs
        setJobOfferings(response.data.data || []);
      } catch (error) {
        console.error('Error fetching job offerings:', error);
        toast.error('Failed to load job offerings.');
      }
    };
    fetchJobOfferings();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedJobId) {
          response = await NotificationsApiSecure.get(`/forms/job/${selectedJobId}`);
        } else {
          response = await NotificationsApiSecure.get('/forms');
        }
        console.log('Fetched applications response:', response);
        const data = response.data.data || [];
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  if (loading) return <div className="student-applications-container">Loading...</div>;

  return (
    <div className="student-applications-container">
      <h2>Student Applications</h2>

      <div className="filter-container">
        <label htmlFor="job-filter">Filter by Job:</label>
        <select 
          id="job-filter"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">All Jobs</option>
          {jobOfferings.map(job => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {!loading && applications.length === 0 ? (
        <p className="no-applications-message">No applications found for the selected filter.</p>
      ) : (
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
      )}
    </div>
  );
}

export default StudentApplications;