# ITUE301 - Advanced Web Development Frameworks
## Practical 4: Building a RESTful API with Node.js and Express

### Student Details
- **Student ID:** 24CS042
- **Student Name:** Jugal Kshatriya
- **Subject Code & Name:** CSE304 / ITUE301: Advanced Web Development Frameworks
- **Department:** Department of Computer Science and Engineering
- **Institution:** Chandubhai S Patel Institute of Technology (CSPIT), CHARUSAT
- **Academic Year:** 2025-26

---

### Aim
To design and implement a RESTful backend server with complete CRUD endpoints using an Express middleware pipeline, incorporating request logging, input validation, and centralized error handling.

---

### Request Pipeline & Architecture
```text
Client (Postman / Browser / Thunder Client / Frontend)
 │
 ▼
[CORS & express.json() Middleware]
 │
 ▼
[Global Request Logger: Method + URL + ISO Timestamp]
 │
 ▼
[Content-Type Header Validator for POST/PUT (415 check)]
 │
 ▼
Express Router
 ├── GET    /tasks           → getAllTasks (200 OK)
 ├── GET    /tasks/:id       → [validateTaskId] → getTaskById (200 / 404)
 ├── POST   /tasks           → createTask (201 Created / 400 Bad Request)
 ├── PUT    /tasks/:id       → [validateTaskId] → updateTask (200 / 404)
 ├── DELETE /tasks/:id       → [validateTaskId] → deleteTask (200 / 404)
 └── GET    /error-test      → Triggers deliberate exception to test error middleware
 │
 ▼
[404 Undefined Route Handler (JSON)]
 │
 ▼
[Centralized Global Error Handler: (err, req, res, next) → 500 / custom status]
```

---

### Endpoints Specification

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | API Health & documentation overview | `200 OK` |
| **GET** | `/tasks` | Retrieve all tasks (supports `?status=...`) | `200 OK` |
| **GET** | `/tasks/:id` | Retrieve single task by validated numeric ID | `200 OK` / `404 Not Found` |
| **POST** | `/tasks` | Create a new task (requires JSON body) | `201 Created` / `400 Bad Request` |
| **PUT** | `/tasks/:id` | Update an existing task by ID | `200 OK` / `404 Not Found` |
| **DELETE**| `/tasks/:id` | Delete a task by ID | `200 OK` / `404 Not Found` |
| **GET** | `/error-test`| Deliberately test global error handling | `500 Internal Server Error` |

---

### Supplementary Problems Implemented
1. **Content-Type Enforcer Middleware (`requireJsonContent`)**:
   Rejects `POST` and `PUT` requests that omit or misconfigure `Content-Type: application/json` with HTTP `415 Unsupported Media Type`.
2. **Route-Specific ID Validator (`validateTaskId`)**:
   Ensures `:id` parameters are positive integers before reaching the controller. If invalid (e.g., `/tasks/abc`), returns `400 Bad Request`.
3. **Structured 404 JSON Handler**:
   Catches all unmapped routes and returns `{ "success": false, "error": "Route not found", "path": "..." }`.

---

### Running the Server

#### Prerequisites
- Node.js (v18+)
- npm (v9+)

#### Installation & Startup
```bash
# 1. Install dependencies
npm install

# 2. Start server
npm start
# Server listens on port 5000: http://localhost:5000
```

---

### Testing Endpoints with cURL / PowerShell

```powershell
# 1. GET all tasks
curl http://localhost:5000/tasks

# 2. GET task by ID
curl http://localhost:5000/tasks/1

# 3. POST create task
curl -X POST http://localhost:5000/tasks -H "Content-Type: application/json" -d "{\"title\": \"Build MongoDB Schema\", \"status\": \"pending\"}"

# 4. PUT update task
curl -X PUT http://localhost:5000/tasks/1 -H "Content-Type: application/json" -d "{\"status\": \"completed\"}"

# 5. DELETE task
curl -X DELETE http://localhost:5000/tasks/5

# 6. Test 404 handler
curl http://localhost:5000/invalid-route

# 7. Test Global Error Handler
curl http://localhost:5000/error-test
```
