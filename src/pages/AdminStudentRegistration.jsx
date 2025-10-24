import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api, NotificationsApiSecure } from '../services/api';
import './AdminStudentRegistration.css';

const AdminStudentRegistration = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]); // New state for registered students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRegisterFormVisible, setIsRegisterFormVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [studentData, setStudentData] = useState({
    offical_email: '',
    personal_email: '',
    resume: null,
    LeetCode: '',
    HackerRank: '',
    HackerEarth: '',
    LinkedIn: '',
    CGPA: 0,
    phone_number: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = {
          withCredentials: true, 
      }
      const res = await api.get(
        `/rbac/users`,
        config
      );
      console.log('users res: ', res);
      // Filter out users who are already students (role_id 13)
      setUsers(res.data.data.filter(user => user.role_id === 13) || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const config = {
        withCredentials: true,
      };
      const res = await api.get('rbac/students', config);
      console.log('students res: ', res);
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStudents(); // Fetch students on component mount
  }, []);

  const handleRegisterStudent = async (userId) => {
    // Logic to register student
    console.log(`Registering user ${userId} as student with data:`, studentData);
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('offical_email', studentData.offical_email);
    formData.append('personal_email', studentData.personal_email);
    if (studentData.resume) {
      formData.append('resume', studentData.resume);
    }
    formData.append('LeetCode', studentData.LeetCode);
    formData.append('HackerRank', studentData.HackerRank);
    formData.append('HackerEarth', studentData.HackerEarth);
    formData.append('linkedin', studentData.LinkedIn);
    formData.append('CGPA', studentData.CGPA);
    formData.append('phone_number', studentData.phone_number);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      };
      const response = await api.post(`rbac/students/register/${userId}`, formData, config);
      toast.success('Student registered successfully!');
      console.log('Student registration response:', response.data);
      setIsRegisterFormVisible(false);
      setSelectedUser(null);
      setStudentData({
        offical_email: '',
        personal_email: '',
        resume: null,
        LeetCode: '',
        HackerRank: '',
        HackerEarth: '',
        LinkedIn: '',
        CGPA: 0,
        phone_number: '',
      });
      fetchUsers(); // Refresh users list
      fetchStudents(); // Refresh students list
    } catch (err) {
      console.error('Error registering student:', err);
      toast.error(err.response?.data?.message || 'Failed to register student');
    }
  };

  const handleStudentDataChange = (e) => {
    const { name, value, files } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setStudentData({
        ...student,
        resume: null // Resume is not pre-filled
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
        try {
            const config = { withCredentials: true };
            await api.delete(`/rbac/students/${studentId}`, config);
            toast.success('Student deleted successfully!');
            fetchStudents(); // Refresh the list
        } catch (err) {
            console.error('Error deleting student:', err);
            toast.error(err.response?.data?.message || 'Failed to delete student');
        }
    }
  };

  const handleUpdateStudent = async () => {
    const formData = new FormData();
    Object.keys(studentData).forEach(key => {
        if (key !== 'resume' || (studentData.resume && studentData.resume instanceof File)) {
            formData.append(key, studentData[key]);
        }
    });

    try {
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
        };
        await api.put(`/rbac/students/${editingStudent.id}`, formData, config);
        toast.success('Student updated successfully!');
        setIsEditModalOpen(false);
        setEditingStudent(null);
        fetchStudents(); // Refresh the list
    } catch (err) {
        console.error('Error updating student:', err);
        toast.error(err.response?.data?.message || 'Failed to update student');
    }
  };

  return (
    <div className="admin-student-registration-container">
      <h1 className="page-title">Manage Student Registrations</h1>
      <p className="page-subtitle">Select a user to register them as a student.</p>

      {loading && <p>Loading users...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="no-users-message">No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="table-container">
          <h2 className="section-title">Available Users for Student Registration</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role_id}</td>
                  <td>
                    <button 
                      className="button"
                      onClick={() => {
                        setSelectedUser(user);
                        setStudentData(prev => ({
                          ...prev,
                          offical_email: user.email,
                          // Assuming personal_email and phone_number might be available in user object
                          // or can be left empty for manual entry
                          personal_email: user.personal_email || '',
                          phone_number: user.phone_number || '',
                        }));
                        setIsRegisterFormVisible(true);
                      }}
                    >
                      Register as Student
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isRegisterFormVisible && selectedUser && (
        <div className="modal-overlay">
          <div className="modal card">
            <h3 className="modal-title">Register {selectedUser.name} as Student</h3>
            <div className="modal-content">
              <div className="form-field">
                <label htmlFor="offical_email">Official Email:</label>
                <input
                  id="offical_email"
                  type="email"
                  className="form-input"
                  name="offical_email"
                  value={studentData.offical_email}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="personal_email">Personal Email:</label>
                <input
                  id="personal_email"
                  type="email"
                  className="form-input"
                  name="personal_email"
                  value={studentData.personal_email}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="resume">Resume:</label>
                <input
                  id="resume"
                  type="file"
                  className="form-input"
                  name="resume"
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="LeetCode">LeetCode Profile:</label>
                <input
                  id="LeetCode"
                  type="text"
                  className="form-input"
                  name="LeetCode"
                  value={studentData.LeetCode}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="HackerRank">HackerRank Profile:</label>
                <input
                  id="HackerRank"
                  type="text"
                  className="form-input"
                  name="HackerRank"
                  value={studentData.HackerRank}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="HackerEarth">HackerEarth Profile:</label>
                <input
                  id="HackerEarth"
                  type="text"
                  className="form-input"
                  name="HackerEarth"
                  value={studentData.HackerEarth}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="LinkedIn">LinkedIn Profile:</label>
                <input
                  id="LinkedIn"
                  type="text"
                  className="form-input"
                  name="LinkedIn"
                  value={studentData.LinkedIn}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="CGPA">CGPA:</label>
                <input
                  id="CGPA"
                  type="number"
                  step="0.1"
                  className="form-input"
                  name="CGPA"
                  value={studentData.CGPA}
                  onChange={handleStudentDataChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="phone_number">Phone Number:</label>
                <input
                  id="phone_number"
                  type="tel"
                  className="form-input"
                  name="phone_number"
                  value={studentData.phone_number}
                  onChange={handleStudentDataChange}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="button secondary" onClick={() => setIsRegisterFormVisible(false)}>Cancel</button>
              <button className="button" onClick={() => handleRegisterStudent(selectedUser.id)}>
                Register Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditModalOpen && editingStudent && (
        <div className="modal-overlay">
          <div className="modal card">
            <h3 className="modal-title">Edit Student: {editingStudent.name}</h3>
            <div className="modal-content">
              {/* Form fields for editing, similar to registration */}
              <div className="form-field">
                <label>Official Email:</label>
                <input type="email" name="offical_email" value={studentData.offical_email} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>Personal Email:</label>
                <input type="email" name="personal_email" value={studentData.personal_email} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>CGPA:</label>
                <input type="number" step="0.1" name="CGPA" value={studentData.CGPA} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>Phone Number:</label>
                <input type="tel" name="phone_number" value={studentData.phone_number} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>LeetCode Profile:</label>
                <input type="text" name="LeetCode" value={studentData.LeetCode} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>HackerRank Profile:</label>
                <input type="text" name="HackerRank" value={studentData.HackerRank} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>HackerEarth Profile:</label>
                <input type="text" name="HackerEarth" value={studentData.HackerEarth} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>LinkedIn Profile:</label>
                <input type="text" name="LinkedIn" value={studentData.LinkedIn} onChange={handleStudentDataChange} className="form-input" />
              </div>
              <div className="form-field">
                <label>Update Resume:</label>
                <input type="file" name="resume" onChange={handleStudentDataChange} className="form-input" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="button secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button className="button" onClick={handleUpdateStudent}>Update Student</button>
            </div>
          </div>
        </div>
      )}

      {/* Display Registered Students */}
      {!loading && !error && students.length === 0 && (
        <p className="no-students-message">No registered students found.</p>
      )}
      {!loading && !error && students.length > 0 && (
        <div className="table-container registered-students-section">
          <h2 className="section-title">Registered Students</h2>
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Official Email</th>
                <th>Personal Email</th>
                <th>CGPA</th>
                <th>Phone Number</th>
                <th>LeetCode</th>
                <th>HackerRank</th>
                <th>HackerEarth</th>
                <th>LinkedIn</th>
                <th>Resume</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.offical_email}</td>
                  <td>{student.personal_email}</td>
                  <td>{student.CGPA}</td>
                  <td>{student.phone_number}</td>
                  <td><a href={student.LeetCode} target="_blank" rel="noopener noreferrer">Link</a></td>
                  <td><a href={student.HackerRank} target="_blank" rel="noopener noreferrer">Link</a></td>
                  <td><a href={student.HackerEarth} target="_blank" rel="noopener noreferrer">Link</a></td>
                  <td><a href={student.LinkedIn} target="_blank" rel="noopener noreferrer">Link</a></td>
                  <td>{student.resume ? <a href={student.resume} target="_blank" rel="noopener noreferrer">View Resume</a> : 'N/A'}</td>
                  <td>
                    <button className="button" onClick={() => handleEdit(student)}>Edit</button>
                    <button className="button secondary" onClick={() => handleDelete(student.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStudentRegistration;