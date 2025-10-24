
import React, { useState, useEffect } from 'react';
import { NotificationsApiSecure } from '../services/api';
import { toast } from 'react-toastify';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await NotificationsApiSecure.get('/companyonly');
        setLogo(response.data.company.logo);
      } catch (error) {
        toast.error('Failed to load company logo.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      toast.error('Please select a logo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      const response = await NotificationsApiSecure.put('/companyonly', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLogo(response.data.company.logo);
      setLogoFile(null);
      toast.success('Logo updated successfully!');
    } catch (error) {
      toast.error('Failed to update logo.');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="company-profile-container">
      <div className="profile-header">
        <h1>Update Company Logo</h1>
      </div>

      {logo && (
        <div className="profile-section">
            <h2 className="section-title">Current Logo</h2>
            <img src={logo} alt="Company Logo" className="company-logo-img" />
        </div>
      )}

      <div className="profile-section">
        <h2 className="section-title">Upload New Logo</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="logo-upload">Select Logo:</label>
            <input id="logo-upload" type="file" name="logo" onChange={handleFileChange} />
          </div>
          <div className="profile-actions">
            <button type="submit" className="save-button">Upload Logo</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;