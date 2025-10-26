import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const notificationUrl = import.meta.env.VITE_NOTIFICATIONS_URL;
const notificationUrlSecure = import.meta.env.VITE_NOTIFICATIONS_URL_SECURE;

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined. Please check your .env file and restart the development server.");
}

if (!notificationUrl) {
  throw new Error("VITE_NOTIFICATIONS_URL is not defined. Please check your .env file and restart the development server.");
}

if (!notificationUrlSecure) {
  throw new Error("VITE_NOTIFICATIONS_URL_SECURE is not defined. Please check your .env file and restart the development server.");
}

const api = axios.create({
  baseURL: backendUrl, // backend URL
  withCredentials: true, // send cookies for session auth
});

const NotificationsApi = axios.create({
  baseURL: `${notificationUrl}/`, // backend URL
  withCredentials: true, // send cookies for session auth
});

const NotificationsApiSecure = axios.create({
  baseURL: `${notificationUrlSecure}/`, // backend URL
  withCredentials: true, // send cookies for session auth
});

// Handle expired tokens with automatic refresh
const responseInterceptor = async (error) => {
  console.log('API Interceptor processing response');
  const originalRequest = error.config;

  // Only attempt refresh if the error is "access token not defined" and we haven't retried yet
  console.log('API Interceptor error:', error);
  console.log('API Interceptor caught error:', error.response?.data?.message);
  if (
    (error.response?.data?.message === "access token not defined" || error.response?.data?.message === "Invalid or expired token" || error.response?.data?.message === "Authorization token required") &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    try {
      // Attempt to refresh the token
      const response = await api.post("/api/login");
      console.log("Token refreshed successfully:", response);
      // Retry the original request with the new token (cookies will be sent automatically)
      if (originalRequest.baseURL === backendUrl) {
        return api(originalRequest);
      } else if (originalRequest.baseURL === `${notificationUrl}/`) {
        return NotificationsApi(originalRequest);
      } else if (originalRequest.baseURL === `${notificationUrlSecure}/`) {
        return NotificationsApiSecure(originalRequest);
      }
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      // Let the error propagate - AuthProvider will handle clearing user state if needed
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, responseInterceptor);
NotificationsApi.interceptors.response.use((response) => response, responseInterceptor);
NotificationsApiSecure.interceptors.response.use((response) => response, responseInterceptor);

// GraphQL request helper
export const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await NotificationsApiSecure.post('/graphql', {
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    console.error('GraphQL request failed:', error);
    throw error;
  }
};

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

export { api, NotificationsApi, NotificationsApiSecure };