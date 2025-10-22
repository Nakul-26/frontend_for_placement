import React, { useState, useEffect } from 'react';
import { api, NotificationsApi, NotificationsApiSecure } from '../services/api'; 
import './ManageJobOfferings.css';
import { toast } from 'react-toastify';

export default function ManageJobOfferings() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [newJobOffering, setNewJobOffering] = useState(null);
  const [editingJobOffering, setEditingJobOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await NotificationsApiSecure.get('/companies');
      console.log('companies res: ', res);
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchJobOfferings();
  }, []);

    const fetchJobOfferings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await NotificationsApiSecure.get(`/jobs`);
        console.log('job offerings res: ', res);
        setJobOfferings(res.data.jobs || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch job offerings');
        toast.error(err.message || 'Failed to fetch job offerings');
      } finally {
        setLoading(false);
      }
    };

  const handleAddJobOffering = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      // Ensure req_skills is an array before sending
      const reqSkillsArray = Array.isArray(newJobOffering.req_skills)
        ? newJobOffering.req_skills
        : (newJobOffering.req_skills || '').split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        company_id: newJobOffering.company_id || 6, // Default or get from current context
        title: newJobOffering.title,
        description: newJobOffering.description,
        req_skills: reqSkillsArray,
        salary_range: newJobOffering.salary_range,
        start_date: newJobOffering.start_date,
        end_date: newJobOffering.end_date,
        location: newJobOffering.location,
        is_active: newJobOffering.is_active ?? true
      };

      const res = await NotificationsApiSecure.post('/jobs', payload);
      console.log('Job offering added successfully:', res.data);
      setNewJobOffering(null);
      fetchJobOfferings();
      setSuccess('Job offering added successfully!');
      toast.success('Job offering added successfully!');
    } catch (error) {
      console.error('Error adding job offering:', error);
      setError(error.response?.data?.message || 'Failed to add job offering.');
      toast.error(error.response?.data?.message || 'Failed to add job offering.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJobOffering = async () => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const reqSkillsArray = Array.isArray(editingJobOffering.req_skills)
        ? editingJobOffering.req_skills
        : (editingJobOffering.req_skills || '').split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        company_id: editingJobOffering.company_id || 6,
        title: editingJobOffering.title,
        description: editingJobOffering.description,
        req_skills: reqSkillsArray,
        salary_range: editingJobOffering.salary_range,
        start_date: editingJobOffering.start_date,
        end_date: editingJobOffering.end_date,
        location: editingJobOffering.location,
        is_active: editingJobOffering.is_active ?? true
      };

      const res = await NotificationsApiSecure.put(`/jobs/${editingJobOffering.id}`, payload);
      setEditingJobOffering(null);
      fetchJobOfferings();
      setSuccess('Job offering updated successfully!');
      toast.success('Job offering updated successfully!');
    } catch (error) {
      console.error('Error editing job offering:', error);
      setError(error.response?.data?.message || 'Failed to update job offering.');
      toast.error(error.response?.data?.message || 'Failed to update job offering.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJobOffering = async (id) => {
    setError(null);
    setSuccess(null);
    try {
      const res = await NotificationsApiSecure.delete(`/jobs/${id}`);
      console.log('Job offering deleted successfully:', res.data);
      fetchJobOfferings();
      setSuccess('Job offering deleted successfully!');
      toast.success('Job offering deleted successfully!');
    } catch (error) {
      console.error('Error deleting job offering:', error);
      setError(error.response?.data?.message || 'Failed to delete job offering.');
      toast.error(error.response?.data?.message || 'Failed to delete job offering.');
    }
  };

  return (
    <div className="job-offerings-container">
      <h1 className="page-title">Manage Job Offerings</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      <div className="form-container">
        <button className="button" onClick={() => setNewJobOffering({
          company_id: 6,
          title: '',
          description: '',
          req_skills: [],
          salary_range: '',
          start_date: '',
          end_date: '',
          location: '',
          is_active: true
        })}>Add Job Offering</button>
      </div>
      {!loading && !error && jobOfferings.length === 0 && (
        <p className="no-job-offerings">No job offerings available.</p>
      )}
      <div className="job-listings">
        {jobOfferings.map((job) => (
          <div key={job.id || job.title} className="job-card">
            <div className="job-card-header">
                {job.company_logo && <img src={job.company_logo} alt={`${job.company_name} logo`} className="company-logo" />}
                <div>
                    <div className="job-title">{job.title}</div>
                    <div className="company-name">{job.company_name}</div>
                </div>
            </div>
            <div className="job-card-body">
                <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                <p><strong>Salary:</strong> {job.salary_range || 'N/A'}</p>
                <p><strong>Description:</strong> {job.description || 'N/A'}</p>
                {job.company_description && <p><strong>Company:</strong> {job.company_description}</p>}
                <div>
                    <strong>Skills:</strong>
                    <ul className="skills-list">
                      {(Array.isArray(job.req_skills) ? job.req_skills : (job.req_skills ? job.req_skills.split(',').map(s => s.trim()) : [])).map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>
                <p><strong>Applications Opens from:</strong> {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Applications Closes on:</strong> {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Active:</strong> {job.is_active ? 'Yes' : 'No'}</p>
            </div>
            <div className="job-card-footer">
              {/* Note: The 'margin-right' class was removed in previous steps */}
              <button className="button" onClick={() => setEditingJobOffering(job)}>Edit</button>
              <button className="button danger" onClick={() => handleDeleteJobOffering(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {(editingJobOffering || newJobOffering) && (
        <div className="modal-overlay">
            <div className="modal card">
            <h3 className="modal-title">{newJobOffering ? 'Add Job Offering' : 'Edit Job Offering'}</h3>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
                
                {newJobOffering && (
                  <div className="form-field">
                  <label htmlFor="company_id">Company:</label>
                  <select
                    id="company_id"
                    name="company_id"
                    className="form-input"
                    // Ensure the value is correctly bound, converting to string for the select input
                    value={currentJob?.company_id?.toString() || ''} 
                    onChange={(e) => {
                        // Update state, ensuring the value is stored as a number
                        const companyId = Number(e.target.value);
                        if (newJobOffering) {
                            setNewJobOffering({ ...newJobOffering, company_id: companyId });
                        } else if (editingJobOffering) {
                            setEditingJobOffering({ ...editingJobOffering, company_id: companyId });
                        }
                    }}
                >
                    {/* Default/Placeholder option */}
                    <option value="" disabled>Select a Company</option>
                    {companies.map(company => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>
                </div>
                )}
            <div className="form-field">
              <label htmlFor="title">Job Title:</label>
              <input
                id="title"
                type="text"
                className="form-input"
                value={editingJobOffering?.title || newJobOffering?.title || ''}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, title: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, title: e.target.value })}
                placeholder="Enter job title"
              />
            </div>
            <div className="form-field">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                className="form-textarea"
                value={editingJobOffering?.description || newJobOffering?.description || ''}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, description: e.target.value })}
                placeholder="Enter job description"
              ></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="location">Location:</label>
              <input
                id="location"
                type="text"
                className="form-input"
                value={editingJobOffering?.location || newJobOffering?.location || ''}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, location: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            <div className="form-field">
              <label htmlFor="salary_range">Salary Range:</label>
              <input
                id="salary_range"
                type="text"
                className="form-input"
                value={editingJobOffering?.salary_range || newJobOffering?.salary_range || ''}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, salary_range: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, salary_range: e.target.value })}
                placeholder="Enter salary range"
              />
            </div>
            <div className="form-field">
              <label htmlFor="start_date">Start Date:</label>
              <input
                id="start_date"
                type="date"
                className="form-input"
                value={editingJobOffering?.start_date ? new Date(editingJobOffering.start_date).toISOString().slice(0,10) : (newJobOffering?.start_date ? new Date(newJobOffering.start_date).toISOString().slice(0,10) : '')}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, start_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, start_date: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label htmlFor="end_date">End Date:</label>
              <input
                id="end_date"
                type="date"
                className="form-input"
                value={editingJobOffering?.end_date ? new Date(editingJobOffering.end_date).toISOString().slice(0,10) : (newJobOffering?.end_date ? new Date(newJobOffering.end_date).toISOString().slice(0,10) : '')}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, end_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, end_date: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label htmlFor="req_skills">Required Skills (comma separated):</label>
              <input
                id="req_skills"
                type="text"
                className="form-input"
                value={editingJobOffering?.req_skills || newJobOffering?.req_skills || ''}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, req_skills: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, req_skills: e.target.value })}
                placeholder="Required skills (comma separated)"
              />
            </div>
            <div className="form-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={(editingJobOffering?.is_active ?? newJobOffering?.is_active) ?? true}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, is_active: e.target.checked }) : setEditingJobOffering({ ...editingJobOffering, is_active: e.target.checked })}
                />
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