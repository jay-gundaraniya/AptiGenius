import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    signup: (data) => api.post('/auth/signup', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    getAllUsers: () => api.get('/auth/users'),
    getStudentById: (id) => api.get(`/auth/users/${id}`),
    deleteUser: (id) => api.delete(`/auth/users/${id}`)
};

// Questions APIs
export const questionsAPI = {
    getRandom: (params) => api.get('/questions/random', { params }),
    getAll: () => api.get('/questions/all'),
    create: (data) => api.post('/questions', data),
    update: (id, data) => api.put(`/questions/${id}`, data),
    delete: (id) => api.delete(`/questions/${id}`)
};

// Results APIs
export const resultsAPI = {
    submit: (data) => api.post('/results/submit', data),
    getMyResults: () => api.get('/results/my-results'),
    getStats: () => api.get('/results/stats'),
    getAIReadiness: () => api.get('/results/ai-readiness'),
    getAll: () => api.get('/results/all'),
    getOverview: () => api.get('/results/overview')
};

export default api;
