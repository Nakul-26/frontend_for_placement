import React, { useState, useEffect } from 'react';
import { api, NotificationsApi } from '../services/api'; 
import './ManageJobOfferings.css';
import { toast } from 'react-toastify';

export default function ManageJobOfferings() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [newJobOffering, setNewJobOffering] = useState(null);
  const [editingJobOffering, setEditingJobOffering] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobOfferings();
  }, []);

    const fetchJobOfferings = async () => {
      try {
        setLoading(true);
        const res = await NotificationsApi.get(`/jobs`);
        console.log('job offerings res: ', res);
        setJobOfferings(res.data.jobs || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch job offerings');
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
      <div className="job-offerings-container">
        <h1 className="page-title">Manage Job Offerings</h1>
        <p>Loading job offerings...</p>
      </div>
    );
  }

  return (
    <div className="job-offerings-container">
      <h1 className="page-title">Manage Job Offerings</h1>
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
                <label htmlFor="">Company ID:</label>
                <input
                  type="number"
                  className="form-input"
                  value={newJobOffering?.company_id || ''}
                  onChange={(e) => setNewJobOffering({ ...newJobOffering, company_id: e.target.value })}
                  placeholder="Company ID"
                />
            <input
              type="text"
              className="form-input"
              value={editingJobOffering?.title || newJobOffering?.title || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, title: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, title: e.target.value })}
              placeholder="Enter job title"
            />
            <input
              type="text"
              className="form-input"
              value={editingJobOffering?.company_name || newJobOffering?.company_name || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, company_name: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, company_name: e.target.value })}
              placeholder="Enter company name"
            />
            <input
              type="text"
              className="form-input"
              value={editingJobOffering?.company_description || newJobOffering?.company_description || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, company_description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, company_description: e.target.value })}
              placeholder="Enter company description"
            />
            <textarea
              className="form-textarea"
              value={editingJobOffering?.description || newJobOffering?.description || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, description: e.target.value })}
              placeholder="Enter job description"
            ></textarea>

            <input
              type="text"
              className="form-input"
              value={editingJobOffering?.location || newJobOffering?.location || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, location: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, location: e.target.value })}
              placeholder="Enter location"
            />

            <input
              type="number"
              className="form-input"
              value={editingJobOffering?.salary_range || newJobOffering?.salary_range || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, salary_range: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, salary_range: e.target.value })}
              placeholder="Enter salary range"
            />

            <label htmlFor="">Start Date:</label>
            <input
              type="date"
              className="form-input"
              value={editingJobOffering?.start_date ? new Date(editingJobOffering.start_date).toISOString().slice(0,10) : (newJobOffering?.start_date ? new Date(newJobOffering.start_date).toISOString().slice(0,10) : '')}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, start_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, start_date: e.target.value })}
            />

            <label htmlFor="">End Date:</label>
            <input
              type="date"
              className="form-input"
              value={editingJobOffering?.end_date ? new Date(editingJobOffering.end_date).toISOString().slice(0,10) : (newJobOffering?.end_date ? new Date(newJobOffering.end_date).toISOString().slice(0,10) : '')}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, end_date: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, end_date: e.target.value })}
            />

            <input
              type="text"
              className="form-input"
              value={editingJobOffering?.req_skills || newJobOffering?.req_skills || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, req_skills: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, req_skills: e.target.value })}
              placeholder="Required skills (comma separated)"
            />

            <input
              type="text"
              className="form-input"
              value={editingJobOffering?.company_logo || newJobOffering?.company_logo || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, company_logo: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, company_logo: e.target.value })}
              placeholder="Company logo URL"
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                checked={(editingJobOffering?.is_active ?? newJobOffering?.is_active) ?? true}
                onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, is_active: e.target.checked }) : setEditingJobOffering({ ...editingJobOffering, is_active: e.target.checked })}
              />
              Active
            </label>

            <div className="modal-actions">
                <button className="button" onClick={newJobOffering ? handleAddJobOffering : handleEditJobOffering}>Save</button>

                <button className="button secondary" onClick={() => {setEditingJobOffering(null); setNewJobOffering(null)}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}