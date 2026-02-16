import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data?.error || ERROR_MESSAGES.SERVER_ERROR);
    } else if (error.request) {
      // Request made but no response
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      // Something else happened
      throw new Error(error.message || 'An error occurred');
    }
  }
);

// API methods
export const uploadZipFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  console.log('[UPLOAD] Starting ZIP upload', {
    name: file.name,
    sizeBytes: file.size,
    type: file.type,
  });

  const response = await api.post(API_ENDPOINTS.UPLOAD_ZIP, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return;
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`[UPLOAD] Transfer progress: ${percent}% (${progressEvent.loaded}/${progressEvent.total} bytes)`);
    },
  });

  console.log('[UPLOAD] Upload finished and backend processing complete', response.data);
  return response.data;
};

export const uploadGithubRepo = async (repoUrl) => {
  const response = await api.post(API_ENDPOINTS.UPLOAD_GITHUB, { repoUrl });
  return response.data;
};

export const askQuestion = async (codebaseId, question) => {
  const response = await api.post(API_ENDPOINTS.ASK_QUESTION, {
    codebaseId,
    question,
  });
  return response.data;
};

export const getQuestionHistory = async (codebaseId) => {
  const response = await api.get(`${API_ENDPOINTS.GET_HISTORY}/${codebaseId}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await api.get(API_ENDPOINTS.HEALTH_CHECK);
  return response.data;
};

export default api;
