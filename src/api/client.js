import axios from "axios";

const TOKEN_STORAGE_KEY = "etf_rocket_auth_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const token = localStorage.getItem(TOKEN_STORAGE_KEY);

if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default api;
