const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 1. Core Global Middleware Pipeline
// ==========================================

// Enable CORS for frontend integration
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Request logging middleware (logs method, url, and timestamp)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// 2. Custom Validation Middleware
// ==========================================

// Supplementary Problem 1: Reject POST/PUT requests without Content-Type: application/json
const requireJsonContent = (req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'Unsupported Media Type: Content-Type must be application/json',
      });
    }
  }
  next();
};

// Apply JSON content-type check to POST and PUT requests
app.use(requireJsonContent);

// Supplementary Problem 2: Route-specific middleware to validate numeric task ID
const validateTaskId = (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  if (isNaN(taskId) || taskId <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Task ID: ID must be a positive integer',
      received: req.params.id,
    });
  }
  req.validatedTaskId = taskId;
  next();
};

// ==========================================
// 3. In-Memory Data Store (Connected Coursework Tasks)
// ==========================================
let tasks = [
  {
    id: 1,
    title: 'Set up Vite React Portfolio & Component Tree',
    description: 'Deconstruct static UI into modular Header, About, Skills, and Footer components with props.',
    status: 'completed',
    category: 'Practical 1',
    priority: 'High',
    createdAt: '2026-10-16T11:00:00.000Z',
  },
  {
    id: 2,
    title: 'Implement React Router v6 & Reactive State',
    description: 'Add SPA multi-page routing without reloads, controlled contact form, and light/dark theme toggle.',
    status: 'completed',
    category: 'Practical 2',
    priority: 'High',
    createdAt: '2026-10-17T03:30:00.000Z',
  },
  {
    id: 3,
    title: 'Integrate GitHub REST API with Asynchronous States',
    description: 'Consume public GitHub endpoints on component mount via useEffect with loading and error boundaries.',
    status: 'completed',
    category: 'Practical 3',
    priority: 'High',
    createdAt: '2026-10-17T03:45:00.000Z',
  },
  {
    id: 4,
    title: 'Build Express RESTful Backend CRUD API',
    description: 'Design robust Express middleware pipeline with request logging, validation, and error handling.',
    status: 'in-progress',
    category: 'Practical 4',
    priority: 'High',
    createdAt: '2026-10-17T04:00:00.000Z',
  },
  {
    id: 5,
    title: 'Connect Frontend Portfolio with Backend Express API',
    description: 'Wire React state to consume local Node.js endpoints for unified full-stack architecture.',
    status: 'pending',
    category: 'Practical 5',
    priority: 'Medium',
    createdAt: '2026-10-17T04:15:00.000Z',
  },
];

let nextId = 6;

// ==========================================
// 4. RESTful API Endpoints (CRUD)
// ==========================================

// Welcome / Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Task Management REST API - ITUE301 Practical 4',
    student: 'Jugal Kshatriya (24CS042)',
    endpoints: {
      getAllTasks: 'GET /tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      errorTest: 'GET /error-test',
    },
  });
});

// GET /tasks - Read all tasks (with optional filter by status)
app.get('/tasks', (req, res) => {
  const { status, search } = req.query;
  let result = [...tasks];

  if (status) {
    result = result.filter((t) => t.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    result = result.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /tasks/:id - Read single task by ID (uses validateTaskId middleware)
app.get('/tasks/:id', validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.validatedTaskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${req.validatedTaskId} not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, status, priority, category } = req.body;

  // Validation: title is required
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Task title is required and must be a non-empty string',
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    status: status || 'pending',
    priority: priority || 'Medium',
    category: category || 'General',
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask,
  });
});

// PUT /tasks/:id - Update an existing task (uses validateTaskId middleware)
app.put('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.validatedTaskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${req.validatedTaskId} not found`,
    });
  }

  const { title, description, status, priority, category } = req.body;

  // Validate at least one field provided
  if (!title && !description && !status && !priority && !category) {
    return res.status(400).json({
      success: false,
      error: 'At least one field (title, description, status, priority, category) must be provided for update',
    });
  }

  // Update existing task
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...(title && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(status && { status }),
    ...(priority && { priority }),
    ...(category && { category }),
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: `Task ${req.validatedTaskId} updated successfully`,
    data: tasks[taskIndex],
  });
});

// DELETE /tasks/:id - Delete a task (uses validateTaskId middleware)
app.delete('/tasks/:id', validateTaskId, (req, res) => {
  const taskIndex = tasks.findIndex((t) => t.id === req.validatedTaskId);

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Task with ID ${req.validatedTaskId} not found`,
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: `Task ${req.validatedTaskId} deleted successfully`,
    data: deletedTask,
  });
});

// Deliberate error test endpoint for demonstrating the global error handler
app.get('/error-test', (req, res, next) => {
  const testError = new Error('Simulated internal server exception for testing global error handling middleware');
  testError.status = 500;
  next(testError);
});

// ==========================================
// 5. Supplementary Problem 3: 404 Undefined Route Handler
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
  });
});

// ==========================================
// 6. Centralized Global Error Handling Middleware
// ==========================================
// Must be defined last in the pipeline with exactly 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(`[Global Error Handler] Error: ${err.message}`);
  console.error(err.stack);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    statusCode,
  });
});

// ==========================================
// 7. Server Listener
// ==========================================
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/tasks`);
  console.log(`Student: Jugal Kshatriya (24CS042)`);
  console.log(`=========================================`);
});
