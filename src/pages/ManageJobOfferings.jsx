import React, { useEffect, useState } from "react";
import "./StudentApplication.css";
import { toast } from "react-toastify";
import { NotificationsApiSecure, graphqlRequest } from "../services/api";

function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [jobOfferings, setJobOfferings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredApplications, setFilteredApplications] = useState([]);

  // ✅ Fetch companies using GraphQL
  const fetchCompanies = async () => {
    const query = `
      query GetAllCompanies {
        companies {
          id
          name
          logo
          description
        }
      }
    `;
    try {
      const response = await graphqlRequest(query);
      setCompanies(response.data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load company details.');
    }
  };

  // ✅ Fetch jobs
  const fetchJobOfferings = async () => {
    try {
      const response = await NotificationsApiSecure.get('/jobs');
      setJobOfferings(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching job offerings:', error);
      toast.error('Failed to load job offerings.');
    }
  };

  // ✅ Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await NotificationsApiSecure.get('/forms');
      const data = response.data.data || [];
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load student applications.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all data on mount
  useEffect(() => {
    (async () => {
      await Promise.all([fetchCompanies(), fetchJobOfferings(), fetchApplications()]);
    })();
  }, []);

  // ✅ Filter by Job ID
  useEffect(() => {
    if (selectedJobId) {
      setFilteredApplications(applications.filter(app => app.jobid.toString() === selectedJobId));
    } else {
      setFilteredApplications(applications);
    }
  }, [selectedJobId, applications]);

  // ✅ Helper: Find job + company for a given jobid
  const getCompanyForApplication = (jobid) => {
    const job = jobOfferings.find(j => j.id.toString() === jobid.toString());
    if (!job) return null;
    const company = companies.find(c => c.id.toString() === job.company_id?.toString());
    return company ? { name: company.name, logo: company.logo } : null;
  };

  if (loading) return <div className="student-applications-container">Loading...</div>;

  return (
    <div className="student-applications-container">
      <h2>Student Applications</h2>

      {/* ✅ Job filter */}
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
              {job.title} (ID: {job.id})
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Table */}
      {!loading && filteredApplications.length === 0 ? (
        <p className="no-applications-message">No applications found for the selected filter.</p>
      ) : (
        <table className="student-applications-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>10th %</th>
              <th>12th %</th>
              <th>Company</th>
              <th>Applied At</th>
              {/* <th>Resume</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => {
              const company = getCompanyForApplication(app.jobid);
              return (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.user_name}</td>
                  <td>{app.user_email}</td>
                  <td>{app.cgpa ?? "N/A"}</td>
                  <td>{app.tenth_percentage ?? "N/A"}</td>
                  <td>{app.twelfth_percentage ?? "N/A"}</td>
                  <td>
                    {company ? (
                      <div className="company-cell">
                        {company.logo && (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="company-logo-small"
                          />
                        )}
                        <span>{company.name}</span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{new Date(app.created_at).toLocaleString()}</td>
                  {/* <td>
                    {app.resume_link ? (
                      <a href={app.resume_link} target="_blank" rel="noopener noreferrer">
                        View Resume
                      </a>
                    ) : (
                      "Not uploaded"
                    )}
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentApplications;
