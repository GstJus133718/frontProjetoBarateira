import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para adicionar token JWT apenas quando necessário
api.interceptors.request.use(
  (config) => {
    // Para rotas públicas como /filiais, não adicionar token
    const isPublicRoute = config.url && (
      config.url.startsWith('/filiais') || 
      config.url === '/filiais'
    );
    
    if (!isPublicRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log(`❌ API Error: ${error.response?.status || 'Network Error'} - ${error.config?.url}`);
    
    // Só redirecionar para login em erros 401 para rotas protegidas
    if (error.response?.status === 401 && !error.config?.url?.startsWith('/filiais')) {
      localStorage.removeItem("token");
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);

export default api;