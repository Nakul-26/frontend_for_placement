import React, { useState, useEffect } from 'react';
import { NotificationsApi, NotificationsApiSecure } from '../services/api'; 
import './ManageCompanies.css'; 
import { toast } from 'react-toastify';

// Helper function: Converts array to comma-separated string for display/input
const formatArrayForInput = (arr) => {
  if (Array.isArray(arr)) {
    return arr.join(', ');
  }
  // When initializing a new company, the state will be an empty string, which is fine
  return arr || ''; 
};

// Helper function: Converts comma-separated string back to array for API payload
const prepareArrayForApi = (str) => {
  return (str || '').split(',').map(s => s.trim()).filter(Boolean);
};

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for the selected logo file
  const [logoFile, setLogoFile] = useState(null);
  // State for the image preview URL
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');

  // Helper to get the current object being viewed/edited
  const currentCompany = editingCompany || newCompany;

  // Effect to generate preview URL for selected file OR display existing logo
  useEffect(() => {
    // 1. If a new file is selected, create a temporary URL
    if (logoFile) {
      setLogoPreviewUrl(URL.createObjectURL(logoFile));
      // Cleanup function to revoke the object URL when the dependency changes
      return () => URL.revokeObjectURL(logoPreviewUrl); 
    } 
    // 2. If editing and no new file is selected, use the existing logo URL
    else if (currentCompany && currentCompany.logo) {
      setLogoPreviewUrl(currentCompany.logo); 
    } 
    // 3. Otherwise, clear the preview
    else {
      setLogoPreviewUrl('');
    }
    // Cleanup ensures we only revoke URLs created in this specific instance
    return () => {}; 
  }, [logoFile, currentCompany]);

  // Handler for all text and number inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const currentObj = newCompany || editingCompany;

    if (currentObj) {
      const updateFunc = newCompany ? setNewCompany : setEditingCompany;
      
      updateFunc({ 
        ...currentObj, 
        [name]: value // Store string value directly in state
      });
    }
  };

  // Handler for the file input
  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await NotificationsApiSecure.get('/companies'); 
      setCompanies(res.data.companies || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const resetModalState = () => {
    // Crucial: Set to null to close the modal and clear active edit/new state
    setNewCompany(null);
    setEditingCompany(null); 
    
    // Cleanup image states
    setLogoFile(null);      
    setLogoPreviewUrl('');
  };

  const buildFormData = (companyData, isEditing = false) => {
    const formData = new FormData();
    
    // Append text fields
    for (const key in companyData) {
      if (companyData.hasOwnProperty(key)) {
        // Skip logo, which is handled separately
        if (key === 'logo') continue; 
        
        // Handle array fields converted to strings by prepareArrayForApi
        if (Array.isArray(companyData[key])) {
          companyData[key].forEach(item => formData.append(key + '[]', item));
        } else {
          formData.append(key, companyData[key]);
        }
      }
    }

    // Append logo file or existing URL
    if (logoFile) {
      formData.append('logo', logoFile);
    } else if (isEditing && currentCompany?.logo) {
      // If editing and no new file, re-send the existing logo URL
      formData.append('logo', currentCompany.logo); 
    }
    // If adding and no logo, 'logo' is simply omitted from payload

    return formData;
  };

  const handleAddCompany = async () => {
    try {
      if (!newCompany.name || !newCompany.email) {
        toast.error('Company Name and Email are required.');
        return;
      }

      const payload = {
        name: newCompany.name,
        email: newCompany.email,
        phone: newCompany.phone || '',
        description: newCompany.description || '',
        // Convert the comma-separated strings back to arrays for the API
        headquarters: prepareArrayForApi(newCompany.headquarters), 
        sub_branch_location: prepareArrayForApi(newCompany.sub_branch_location),
        type: prepareArrayForApi(newCompany.type),
      };

      const formData = buildFormData(payload, false);

      const res = await NotificationsApiSecure.post('/companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Company added successfully:', res.data);
      
      toast.success('Company added successfully!');
      resetModalState();
      fetchCompanies(); 
    } catch (error) {
      console.error('Error adding company:', error);
      toast.error(error.response?.data?.message || 'Failed to add company.');
    }
  };

  const handleEditCompany = async () => {
    try {
      if (!editingCompany.name || !editingCompany.email) {
        toast.error('Company Name and Email are required.');
        return;
      }
      
      const payload = {
        name: editingCompany.name,
        email: editingCompany.email,
        phone: editingCompany.phone || '',
        description: editingCompany.description || '',
        // FIX: Use editingCompany state for array conversions
        headquarters: prepareArrayForApi(editingCompany.headquarters), 
        sub_branch_location: prepareArrayForApi(editingCompany.sub_branch_location),
        type: prepareArrayForApi(editingCompany.type),
      };

      const formData = buildFormData(payload, true); 

      const res = await NotificationsApiSecure.put(`/companies/${editingCompany.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Company updated successfully:', res.data);
      

      toast.success('Company updated successfully!');
      resetModalState();
      fetchCompanies(); 
    } catch (error) {
      console.error('Error editing company:', error);
      toast.error(error.response?.data?.message || 'Failed to update company.');
    }
  };

  const handleDeleteCompany = async (id) => {
    try {
      const res = await NotificationsApiSecure.delete(`/companies/${id}`);
      console.log('Company deleted successfully:', res.data);
      toast.success('Company deleted successfully!');
      fetchCompanies(); 
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(error.response?.data?.message || 'Failed to delete company.');
    }
  };

  if (loading) {
    return (
      <div className="job-offerings-container">
        <h1 className="page-title">Manage Companies</h1>
        <p>Loading companies...</p>
      </div>
    );
  }

  return (
    <div className="job-offerings-container">
      <h1 className="page-title">Manage Companies</h1>
      <div className="form-container">
        <button className="button" onClick={() => {
            setNewCompany({
                name: '', email: '', phone: '', logo: '', description: '',
                // Initialize array fields as empty strings for input visibility fix
                headquarters: '', 
                sub_branch_location: '', 
                type: '', 
            });
            setLogoFile(null);
            setLogoPreviewUrl('');
        }}>Add New Company</button>
      </div>
      
      {/* Company Listings Grid */}
      <div className="job-listings">
        {companies.map((company) => (
          <div key={company.id} className="job-card">
            <div className="job-card-header">
              {company.logo && <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />}
              <div>
                <div className="job-title">{company.name}</div>
                <div className="company-name">{company.email}</div>
              </div>
            </div>
            <div className="job-card-body">
              <p><strong>Phone:</strong> {company.phone || 'N/A'}</p>
              <p><strong>Description:</strong> {company.description || 'N/A'}</p>
              <p><strong>Type:</strong> {formatArrayForInput(company.type) || 'N/A'}</p>
              <p><strong>Headquarters:</strong> {formatArrayForInput(company.headquarters) || 'N/A'}</p>
              <p><strong>Sub Branches:</strong> {formatArrayForInput(company.sub_branch_location) || 'N/A'}</p>
              {company.created_at && <p className="company-name">Created: {new Date(company.created_at).toLocaleDateString()}</p>}
            </div>
            <div className="job-card-footer">
              <button 
                className="button" 
                onClick={() => {
                    setEditingCompany({
                        ...company, 
                        // FIX: Convert arrays to strings ONLY when loading for edit
                        headquarters: formatArrayForInput(company.headquarters),
                        sub_branch_location: formatArrayForInput(company.sub_branch_location),
                        type: formatArrayForInput(company.type),
                    });
                    setLogoFile(null); 
                    // useEffect handles setting logoPreviewUrl to company.logo
                }}
              >
                Edit
              </button>
              <button className="button danger" onClick={() => handleDeleteCompany(company.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(editingCompany || newCompany) && (
        <div className="modal-overlay">
          <div className="modal card">
            <h3 className="modal-title">{newCompany ? 'Add New Company' : `Edit ${editingCompany.name}`}</h3>
            
            {newCompany && (
              <>
              <label htmlFor="name">Company Name:</label>
              <input
                type="text" id="name" name="name" className="form-input"
                value={currentCompany?.name || ''}
                onChange={handleInputChange}
                placeholder="Enter company name"
              />
              </>
            )}
            
            <label htmlFor="email">Email:</label>
            <input
              type="email" id="email" name="email" className="form-input"
              value={currentCompany?.email || ''}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
            
            <label htmlFor="phone">Phone:</label>
            <input
              type="text" id="phone" name="phone" className="form-input"
              value={currentCompany?.phone || ''}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            
            <label htmlFor="logo">Company Logo (Image File):</label>
            <input
              type="file" id="logo" name="logo" accept="image/*" 
              className="form-input" 
              onChange={handleLogoFileChange}
            />
            
            {/* Image Preview */}
            {logoPreviewUrl && (
              <div className="image-preview" style={{ marginBottom: '15px' }}>
                <img 
                  src={logoPreviewUrl} 
                  alt="Company Logo Preview" 
                  style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #eee' }} 
                />
              </div>
            )}

            <label htmlFor="description">Description:</label>
            <textarea
              id="description" name="description" className="form-textarea"
              value={currentCompany?.description || ''}
              onChange={handleInputChange}
              placeholder="Enter company description"
            ></textarea>
            
            <label htmlFor="headquarters">Headquarters (comma separated):</label>
            <input
              type="text" id="headquarters" name="headquarters" className="form-input"
              value={currentCompany?.headquarters || ''}
              onChange={handleInputChange} 
              placeholder="e.g., Sindhnoor, Bangalore"
            />

            <label htmlFor="sub_branch_location">Sub Branches (comma separated):</label>
            <input
              type="text" id="sub_branch_location" name="sub_branch_location" className="form-input"
              value={currentCompany?.sub_branch_location || ''}
              onChange={handleInputChange}
              placeholder="e.g., Bellary, Delhi"
            />

            <label htmlFor="type">Type (comma separated):</label>
            <input
              type="text" id="type" name="type" className="form-input"
              value={currentCompany?.type || ''}
              onChange={handleInputChange}
              placeholder="e.g., crm, erp, software"
            />

            <div className="modal-actions">
              <button 
                className="button" 
                onClick={newCompany ? handleAddCompany : handleEditCompany}
              >
                Save
              </button>
              <button 
                className="button secondary" 
                onClick={resetModalState}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}