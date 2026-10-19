// Central API Service with JWT Authentication & 401 Expiry Handling
const BASE_URL = 'http://localhost:5000';

// Token Management via localStorage
export const getStoredToken = () => localStorage.getItem('auth_token');
export const setStoredToken = (token) => localStorage.setItem('auth_token', token);
export const removeStoredToken = () => localStorage.removeItem('auth_token');

// Helper to construct authorized headers
const getAuthHeaders = () => {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Handle response with 401 auto-logout/redirect check
const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    // Supplementary Problem: Token expiry & 401 handling
    removeStoredToken();
    window.dispatchEvent(new CustomEvent('auth:expired', { detail: data.error }));
    throw new Error(data.error || 'Session expired. Please log in again.');
  }

  if (!res.ok) {
    const errorMsg = data.validationErrors
      ? Object.values(data.validationErrors).join(', ')
      : data.error || `HTTP ${res.status}: Operation failed`;
    throw new Error(errorMsg);
  }

  return data;
};

// ==========================================
// Auth API Endpoints
// ==========================================

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await handleResponse(res);
  if (data.token) setStoredToken(data.token);
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  if (data.token) setStoredToken(data.token);
  return data;
};

// Supplementary Problem 1: GET /me
export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ==========================================
// Protected Task API Endpoints
// ==========================================

export const getTasks = async (query = '') => {
  const url = query ? `${BASE_URL}/tasks?${query}` : `${BASE_URL}/tasks`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const createTask = async (taskData) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  return handleResponse(res);
};

export const updateTask = async (id, updateData) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return handleResponse(res);
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};
