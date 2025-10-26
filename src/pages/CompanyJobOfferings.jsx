
import React, { useState, useEffect } from 'react';
import { api, NotificationsApi, graphqlRequest, NotificationsApiSecure } from '../services/api'; 
import './CompanyJobOfferings.css';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';

export default function CompanyJobOfferings() {
  const { user, companyDetails, fetchCompanyDetails } = useAuth();
  const [jobOfferings, setJobOfferings] = useState([]);
  const [newJobOffering, setNewJobOffering] = useState(null);
  const [editingJobOffering, setEditingJobOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (user) { // Ensure user is available before fetching
        fetchJobOfferings();
    }
  }, [user]);

  useEffect(() => {
    if (!companyDetails) {
      fetchCompanyDetails();
    }
    console.log('Company details in Job Offerings:', companyDetails);
  }, [companyDetails, fetchCompanyDetails]);

  const safeToISOString = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 10);
    } catch (e) {
      return '';
    }
  }

  const fetchJobOfferings = async () => {
    const query = `
      query GetAllJobs {
        jobs {
          id
          title
          company_name
          location
          req_skills
          description
          salary_range
          start_date
          end_date
          is_active
          
          
          
        }
      }
    `;
    try {
      setLoading(true);
      setError(null);
      const response = await graphqlRequest(query);
      setJobOfferings(response.data.jobs || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch job offerings';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJobOffering = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const reqSkillsArray = Array.isArray(newJobOffering.req_skills)
        ? newJobOffering.req_skills
        : (newJobOffering.req_skills || '').split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        ...newJobOffering,
        req_skills: reqSkillsArray,
        company_id: companyDetails.id,
      };

      console.log('Adding job offering with payload:', payload);

      await NotificationsApiSecure.post(`/jobs`, payload , { withCredentials: true });
      setNewJobOffering(null);
      fetchJobOfferings();
      toast.success('Job offering added successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add job offering.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJobOffering = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const reqSkillsArray = Array.isArray(editingJobOffering.req_skills)
        ? editingJobOffering.req_skills
        : (editingJobOffering.req_skills || '').split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        ...editingJobOffering,
        req_skills: reqSkillsArray,
        company_id: companyDetails.id,
      };

      await NotificationsApiSecure.put(`/jobs/${editingJobOffering.id}`, payload);
      setEditingJobOffering(null);
      fetchJobOfferings();
      toast.success('Job offering updated successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update job offering.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJobOffering = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job offering?')) return;
    
    setError(null);
    try {
      await NotificationsApiSecure.delete(`/jobs/${id}`);
      fetchJobOfferings();
      toast.success('Job offering deleted successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete job offering.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJob(job);
    try {
        setLoading(true);
        const res = await NotificationsApiSecure.get((`/forms/job/${job.id}`), { withCredentials: true });
        setApplicants(res.data.data || []);
    } catch (err) {
        toast.error('Could not fetch applicants.');
        setApplicants([]);
    } finally {
        setLoading(false);
    }
  };

  const handleApplicationStatusChange = async (formId, status) => {
    try {
        await NotificationsApiSecure.post(`/forms/${formId}/status`, { status });
        toast.success(`Application ${status} successfully!`);
        // Refresh the applicants list to show the updated status
        setApplicants(applicants.map(app => app.id === formId ? { ...app, status } : app));
    } catch (err) {
        toast.error('Failed to update application status.');
    }
  };

  return (
    <div className="job-offerings-container">
      <h1 className="page-title">Your Company's Job Offerings</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-container">
        <button className="button" onClick={() => setNewJobOffering({
          title: '',
          description: '',
          req_skills: [],
          salary_range: '',
          start_date: '',
          end_date: '',
          location: '',
          is_active: true,
          CGPA: '',
          tenth_percentage: '',
          twelfth_percentage: ''
        })}>Add Job Offering</button>
      </div>

      {!loading && !error && jobOfferings.length === 0 && (
        <p className="no-job-offerings">You have not posted any job offerings yet.</p>
      )}

      <div className="job-listings">
        {jobOfferings.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
                <div className="job-title">{job.title}</div>
            </div>
            <div className="job-card-body">
                <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                <p><strong>CGPA:</strong> {job.CGPA || 'N/A'}</p>
                <p><strong>10th %:</strong> {job.tenth_percentage || 'N/A'}</p>
                <p><strong>12th %:</strong> {job.twelfth_percentage || 'N/A'}</p>
                <div>
                    <strong>Skills:</strong>
                    <ul className="skills-list">
                      {(Array.isArray(job.req_skills) ? job.req_skills : (job.req_skills ? job.req_skills.split(',').map(s => s.trim()) : [])).map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>
            </div>
            <div className="job-card-footer">
              <button className="button" onClick={() => setEditingJobOffering(job)}>Edit</button>
              <button className="button secondary" onClick={() => handleViewApplicants(job)}>View Applicants</button>
              <button className="button danger" onClick={() => handleDeleteJobOffering(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Applicants Modal */}
      {selectedJob && (
        <div className="modal-overlay">
            <div className="modal card" style={{maxWidth: '800px'}}>
                <h3 className="modal-title">Applicants for {selectedJob.title}</h3>
                {loading ? <p>Loading applicants...</p> : (
                    applicants.length > 0 ? (
                        <table className="student-applications-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Applied At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.user_name}</td>
                                        <td>{app.user_email}</td>
                                        <td>{new Date(app.created_at).toLocaleString()}</td>
                                        <td>{app.status || 'Pending'}</td>
                                        <td className="applicant-actions">
                                            <button className="button" onClick={() => handleApplicationStatusChange(app.id, 'accepted')}>Accept</button>
                                            <button className="button danger" onClick={() => handleApplicationStatusChange(app.id, 'rejected')}>Reject</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No applicants for this job yet.</p>
                )}
                <div className="modal-actions">
                    <button className="button secondary" onClick={() => setSelectedJob(null)}>Close</button>
                </div>
            </div>
        </div>
      )}

      {(editingJobOffering || newJobOffering) && (
        <div className="modal-overlay">
            <div className="modal card">
            <h3 className="modal-title">{newJobOffering ? 'Add Job Offering' : 'Edit Job Offering'}</h3>
            
            <div className="form-field">
              <label htmlFor="title">Job Title:</label>
              <input id="title" type="text" className="form-input" value={editingJobOffering?.title || newJobOffering?.title || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, title: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, title: e.target.value })} placeholder="Enter job title" />
            </div>
            <div className="form-field">
              <label htmlFor="description">Description:</label>
              <textarea id="description" className="form-textarea" value={editingJobOffering?.description || newJobOffering?.description || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, description: e.target.value })} placeholder="Enter job description"></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="location">Location:</label>
              <input id="location" type="text" className="form-input" value={editingJobOffering?.location || newJobOffering?.location || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, location: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, location: e.target.value })} placeholder="Enter location" />
            </div>
            <div className="form-field">
              <label htmlFor="salary_range">Salary Range:</label>
              <input id="salary_range" type="text" className="form-input" value={editingJobOffering?.salary_range || newJobOffering?.salary_range || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, salary_range: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, salary_range: e.target.value })} placeholder="Enter salary range" />
            </div>
            <div className="form-field">
              <label htmlFor="start_date">Start Date:</label>
              <input id="start_date" type="date" className="form-input" value={editingJobOffering?.start_date ? safeToISOString(editingJobOffering.start_date) : (newJobOffering?.start_date ? safeToISOString(newJobOffering.start_date) : '')} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, start_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, start_date: e.target.value })} />
            </div>
            <div className="form-field">
              <label htmlFor="end_date">End Date:</label>
              <input id="end_date" type="date" className="form-input" value={editingJobOffering?.end_date ? safeToISOString(editingJobOffering.end_date) : (newJobOffering?.end_date ? safeToISOString(newJobOffering.end_date) : '')} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, end_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, end_date: e.target.value })} />
            </div>
            <div className="form-field">
              <label htmlFor="CGPA">Minimum CGPA:</label>
              <input id="CGPA" type="number" className="form-input" value={editingJobOffering?.CGPA || newJobOffering?.CGPA || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, CGPA: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, CGPA: e.target.value })} placeholder="Enter minimum CGPA" />
            </div>
            <div className="form-field">
              <label htmlFor="tenth_percentage">Minimum 10th Percentage:</label>
              <input id="tenth_percentage" type="number" className="form-input" value={editingJobOffering?.tenth_percentage || newJobOffering?.tenth_percentage || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, tenth_percentage: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, tenth_percentage: e.target.value })} placeholder="Enter minimum 10th percentage" />
            </div>
            <div className="form-field">
              <label htmlFor="twelfth_percentage">Minimum 12th Percentage:</label>
              <input id="twelfth_percentage" type="number" className="form-input" value={editingJobOffering?.twelfth_percentage || newJobOffering?.twelfth_percentage || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, twelfth_percentage: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, twelfth_percentage: e.target.value })} placeholder="Enter minimum 12th percentage" />
            </div>
            <div className="form-field">
              <label htmlFor="req_skills">Required Skills (comma separated):</label>
              <input id="req_skills" type="text" className="form-input" value={editingJobOffering?.req_skills || newJobOffering?.req_skills || ''} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, req_skills: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, req_skills: e.target.value })} placeholder="Required skills (comma separated)" />
            </div>
            <div className="form-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={(editingJobOffering?.is_active ?? newJobOffering?.is_active) ?? true} onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, is_active: e.target.checked }) : setEditingJobOffering({ ...editingJobOffering, is_active: e.target.checked })} />
                Active
              </label>
            </div>

            <div className="modal-actions">
                <button className="button" onClick={newJobOffering ? handleAddJobOffering : handleEditJobOffering} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button className="button secondary" onClick={() => {setEditingJobOffering(null); setNewJobOffering(null)}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
