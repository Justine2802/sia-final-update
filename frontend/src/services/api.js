import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Residents API
export const residentsAPI = {
  getAll: () => api.get('/residents'),
  create: (data) => api.post('/residents', data),
  update: (id, data) => api.put(`/residents/${id}`, data),
  delete: (id) => api.delete(`/residents/${id}`),
  getById: (id) => api.get(`/residents/${id}`),
};

// Programs API
export const programsAPI = {
  getAll: () => api.get('/programs'),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
  getById: (id) => api.get(`/programs/${id}`),
  enroll: (programId, residentId, remarks = '') => 
    api.post(`/programs/${programId}/enroll`, {
      residents_id: residentId,
      remarks: remarks
    }),
};

// Incidents API
export const incidentsAPI = {
  getAll: () => api.get('/incidents'),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
  getById: (id) => api.get(`/incidents/${id}`),
};

// Certificates API
export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
  getById: (id) => api.get(`/certificates/${id}`),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => api.get('/enrollments'),
  create: (data) => api.post('/enrollments', data),
  update: (id, data) => api.put(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
  getById: (id) => api.get(`/enrollments/${id}`),
};

// Authentication API
export const authAPI = {
  registerResident: (data) => api.post('/residents/register', data),
  loginResident: (data) => api.post('/residents/login', data),
};

export default api;
