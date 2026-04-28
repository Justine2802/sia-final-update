import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Residents API
export const residentsAPI = {
  // Add /admin in front of all these routes
  getAll: () => api.get('/admin/residents'),
  create: (data) => api.post('/admin/residents', data),
  update: (id, data) => api.put(`/admin/residents/${id}`, data),
  delete: (id) => api.delete(`/admin/residents/${id}`),
};

// Programs API
export const programsAPI = {
  getAll: () => api.get('/admin/programs'),
  create: (data) => api.post('/admin/programs', data),
  update: (id, data) => api.put(`/admin/programs/${id}`, data),
  delete: (id) => api.delete(`/admin/programs/${id}`),
  enroll: (programId, data) => api.post(`/admin/programs/${programId}/enroll`, data),
};

// Incidents API
export const incidentsAPI = {
  getAll: () => api.get('/admin/incidents'),
  create: (data) => api.post('/admin/incidents', data),
  update: (id, data) => api.put(`/admin/incidents/${id}`, data),
  delete: (id) => api.delete(`/admin/incidents/${id}`),
};

// Certificates API
export const certificatesAPI = {
  getAll: () => api.get('/admin/certificates'),
  create: (data) => api.post('/admin/certificates', data),
  update: (id, data) => api.put(`/admin/certificates/${id}`, data),
  delete: (id) => api.delete(`/admin/certificates/${id}`),

  initiateStripe: (paymentData) => api.post('/api/automation/stripe-checkout', paymentData),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => api.get('admin/enrollments'),
  create: (data) => api.post('admin/enrollments', data),
  update: (id, data) => api.put(`admin/enrollments/${id}`, data),
  delete: (id) => api.delete(`admin/enrollments/${id}`),
  getById: (id) => api.get(`admin/enrollments/${id}`),
};

export const programResidentsAPI = {
  getAll: () => api.get('/admin/enrollments'),
  create: (data) => api.post('/admin/enrollments', data),
  update: (id, data) => api.put(`/admin/enrollments/${id}`, data),
  delete: (id) => api.delete(`/admin/enrollments/${id}`),
};

// Authentication API
export const authAPI = {
  loginResident: (credentials) => api.post('/residents/login', credentials),
  
  loginAdmin: (credentials) => api.post('/admin/login', credentials),
  
  registerResident: (userData) => api.post('/residents/register', userData),
};

export default api;
