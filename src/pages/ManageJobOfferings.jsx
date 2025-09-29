import React, { useState, useEffect } from 'react';
import { getJobOfferings, addJobOffering, editJobOffering, deleteJobOffering } from '../services/api';
import './ManageJobOfferings.css';

export default function ManageJobOfferings() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [newJobOffering, setNewJobOffering] = useState({ title: '', company: '', description: '' });
  const [editingJobOffering, setEditingJobOffering] = useState(null);

  useEffect(() => {
    fetchJobOfferings();
  }, []);

  const fetchJobOfferings = async () => {
    try {
      const response = await getJobOfferings();
      setJobOfferings(response.data);
    } catch (error) {
      console.error('Error fetching job offerings:', error);
    }
  };

  const handleAddJobOffering = async () => {
    try {
      await addJobOffering(newJobOffering);
      setNewJobOffering({ title: '', company: '', description: '' });
      fetchJobOfferings();
    } catch (error) {
      console.error('Error adding job offering:', error);
    }
  };

  const handleEditJobOffering = async () => {
    try {
      await editJobOffering(editingJobOffering.id, editingJobOffering);
      setEditingJobOffering(null);
      fetchJobOfferings();
    } catch (error) {
      console.error('Error editing job offering:', error);
    }
  };

  const handleDeleteJobOffering = async (id) => {
    try {
      await deleteJobOffering(id);
      fetchJobOfferings();
    } catch (error) {
      console.error('Error deleting job offering:', error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Manage Job Offerings</h1>
      <div className="form-container card">
        <input
          type="text"
          className="form-input"
          value={newJobOffering.title}
          onChange={(e) => setNewJobOffering({ ...newJobOffering, title: e.target.value })}
          placeholder="Enter job title"
        />
        <input
          type="text"
          className="form-input"
          value={newJobOffering.company}
          onChange={(e) => setNewJobOffering({ ...newJobOffering, company: e.target.value })}
          placeholder="Enter company name"
        />
        <textarea
          className="form-textarea"
          value={newJobOffering.description}
          onChange={(e) => setNewJobOffering({ ...newJobOffering, description: e.target.value })}
          placeholder="Enter job description"
        ></textarea>
        <button className="button" onClick={handleAddJobOffering}>Add Job Offering</button>
      </div>
      <div className="table-container card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobOfferings.map((jobOffering) => (
              <tr key={jobOffering.id}>
                <td>{jobOffering.title}</td>
                <td>{jobOffering.company}</td>
                <td>{jobOffering.description}</td>
                <td className="action-buttons">
                  <button className="button" onClick={() => setEditingJobOffering(jobOffering)}>Edit</button>
                  <button className="button danger" onClick={() => handleDeleteJobOffering(jobOffering.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingJobOffering && (
        <div className="modal-overlay">
          <div className="modal card">
            <h3 className="modal-title">Edit Job Offering</h3>
            <input
              type="text"
              className="form-input"
              value={editingJobOffering.title}
              onChange={(e) => setEditingJobOffering({ ...editingJobOffering, title: e.target.value })}
            />
            <input
              type="text"
              className="form-input"
              value={editingJobOffering.company}
              onChange={(e) => setEditingJobOffering({ ...editingJobOffering, company: e.target.value })}
            />
            <textarea
              className="form-textarea"
              value={editingJobOffering.description}
              onChange={(e) => setEditingJobOffering({ ...editingJobOffering, description: e.target.value })}
            ></textarea>
            <div className="modal-actions">
                <button className="button" onClick={handleEditJobOffering}>Save</button>
                <button className="button secondary" onClick={() => setEditingJobOffering(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
