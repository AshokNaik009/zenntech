import axios from 'axios';
import { PropertyData, Project, ApiResponse, PropertyFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_KEY = process.env.REACT_APP_API_KEY || 'your-secret-api-key-here';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await api.get('/api/projects');
    return response.data;
  },

  async createProperty(propertyData: PropertyData): Promise<ApiResponse<any>> {
    // Transform the data to match API expectations
    const formattedData: PropertyFormData = {
      title: (propertyData.title || '').trim(),
      size: parseFloat(propertyData.size || '0'),
      price: parseFloat(propertyData.price || '0'),
      handoverDate: propertyData.handoverDate?.format('YYYY-MM-DD') || '',
      projectId: propertyData.projectId || '',
    };

    const response = await api.post('/api/properties', formattedData);
    return response.data;
  },

  async getProperties(): Promise<ApiResponse<any[]>> {
    const response = await api.get('/api/properties');
    return response.data;
  },

  async healthCheck(): Promise<ApiResponse<any>> {
    const response = await api.get('/api/health');
    return response.data;
  },
};