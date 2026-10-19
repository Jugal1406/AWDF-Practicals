// Input validation middleware checking required fields before controllers

const validateTask = (req, res, next) => {
  const { title, priority } = req.body;
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Title is required and must not be empty';
  } else if (title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (priority && !['low', 'medium', 'high'].includes(priority.toLowerCase())) {
    errors.priority = 'Priority must be either low, medium, or high';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Input Validation Failed',
      validationErrors: errors,
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Name is required (minimum 2 characters)';
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'A valid email address is required';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password is required and must be at least 6 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Registration Validation Failed',
      validationErrors: errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  }
  if (!password || !password.trim()) {
    errors.password = 'Password is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Login Validation Failed',
      validationErrors: errors,
    });
  }

  next();
};

module.exports = {
  validateTask,
  validateRegister,
  validateLogin,
};
