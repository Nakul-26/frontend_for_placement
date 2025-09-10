import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // backend URL
  withCredentials: true, // send cookies for session auth
});

export default api;
