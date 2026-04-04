import axios from "axios";
import { auth } from "../firebase";

const API_BASE = "http://localhost:5000/api";

// Axios instance
const api = axios.create({ baseURL: API_BASE });

// Auto-attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
