
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
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    const fetchJobOfferings = async () => {
      try {
        const response = await NotificationsApiSecure.get('/jobs'); // Assuming this endpoint fetches all jobs
        setJobOfferings(response.data.jobs || []);
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
        const response = await NotificationsApiSecure.get('/forms');
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
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      setFilteredApplications(
        applications.filter(app => app.jobid.toString() === selectedJobId)
      );
    } else {
      setFilteredApplications(applications);
    }
  }, [selectedJobId, applications]);

  if (loading) return <div className="student-applications-container">Loading...</div>;

  return (
    <div className="student-applications-container">
      <h2>Student Applications</h2>

      <div className="filter-container">
        <label htmlFor="job-filter">Filter by Job:</label>
        <select 
          id="job-filter"
          className="job-filter-select"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">All Jobs</option>
          {jobOfferings.map(job => (
            <option key={job.id} value={job.id}>
              {job.title}, id:{job.id}
            </option>
          ))}
        </select>
      </div>

      {!loading && filteredApplications.length === 0 ? (
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
            {filteredApplications.map(app => (
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