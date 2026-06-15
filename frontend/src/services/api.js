import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if user is authenticated
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await API.post('/api/auth/register', { name, email, password });
    return response.data;
  },
};

export const interviewAPI = {
  generateSession: async (jobRole) => {
    const response = await API.post('/api/interviews/generate', { jobRole });
    return response.data;
  },
  getSession: async (sessionId) => {
    const response = await API.get(`/api/interviews/${sessionId}`);
    return response.data;
  },
  submitAnswer: async (questionId, answerText) => {
    const response = await API.post('/api/interviews/evaluate', { questionId, answerText });
    return response.data;
  },
  getHistory: async () => {
    const response = await API.get('/api/interviews/history');
    return response.data;
  },
};

export const resumeAPI = {
  analyzeResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/api/resumes/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getHistory: async () => {
    const response = await API.get('/api/resumes/history');
    return response.data;
  },
};

export const roadmapAPI = {
  generateRoadmap: async (careerGoal) => {
    const response = await API.post('/api/roadmaps/generate', { careerGoal });
    return response.data;
  },
};

export const profileAPI = {
  getStats: async () => {
    const response = await API.get('/api/profile/stats');
    return response.data;
  },
};

export default API;
