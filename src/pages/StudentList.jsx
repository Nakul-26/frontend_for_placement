import React, { useState } from 'react';
import './StudentList.css';

export default function StudentList() {
  const [studentList] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      branch: 'Computer Science',
      cgpa: 8.5,
      eligible: true,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      branch: 'Electronics and Communication',
      cgpa: 9.2,
      eligible: true,
    },
    {
      id: 3,
      name: 'Peter Jones',
      email: 'peter.jones@example.com',
      branch: 'Mechanical Engineering',
      cgpa: 7.8,
      eligible: false,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branch, setBranch] = useState('all');
  const [eligibility, setEligibility] = useState('all');

  const filteredStudents = studentList
    .filter((student) => {
      if (branch !== 'all' && student.branch !== branch) {
        return false;
      }
      if (eligibility !== 'all' && student.eligible.toString() !== eligibility) {
        return false;
      }
      if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h1 className="student-list-title">Student List</h1>
        <p className="student-list-subtitle">View, search, and manage student profiles and eligibility.</p>
      </div>
      <div className="student-list-filters">
        <input
          type="text"
          className="form-input"
          placeholder="Search for students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="form-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="all">All Branches</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electronics and Communication">Electronics and Communication</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
        </select>
        <select className="form-select" value={eligibility} onChange={(e) => setEligibility(e.target.value)}>
          <option value="all">All Eligibility</option>
          <option value="true">Eligible</option>
          <option value="false">Not Eligible</option>
        </select>
      </div>
      <div className="student-list-content">
        <div className="student-grid">
          {filteredStudents.map((student) => (
            <div key={student.id} className={`student-card ${student.eligible ? 'eligible' : 'not-eligible'}`}>
              <div className="student-card-header">
                <h2 className="student-card-name">{student.name}</h2>
                <p className="student-card-branch">{student.branch}</p>
              </div>
              <div className="student-card-body">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>CGPA:</strong> {student.cgpa}</p>
              </div>
              <div className="student-card-footer">
                <p className={`student-card-eligibility`}>{student.eligible ? 'Eligible' : 'Not Eligible'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
