import React, { useState } from 'react';
import './StudentEligibility.css';

const StudentEligibility = () => {
  const [criteria, setCriteria] = useState({
    minGPA: '8.0',
    minBacklogs: '0',
    requiredSkills: 'React, Node.js',
  });

  const [students] = useState([
    { id: 1, name: 'John Doe', gpa: '8.5', backlogs: '0', skills: 'React, Node.js, MongoDB', isEligible: true },
    { id: 2, name: 'Jane Smith', gpa: '7.9', backlogs: '1', skills: 'Angular, Java', isEligible: false },
    { id: 3, name: 'Peter Jones', gpa: '9.0', backlogs: '0', skills: 'React, Python, Django', isEligible: true },
  ]);

  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setCriteria({ ...criteria, [name]: value });
  };

  const checkEligibility = () => {
    // In a real application, this would involve a backend API call.
    alert('Eligibility check complete!');
  };

  return (
    <div className="student-eligibility-container">
      <header className="page-header">
        <h1>Student Eligibility</h1>
        <p>Define and manage eligibility criteria for placement drives.</p>
      </header>

      <div className="eligibility-criteria-form">
        <h2>Set Eligibility Criteria</h2>
        <form>
          <div className="form-group">
            <label htmlFor="minGPA">Minimum GPA</label>
            <input
              type="text"
              id="minGPA"
              name="minGPA"
              value={criteria.minGPA}
              onChange={handleCriteriaChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="minBacklogs">Maximum Backlogs</label>
            <input
              type="text"
              id="minBacklogs"
              name="minBacklogs"
              value={criteria.minBacklogs}
              onChange={handleCriteriaChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="requiredSkills">Required Skills (comma-separated)</label>
            <input
              type="text"
              id="requiredSkills"
              name="requiredSkills"
              value={criteria.requiredSkills}
              onChange={handleCriteriaChange}
            />
          </div>
          <button type="button" className="btn-primary" onClick={checkEligibility}>
            Apply Criteria & Check Eligibility
          </button>
        </form>
      </div>

      <div className="student-eligibility-list">
        <h2>Student Eligibility Status</h2>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>GPA</th>
              <th>Backlogs</th>
              <th>Skills</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.gpa}</td>
                <td>{student.backlogs}</td>
                <td>{student.skills}</td>
                <td>
                  <span className={`status ${student.isEligible ? 'eligible' : 'not-eligible'}`}>
                    {student.isEligible ? 'Eligible' : 'Not Eligible'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentEligibility;
