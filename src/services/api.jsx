import axios from "axios";

// URL base da sua API FastAPI
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar o token JWT se necessário
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou outra forma de armazenar
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
