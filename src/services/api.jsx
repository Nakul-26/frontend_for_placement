import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const notificationUrl = import.meta.env.VITE_NOTIFICATIONS_URL;

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined. Please check your .env file and restart the development server.");
}

if (!notificationUrl) {
  throw new Error("VITE_NOTIFICATIONS_URL is not defined. Please check your .env file and restart the development server.");
}

const api = axios.create({
  baseURL: backendUrl, // backend URL
  withCredentials: true, // send cookies for session auth
});

// Handle expired tokens with automatic refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if the error is "access token not defined" and we haven't retried yet
    if (
      error.response?.data?.message === "access token not defined" && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token
        await api.get("/api/refresh");
        // Retry the original request with the new token (cookies will be sent automatically)
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Let the error propagate - AuthProvider will handle clearing user state if needed
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const NotificationsApi = axios.create({
  baseURL: notificationUrl, // backend URL
  withCredentials: true, // send cookies for session auth
});

// Notifications
export const addNotification = (notification) => {
  console.log('Adding notification 2:', notification);
  return NotificationsApi.post(`/notifications`, { notification });
}
export const editNotification = (id, notification) => NotificationsApi.put(`/notifications/${id}`, { notification });
export const deleteNotification = (id) => NotificationsApi.delete(`/notifications/${id}`);
export const getNotifications = () => NotificationsApi.get(`/notifications`);

// Job Offerings
export const addJobOffering = (jobOffering) => NotificationsApi.post(`/jobs`, { jobOffering });
export const editJobOffering = (id, jobOffering) => NotificationsApi.put(`/jobs/${id}`, { jobOffering });
export const deleteJobOffering = (id) => NotificationsApi.delete(`/jobs/${id}`);
export const getJobOfferings = () => NotificationsApi.get(`/jobs`);

export { api, NotificationsApi };