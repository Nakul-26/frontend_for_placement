import React, { useState } from 'react';
import './ManagePlacementDrive.css';

const ManagePlacementDrive = () => {
  const [drives, setDrives] = useState([
    { id: 1, name: 'Fall 2025 Placement Drive', startDate: '2025-10-15', endDate: '2025-11-15', status: 'Ongoing' },
    { id: 2, name: 'Spring 2026 Placement Drive', startDate: '2026-03-01', endDate: '2026-04-01', status: 'Upcoming' },
  ]);

  const [newDrive, setNewDrive] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrive({ ...newDrive, [name]: value });
  };

  const handleCreateDrive = (e) => {
    e.preventDefault();
    const driveToAdd = { ...newDrive, id: drives.length + 1, status: 'Upcoming' };
    setDrives([...drives, driveToAdd]);
    setNewDrive({ name: '', startDate: '', endDate: '' });
  };

  return (
    <div className="manage-placement-drive-container">
      <header className="page-header">
        <h1>Manage Placement Drives</h1>
        <p>Create and manage placement event schedules and rules.</p>
      </header>

      <div className="create-drive-form">
        <h2>Create New Placement Drive</h2>
        <form onSubmit={handleCreateDrive}>
          <div className="form-group">
            <label htmlFor="name">Drive Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newDrive.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={newDrive.startDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newDrive.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">Create Drive</button>
        </form>
      </div>

      <div className="drive-list">
        <h2>Existing Placement Drives</h2>
        <table>
          <thead>
            <tr>
              <th>Drive Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drives.map((drive) => (
              <tr key={drive.id}>
                <td>{drive.name}</td>
                <td>{drive.startDate}</td>
                <td>{drive.endDate}</td>
                <td><span className={`status ${drive.status.toLowerCase()}`}>{drive.status}</span></td>
                <td>
                  <button className="btn-secondary">Edit</button>
                  <button className="btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlacementDrive;
