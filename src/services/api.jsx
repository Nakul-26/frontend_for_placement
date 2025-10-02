import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const notificationsUrl = import.meta.env.VITE_NOTIFICATIONS_URL;

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined. Please check your .env file and restart the development server.");
}

const api = axios.create({
  baseURL: backendUrl, // backend URL
  withCredentials: true, // send cookies for session auth
});

const notificationAPI = axios.create({
  baseURL: notificationsUrl,
  withCredentials: true,
});

// Notifications
export const addNotification = (notification) => api.post('/notifications', notification);
export const editNotification = (id, notification) => api.put(`/notifications/${id}`, notification);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const getNotifications = () => api.get('/notifications');

// Job Offerings
export const addJobOffering = (jobOffering) => api.post('/job-offerings', jobOffering);
export const editJobOffering = (id, jobOffering) => api.put(`/job-offerings/${id}`, jobOffering);
export const deleteJobOffering = (id) => api.delete(`/job-offerings/${id}`);
export const getJobOfferings = () => api.get('/job-offerings');

export default api;
