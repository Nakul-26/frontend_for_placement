import React, { useState, useEffect } from 'react';
import './RecommendedJobs.css';
import { getJobOfferings } from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/useAuth';

export default function RecommendedJobs() {
  const [jobOfferings, setJobOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  // State to hold the ID of the job currently being submitted/has an error/success
  const [currentJobStatus, setCurrentJobStatus] = useState({
      id: null,
      message: '',
      type: null // 'success' or 'error'
  });

  useEffect(() => {
    // ... (fetchJobOfferings logic remains the same)
    const fetchJobOfferings = async () => {
        // ... (your existing fetch logic)
    };
    fetchJobOfferings();
  }, []);

  const handleApply = async (job) => {
    // Reset status for the new attempt
    setCurrentJobStatus({ id: job.id, message: '', type: 'loading' });

    if (!user) {
      toast.error('Please login to apply for jobs.');
      setCurrentJobStatus({ id: null, message: '', type: null }); // Clear status
      return;
    }
    const payload = {
      user_name: user.name || user.user_name || user.fullName || user.username || '',
      user_email: user.email || user.user_email || '',
      user_id: user.id || user.user_id || '',
      jobid: job.id || job.jobid || '',
    };
    try {
      const res = await fetch('https://notification-31at.onrender.com/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Response from application submission:', res);
      
      // Attempt to parse JSON, default to empty object on failure
      const result = await res.json().catch(() => ({})); 

      if (res.ok) {
        const successMessage = result?.message || 'Application submitted successfully!';
        // Update state for inline message display
        setCurrentJobStatus({ id: job.id, message: successMessage, type: 'success' }); 
        // Also show a toast for better UX
        toast.success(successMessage); 
        
        if (job.apply_link) {
          window.open(job.apply_link, '_blank', 'noopener,noreferrer');
        }
      } else {
        const errorMessage = result?.message || 'Failed to submit your application. Please try again later.';
        // Update state for inline message display
        setCurrentJobStatus({ id: job.id, message: errorMessage, type: 'error' });
        // Also show a toast for better UX
        toast.error(errorMessage);
      }
    } catch (err) {
        const networkError = 'Network error: Unable to submit application.';
        // Update state for inline message display
        setCurrentJobStatus({ id: job.id, message: networkError, type: 'error' });
        // Also show a toast for better UX
        toast.error(networkError);
    }
    // Optionally, use a setTimeout here to clear the status after a few seconds.
  };

  if (loading) {
    // ... (loading state render remains the same)
  }

  return (
    <div className="recommended-jobs-container">
      {/* ... (header remains the same) */}
      <div className="recommended-jobs-content">
        <div className="job-listings">
          {jobOfferings.length > 0 ? (
            jobOfferings.map((job) => (
              <div key={job.id || job.title} className="job-card">
                {/* ... (job-card-header and job-card-body remain the same) */}
                <div className="job-card-footer">
                  <button 
                    className="apply-now-btn" 
                    onClick={() => handleApply(job)}
                    disabled={currentJobStatus.id === job.id && currentJobStatus.type === 'loading'}
                  >
                    {currentJobStatus.id === job.id && currentJobStatus.type === 'loading' ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
                
                {/* CORRECTED INLINE MESSAGE DISPLAY */}
                {currentJobStatus.id === job.id && currentJobStatus.type === 'error' && (
                  <p className="error-message">{currentJobStatus.message}</p>
                )}
                {currentJobStatus.id === job.id && currentJobStatus.type === 'success' && (
                  <p className="success-message">{currentJobStatus.message}</p>
                )}
              </div>
            ))
          ) : (
            <p>No recommended jobs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}