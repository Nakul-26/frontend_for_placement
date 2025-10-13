import React, { useState, useEffect } from 'react';
import { getJobOfferings, addJobOffering, editJobOffering, deleteJobOffering, api } from '../services/api'; 
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
        const config = {
            withCredentials: true,
        }
        const res = await api.get(`${import.meta.env.VITE_NOTIFICATIONS_URL}/alljobdata`, config);
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
      await addJobOffering(newJobOffering);
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
      await editJobOffering(editingJobOffering.id, editingJobOffering); 
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
      await deleteJobOffering(id);
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
        <button className="button" onClick={() => setNewJobOffering({ title: '', company_name: '', description: '', location: '', salary_range: '', company_logo: '', req_skills: [], start_date: '', end_date: '' })}>Add Job Offering</button>
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
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> {job.salary_range}</p>
                <p><strong>Description:</strong> {job.description}</p>
                <div>
                    <strong>Skills:</strong>
                    <ul className="skills-list">
                      {Array.isArray(job.req_skills) && job.req_skills.map((skill, index) => <li key={index}>{skill}</li>)}
                    </ul>
                </div>
                <p><strong>Applications Opens from:</strong> {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Applications Closes on:</strong> {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'N/A'}</p>
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
            <textarea
              className="form-textarea"
              value={editingJobOffering?.description || newJobOffering?.description || ''}
              onChange={(e) => newJobOffering ? setNewJobOffering({ ...newJobOffering, description: e.target.value }) : setEditingJobOffering({ ...editingJobOffering, description: e.target.value })}
              placeholder="Enter job description"
            ></textarea>
            
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