import React, { useState, useEffect } from 'react';
import { NotificationsApi } from '../services/api'; // Use NotificationsApi as shown in your original code
import './ManageCompanies.css'; // Reuse existing styles
import { toast } from 'react-toastify';

// Helper function to handle array fields for input/output
const formatArrayForInput = (arr) => {
  if (Array.isArray(arr)) {
    return arr.join(', ');
  }
  return '';
};

// Helper function to format input string into a clean array
const prepareArrayForApi = (str) => {
  return (str || '').split(',').map(s => s.trim()).filter(Boolean);
};

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const [logoFile, setLogoFile] = useState(null);
  // State for the image preview URL (either selected file's object URL or existing company's logo URL)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');

  // Helper to get the current object being viewed/edited
  const currentCompany = editingCompany || newCompany;

  useEffect(() => {
    if (logoFile) {
      setLogoPreviewUrl(URL.createObjectURL(logoFile));
      return () => URL.revokeObjectURL(logoPreviewUrl); // Cleanup
    } else if (currentCompany && currentCompany.logo) {
      setLogoPreviewUrl(currentCompany.logo); // Display existing logo from API
    } else {
      setLogoPreviewUrl(''); // Clear preview if no file and no existing logo
    }
  }, [logoFile, currentCompany]);

  // Helper to update the current object state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (newCompany) {
      setNewCompany({ ...newCompany, [name]: value });
    } else if (editingCompany) {
      setEditingCompany({ ...editingCompany, [name]: value });
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
      // Endpoint is GET /companies based on your JSON structure
      const res = await NotificationsApi.get('/companies'); 
      console.log('companies res: ', res);
      // Assuming res.data.companies is an array of company objects
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
    setNewCompany(null);
    setEditingCompany(null);
    setLogoFile(null);       // Clear selected file
    setLogoPreviewUrl(''); // Clear preview URL
  };

  const buildFormData = (companyData, isEditing = false) => {
    const formData = new FormData();
    
    // Append text fields
    for (const key in companyData) {
      if (companyData.hasOwnProperty(key) && key !== 'logo') { // Skip logo for now
        if (Array.isArray(companyData[key])) {
          companyData[key].forEach(item => formData.append(key + '[]', item));
        } else {
          formData.append(key, companyData[key]);
        }
      }
    }

    // Append logo:
    // If a new file is selected, use it.
    if (logoFile) {
      formData.append('logo', logoFile);
    } 
    // If editing and no *new* file is selected, but an existing logo URL exists, re-send the URL
    // (This is a common pattern if the backend updates logo only if a new file is present,
    // otherwise it keeps the old one. If your backend *requires* a file every time,
    // or you're managing separate logo upload, adjust this logic)
    else if (isEditing && currentCompany?.logo) {
      formData.append('logo', currentCompany.logo); // Re-send the existing URL if no new file is chosen
    }
    // For 'add', if no file chosen, 'logo' simply won't be appended (or backend handles default)

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
        phone: newCompany.phone || '', // Ensure it's not undefined
        description: newCompany.description || '',
        headquarters: prepareArrayForApi(newCompany.headquarters), // Converts the string back to array
        sub_branch_location: prepareArrayForApi(newCompany.sub_branch_location),
        type: prepareArrayForApi(newCompany.type),
      };

      const formData = buildFormData(payload, false); // Not editing

      const res = await NotificationsApi.post('/companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
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
        headquarters: prepareArrayForApi(newCompany.headquarters), // Converts the string back to array
        sub_branch_location: prepareArrayForApi(newCompany.sub_branch_location),
        type: prepareArrayForApi(newCompany.type),
      };

      const formData = buildFormData(payload, true); // Is editing

      const res = await NotificationsApi.put(`/companies/${editingCompany.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
      // Endpoint is DELETE /companies/:id
      await NotificationsApi.delete(`/companies/${id}`);
      toast.success('Company deleted successfully!');
      fetchCompanies(); // Refresh the list
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
                headquarters: '', // Initialize as string
                sub_branch_location: '', // Initialize as string
                type: '', // Initialize as string
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
                      ...company, // Spread all existing properties
                      // Convert array fields back to strings for the input fields
                      headquarters: formatArrayForInput(company.headquarters),
                      sub_branch_location: formatArrayForInput(company.sub_branch_location),
                      type: formatArrayForInput(company.type),
                  });
                  setLogoFile(null);
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
            
            <label htmlFor="name">Company Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={currentCompany?.name || ''}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
            
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={currentCompany?.email || ''}
              onChange={handleInputChange}
              placeholder="Enter email"
            />
            
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-input"
              value={currentCompany?.phone || ''}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
            
            <label htmlFor="logo">Company Logo (Image File):</label>
            <input
              type="file"
              id="logo"
              name="logo"
              accept="image/*" // Only accept image files
              className="form-input" 
              onChange={handleLogoFileChange}
              // Value for file inputs cannot be controlled like text inputs for security reasons.
              // If you want to clear a selected file, you reset the input element directly
              // by rendering it conditionally or using a key prop trick.
              // For simplicity, we just rely on the onChange and state.
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
            {/* End Image Preview */}

            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={currentCompany?.description || ''}
              onChange={handleInputChange}
              placeholder="Enter company description"
            ></textarea>
            <label htmlFor="headquarters">Headquarters (comma separated):</label>
            <input
              type="text"
              id="headquarters"
              name="headquarters"
              className="form-input"
              // Value is now the string directly from the state
              value={currentCompany?.headquarters || ''}
              onChange={handleInputChange} // This now correctly saves the string value
              placeholder="e.g., Sindhnoor, Bangalore"
            />

            <label htmlFor="sub_branch_location">Sub Branches (comma separated):</label>
            <input
              type="text"
              id="sub_branch_location"
              name="sub_branch_location"
              className="form-input"
              value={currentCompany?.sub_branch_location || ''}
              onChange={handleInputChange}
              placeholder="e.g., Bellary, Delhi"
            />

            <label htmlFor="type">Type (comma separated):</label>
            <input
              type="text"
              id="type"
              name="type"
              className="form-input"
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
