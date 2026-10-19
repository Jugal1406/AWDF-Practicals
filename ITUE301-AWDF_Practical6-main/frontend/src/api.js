// Central API Service connecting React frontend to Express + MongoDB backend
const BASE_URL = 'http://localhost:5000';

// 1. Fetch all tasks (Read)
export const getTasks = async (query = '') => {
  const url = query ? `${BASE_URL}/tasks?${query}` : `${BASE_URL}/tasks`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch tasks`);
  }
  return res.json();
};

// 2. Fetch single task by ID
export const getTaskById = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch task ${id}`);
  }
  return res.json();
};

// 3. Create new task (POST)
export const createTask = async (taskData) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) {
    const errMsg = data.validationErrors
      ? Object.values(data.validationErrors).join(', ')
      : data.error || 'Failed to create task';
    throw new Error(errMsg);
  }
  return data;
};

// 4. Update task (PUT)
export const updateTask = async (id, updateData) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok) {
    const errMsg = data.validationErrors
      ? Object.values(data.validationErrors).join(', ')
      : data.error || 'Failed to update task';
    throw new Error(errMsg);
  }
  return data;
};

// 5. Delete task (DELETE)
export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete task');
  }
  return data;
};
