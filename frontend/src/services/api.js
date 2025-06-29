import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expertSystemAPI = {
  getSymptoms: () => api.get('/expert-system/symptoms'),
  getRules: () => api.get('/expert-system/rules'),
  processDiagnosis: (data) => api.post('/expert-system/diagnose', data),
};

export const consultationAPI = {
  saveConsultation: (data) => api.post('/consultation/save', data),
  getHistory: () => api.get('/consultation/history'),
  getById: (id) => api.get(`/consultation/${id}`),
};

export default api;