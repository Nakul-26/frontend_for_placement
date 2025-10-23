import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import './StudentProfileEdit.css'; // Reusing styles for consistency
import { useAuth } from '../context/useAuth'; // Import useAuth to get user info

const StudentProfileEdit = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const config = {
          withCredentials: true,
        };
        // Assuming an endpoint to get the student's own profile
        const res = await api.get(`rbac/students/${user.id}`, config);
        const data = res.data.student;
        setStudentData({
          offical_email: data.offical_email || user.email,
          personal_email: data.personal_email || '',
          resume: null, // Resume is not pre-filled for security and practical reasons
          LeetCode: data.LeetCode || '',
          HackerRank: data.HackerRank || '',
          HackerEarth: data.HackerEarth || '',
          LinkedIn: data.linkedin || '',
          CGPA: data.CGPA || 0,
          phone_number: data.phone_number || '',
        });
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to load your profile data. Please try again later.');
        toast.error(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleUpdateProfile = async () => {
    console.log('Updating profile with data:', studentData);
    const formData = new FormData();
    
    // Append all fields, checking for changes
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
      // Use PUT request to update the student's profile
      const response = await api.put(`rbac/students/${user.id}`, formData, config);
      toast.success('Profile updated successfully!');
      console.log('Profile update response:', response.data);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleStudentDataChange = (e) => {
    const { name, value, files } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  if (loading) return <p>Loading your profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="student-profile-edit-container">
      <h1 className="page-title">Edit Your Profile</h1>
      <p className="page-subtitle">Keep your information up to date.</p>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              readOnly // Official email might be non-editable
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
            <label htmlFor="resume">Update Resume (optional):</label>
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
              step="0.01"
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
        <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
          <button className="button" onClick={handleUpdateProfile}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileEdit;
