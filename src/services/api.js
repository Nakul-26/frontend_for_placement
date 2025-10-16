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
export const editNotification = (id, notification) => NotificationsApi.put(`/notifications/${id}`, { notification }, { withCredentials: true });
export const deleteNotification = (id) => NotificationsApi.delete(`/notifications/${id}`, { withCredentials: true });
export const getNotifications = () => NotificationsApi.get(`/notifications`, { withCredentials: true });

// Job Offerings
export const addJobOffering = (jobOffering) => NotificationsApi.post(`/jobs`, { jobOffering }, { withCredentials: true });
export const editJobOffering = (id, jobOffering) => NotificationsApi.put(`/jobs/${id}`, { jobOffering }, { withCredentials: true });
export const deleteJobOffering = (id) => NotificationsApi.delete(`/jobs/${id}`, { withCredentials: true });
export const getJobOfferings = () => NotificationsApi.get(`/jobs`, { withCredentials: true });

// Users
export const readUsers = () => api.get('/rbac/users', { withCredentials: true });
export const createUser = (data) => api.post('/rbac/users/register', data, { withCredentials: true });
export const readUser = () => api.get('/rbac/users/me', { withCredentials: true });
export const updateUser = (id, data) => api.put(`/rbac/users/${id}`, data, { withCredentials: true });
export const deleteUser = (id) => api.delete(`/rbac/users/${id}`, { withCredentials: true });

// Roles
export const readRoles = () => api.get('/rbac/roles', { withCredentials: true });
export const readRole = (id) => api.get(`/rbac/roles/${id}`, { withCredentials: true });
export const createRole = (data) => api.post('/rbac/roles', data, { withCredentials: true });
export const updateRole = (id, data) => api.put(`/rbac/roles/${id}`, data, { withCredentials: true });
export const deleteRole = (id) => api.delete(`/rbac/roles/${id}`, { withCredentials: true });

// Permissions
export const readPermissions = () => api.get('/rbac/permissions', { withCredentials: true });
export const readPermission = (id) => api.get(`/rbac/permissions/${id}`, { withCredentials: true });
export const createPermission = (data) => api.post('/rbac/permissions', data, { withCredentials: true });
export const deletePermission = (id) => api.delete(`/rbac/permissions/${id}`, { withCredentials: true });

// Role-Permissions
export const readRolePermissions = (roleId) => api.get(`/rbac/role-permissions/${roleId}`, { withCredentials: true });
export const assignPermissionToRole = (data) => api.post('/rbac/role-permissions', data, { withCredentials: true });
export const revokePermissionFromRole = (data) => api.delete('/rbac/role-permissions', { data }, { withCredentials: true });
export const checkRoleAccess = (data) => api.post('/rbac/role-permissions/check-access', data, { withCredentials: true });


export { api, NotificationsApi };