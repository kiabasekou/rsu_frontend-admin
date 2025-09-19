import axios from 'axios';
import { PersonIdentity, SocialProgram, APIResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors pour gestion erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const identityAPI = {
  getPersons: () => api.get<APIResponse<PersonIdentity>>('/identity/persons/'),
  getPerson: (id: string) => api.get<PersonIdentity>(`/identity/persons/${id}/`),
  createPerson: (data: Partial<PersonIdentity>) => api.post<PersonIdentity>('/identity/persons/', data),
  updatePerson: (id: string, data: Partial<PersonIdentity>) => api.put<PersonIdentity>(`/identity/persons/${id}/`, data),
  deletePerson: (id: string) => api.delete(`/identity/persons/${id}/`),
};

export const programsAPI = {
  getPrograms: () => api.get<APIResponse<SocialProgram>>('/programs/programs/'),
  getProgram: (id: string) => api.get<SocialProgram>(`/programs/programs/${id}/`),
  createProgram: (data: Partial<SocialProgram>) => api.post<SocialProgram>('/programs/programs/', data),
  updateProgram: (id: string, data: Partial<SocialProgram>) => api.put<SocialProgram>(`/programs/programs/${id}/`, data),
  deleteProgram: (id: string) => api.delete(`/programs/programs/${id}/`),
};

export default api;

