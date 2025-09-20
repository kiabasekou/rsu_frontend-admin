import axios, { AxiosResponse } from 'axios';
import { PersonFormData, PersonIdentity, SearchFilters, APIResponse } from '../types/forms';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const identityAPI = {
  getPersons: async (filters?: SearchFilters): Promise<AxiosResponse<APIResponse<PersonIdentity>>> => {
    return apiClient.get('/identity/persons/');
  },

  createPerson: async (data: PersonFormData): Promise<AxiosResponse<PersonIdentity>> => {
    return apiClient.post('/identity/persons/', data);
  },

  updatePerson: async (id: string, data: PersonFormData): Promise<AxiosResponse<PersonIdentity>> => {
    return apiClient.put(`/identity/persons/${id}/`, data);
  },
};

export const programsAPI = {
  getPrograms: async () => {
    return apiClient.get('/programs/');
  },
};