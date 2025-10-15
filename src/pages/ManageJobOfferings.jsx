import React, { useState, useEffect } from 'react';
import { api, NotificationsApi } from '../services/api'; 
import styles from './ManageJobOfferings.module.css';
import { toast } from 'react-toastify';

export default function ManageJobOfferings() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [newJobOffering, setNewJobOffering] = useState(null);
  const [editingJobOffering, setEditingJobOffering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
    fetchJobOfferings();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await NotificationsApi.get(`/companies`);
      console.log('companies res: ', res);
      setCompanies(res.data.companies || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch companies');
    }
  };

  const fetchJobOfferings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await NotificationsApi.get(`/jobs`);
      console.log('job offerings res: ', res);
      setJobOfferings(res.data.jobs || []);
      toast.success('Job offerings fetched successfully!');
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch job offerings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJobOffering = async () => {
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

      const res = await NotificationsApi.post('/jobs', payload);
      console.log('Job offering added successfully:', res.data);
      setNewJobOffering(null);
      fetchJobOfferings();
      toast.success('Job offering added successfully!');
    } catch (error) {
      console.error('Error adding job offering:', error);
      toast.error(error.response?.data?.message || 'Failed to add job offering.');
    }
  };

  const handleEditJobOffering = async () => {
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

      const res = await NotificationsApi.put(`/jobs/${editingJobOffering.id}`, payload);
      setEditingJobOffering(null);
      fetchJobOfferings();
      toast.success('Job offering updated successfully!');
    } catch (error) {
      console.error('Error editing job offering:', error);
      toast.error(error.response?.data?.message || 'Failed to update job offering.');
    }
  };

  const handleDeleteJobOffering = async (id) => {
    try {
      const res = await NotificationsApi.delete(`/jobs/${id}`);
      console.log('Job offering deleted successfully:', res.data);
      fetchJobOfferings();
      toast.success('Job offering deleted successfully!');
    } catch (error) {
      console.error('Error deleting job offering:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job offering.');
    }
  };

  if (loading) {
    return (
      <div className={styles['job-offerings-container']}>
        <h1 className={styles['page-title']}>Manage Job Offerings</h1>
        <p>Loading job offerings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['job-offerings-container']}>
        <h1 className={styles['page-title']}>Manage Job Offerings</h1>
        <div className={styles['error-message']}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles['job-offerings-container']}>
      <h1 className={styles['page-title']}>Manage Job Offerings</h1>
      <div className={styles['form-container']}>
        <button className={styles.button} onClick={() => setNewJobOffering({
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
      <div className={styles['job-listings']}>
        {jobOfferings.map((job) => (
          <div key={job.id || job.title} className={styles['job-card']}>
            <div className={styles['job-card-header']}>
                {job.company_logo && <img src={job.company_logo} alt={`${job.company_name} logo`} className={styles['company-logo']} />}
                <div>
                    <div className={styles['job-title']}>{job.title}</div>
                    <div className={styles['company-name']}>{job.company_name}</div>
                </div>
            </div>
            <div className={styles['job-card-body']}>
                <p><strong>Location:</strong> {job.location || 'N/A'}</p>
                <p><strong>Salary:</strong> {job.salary_range || 'N/A'}</p>
                <p><strong>Description:</strong> {job.description || 'N/A'}</p>
                {job.company_description && <p><strong>Company:</strong> {job.company_description}</p>}
                <div>
                    <strong>Skills:</strong>
                    <ul className={styles['skills-list']}>
                      {(Array.isArray(job.req_skills) ? job.req_skills : (job.req_skills ? job.req_skills.split(',').map(s => s.trim()) : [])).map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>
                <p><strong>Applications Opens from:</strong> {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Applications Closes on:</strong> {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Active:</strong> {job.is_active ? 'Yes' : 'No'}</p>
            </div>
            <div className={styles['job-card-footer']}>
              {/* Note: The 'margin-right' class was removed in previous steps */}
              <button className={styles.button} onClick={() => setEditingJobOffering(job)}>Edit</button>
              <button className={`${styles.button} ${styles.danger}`} onClick={() => handleDeleteJobOffering(job.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {(editingJobOffering || newJobOffering) && (
        <div className={styles['modal-overlay']}>
          <div className={`${styles.modal} ${styles.card} ${styles.form2}`} style={{ maxWidth: 500, margin: 'auto', padding: 24 }}>
            <h3 className={styles['modal-title']} style={{ marginBottom: 16 }}>{newJobOffering ? 'Add Job Offering' : 'Edit Job Offering'}</h3>
            <form className={styles['job-form']} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!editingJobOffering && (
                <div className={styles['form-group']}>
                  <label htmlFor="company_id" className="form-label">Company:</label>
                  {/* <input
                    id="company_id"
                    type="number"
                    className="form-input"
                    value={newJobOffering?.company_id || ''}
                    onChange={(e) => setNewJobOffering({ ...newJobOffering, company_id: e.target.value })}
                    placeholder="Company ID"
                  /> */}
                  <select name="company_id" id="company_id" value={newJobOffering?.company_id || ''} onChange={(e) => setNewJobOffering({ ...newJobOffering, company_id: e.target.value })}>
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className={styles['form-group']}>
                <label htmlFor="title" className="form-label">Job Title:</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.title || newJobOffering?.title || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, title: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, title: e.target.value })}
                  placeholder="Enter job title"
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="company_name" className="form-label">Company Name:</label>
                <input
                  id="company_name"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.company_name || newJobOffering?.company_name || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, company_name: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, company_name: e.target.value })}
                  placeholder="Enter company name"
                />
              </div> */}
              <div className="form-group">
                <label htmlFor="company_description" className="form-label">Company Description:</label>
                <input
                  id="company_description"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.company_description || newJobOffering?.company_description || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, company_description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, company_description: e.target.value })}
                  placeholder="Enter company description"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">Job Description:</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={editingJobOffering?.description || newJobOffering?.description || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, description: e.target.value })}
                  placeholder="Enter job description"
                  rows={3}
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="location" className="form-label">Location:</label>
                <input
                  id="location"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.location || newJobOffering?.location || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, location: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
              <div className="form-group">
                <label htmlFor="salary_range" className="form-label">Salary Range:</label>
                <input
                  id="salary_range"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.salary_range || newJobOffering?.salary_range || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, salary_range: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, salary_range: e.target.value })}
                  placeholder="Enter salary range"
                />
              </div>
              <div className="form-group">
                <label htmlFor="start_date" className="form-label">Start Date:</label>
                <input
                  id="start_date"
                  type="date"
                  className="form-input"
                  value={editingJobOffering?.start_date ? new Date(editingJobOffering.start_date).toISOString().slice(0,10) : (newJobOffering?.start_date ? new Date(newJobOffering.start_date).toISOString().slice(0,10) : '')}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, start_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, start_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_date" className="form-label">End Date:</label>
                <input
                  id="end_date"
                  type="date"
                  className="form-input"
                  value={editingJobOffering?.end_date ? new Date(editingJobOffering.end_date).toISOString().slice(0,10) : (newJobOffering?.end_date ? new Date(newJobOffering.end_date).toISOString().slice(0,10) : '')}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, end_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, end_date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="req_skills" className="form-label">Required Skills:</label>
                <input
                  id="req_skills"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.req_skills || newJobOffering?.req_skills || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, req_skills: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, req_skills: e.target.value })}
                  placeholder="Required skills (comma separated)"
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="company_logo" className="form-label">Company Logo URL:</label>
                <input
                  id="company_logo"
                  type="text"
                  className="form-input"
                  value={editingJobOffering?.company_logo || newJobOffering?.company_logo || ''}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, company_logo: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, company_logo: e.target.value })}
                  placeholder="Company logo URL"
                />
              </div> */}
              <div className="form-group checkbox">
                <label htmlFor="is_active" className="form-label checkbox-label" style={{ width: '5px' }}>Active:</label>
                <input
                  className="form-input checkbox-input"
                  id="is_active"
                  type="checkbox"
                  checked={(editingJobOffering?.is_active ?? newJobOffering?.is_active) ?? true}
                  onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, is_active: e.target.checked }) : setEditingJobOffering({ ...editingJobOffering, is_active: e.target.checked })}
                />
              </div>
              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
                <button type="button" className="button" onClick={newJobOffering ? handleAddJobOffering : handleEditJobOffering}>Save</button>
                <button type="button" className="button secondary" onClick={() => {setEditingJobOffering(null); setNewJobOffering(null)}}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}