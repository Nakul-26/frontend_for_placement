import axios from "axios";

const api = axios.create({
  baseURL: "https://completeplacementrepo.vercel.app/api", // backend URL
  withCredentials: true, // send cookies for session auth
});

export default api;
