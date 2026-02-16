export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  UPLOAD_ZIP: '/api/upload',
  UPLOAD_GITHUB: '/api/upload/github',
  ASK_QUESTION: '/api/qa/ask',
  GET_HISTORY: '/api/qa/history',
  HEALTH_CHECK: '/api/health',
};

export const FILE_UPLOAD = {
  MAX_SIZE: 7 * 1024 * 1024, // 7MB
  ALLOWED_TYPES: ['application/zip', 'application/x-zip-compressed'],
};

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 7MB limit',
  INVALID_FILE_TYPE: 'Only .zip files are allowed',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  GITHUB_INVALID: 'Invalid GitHub URL format',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export const EXAMPLE_QUESTIONS = [
  'Where is authentication handled?',
  'How do I add a new API endpoint?',
  'Explain the database schema',
  'Where are environment variables used?',
  'Show me error handling code',
  'How does the routing work?',
];

export const HISTORY_LIMIT = 10;