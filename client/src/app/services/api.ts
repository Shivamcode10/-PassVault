import axios from "axios";

// ✅ Use environment variable (Vercel + Local)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 🔐 TOKEN IN MEMORY (NOT localStorage)
let authToken: string | null = null;

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// 🔐 SET TOKEN (IN MEMORY ONLY)
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// ================= AUTH =================

export const signup = (name: string, email: string, password: string) =>
  api.post("/api/auth/register", { name, email, password });

export const login = (email: string, password: string) =>
  api.post("/api/auth/login", { email, password });

export const verifyOTP = (email: string, otp: string) =>
  api.post("/api/auth/verify-otp", { email, otp });

// ================= PASSWORD =================

export const getPasswords = () =>
  api.get("/api/passwords");

export const createPassword = (data: any) =>
  api.post("/api/passwords", data);

export const deletePassword = (id: string) =>
  api.delete(`/api/passwords/${id}`);

export const updatePassword = (id: string, data: any) =>
  api.put(`/api/passwords/${id}`, data);

// ================= USER =================

export const updateProfile = (data: any) =>
  api.put("/api/auth/profile", data);

export const changePassword = (data: any) =>
  api.put("/api/auth/change-password", data);

export const toggle2FA = (enabled: boolean) =>
  api.put("/api/user/toggle-2fa", { enabled });

export const toggleAutoLock = (enabled: boolean) =>
  api.put("/api/user/toggle-autolock", { enabled });

export default api;