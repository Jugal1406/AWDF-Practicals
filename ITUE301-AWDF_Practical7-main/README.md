# ITUE301 - Advanced Web Development Frameworks
## Practical 7: Authentication and Middleware Pipeline

### Student Details
- **Student ID:** 24CS042
- **Student Name:** Jugal Kshatriya
- **Subject Code & Name:** CSE304 / ITUE301: Advanced Web Development Frameworks
- **Department:** Department of Computer Science and Engineering
- **Institution:** Chandubhai S Patel Institute of Technology (CSPIT), CHARUSAT
- **Academic Year:** 2025-26

---

### Aim
To implement a secure, stateless JWT-based authentication flow and input validation middleware pipeline in Express, protect MongoDB task routes, hash user passwords using `bcryptjs`, and handle token persistence and 401 expiry on the React frontend.

---

### Authentication Pipeline & Request Lifecycle
```text
Unauthenticated Requests:
 ├── POST /register   → Input Validation → Bcrypt Password Hash (10 rounds) → Save User → Sign JWT (1h) → 201 Created
 └── POST /login      → Input Validation → Find User → Bcrypt Compare Password → Sign JWT (1h) → 200 OK

Protected Request Flow:
 Client (React SPA / Postman)
  │  Sends header: "Authorization: Bearer <token>"
  ▼
 [Auth Middleware (middleware/auth.js)]
  ├── Checks presence & 'Bearer ' prefix (401 if missing)
  ├── jwt.verify(token, process.env.JWT_SECRET) wrapped in try/catch (401 if tampered/expired)
  └── Injects authenticated User into req.user
  ▼
 [Input Validation Middleware (middleware/validate.js)]
  └── Checks required fields (title, priority enum) before reaching controller (400 if malformed)
  ▼
 Task Route Controller (CRUD operations bound to req.user._id in MongoDB)
```

---

### Key Security & Architectural Concepts

1. **Password Hashing with Bcrypt**:
   - Passwords are never saved as plain text. `bcryptjs` automatically generates cryptographically strong salts and utilizes a slow hashing algorithm to resist brute-force and dictionary attacks.
2. **Stateless JWT Tokens**:
   - Token payload contains `{ id: user._id, email: user.email }` signed with `JWT_SECRET` loaded strictly from `.env`.
   - Token expires in 1 hour (`1h`).
3. **Protected Routes & 401 Handling**:
   - If a request is made to `/tasks` without a token or with an expired token, the server rejects it with `401 Unauthorized`.
   - The frontend intercepts 401 responses, removes the stale token from `localStorage`, and prompts the user to log in again.
4. **Decoded Token Inspector (`GET /me`)**:
   - Protected endpoint returning the authenticated user's profile derived directly from the decoded JWT payload.

---

### Endpoints Specification

| Method | Endpoint | Protection | Description | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | Register new user; hashes password & signs JWT | `201 Created` / `400 Bad Request` |
| **POST** | `/login` | Public | Authenticate user; returns JWT token + user details | `200 OK` / `401 Unauthorized` |
| **GET** | `/me` | **Bearer JWT** | Returns logged-in user profile from decoded JWT | `200 OK` / `401 Unauthorized` |
| **GET** | `/tasks` | **Bearer JWT** | Fetch authenticated user's tasks from MongoDB | `200 OK` / `401 Unauthorized` |
| **POST** | `/tasks` | **Bearer JWT** | Create task linked to authenticated user | `201 Created` / `400 Bad Request` |
| **PUT** | `/tasks/:id` | **Bearer JWT** | Update authenticated user's task | `200 OK` / `404 Not Found` |
| **DELETE**| `/tasks/:id` | **Bearer JWT** | Delete authenticated user's task | `200 OK` / `404 Not Found` |

---

### How to Run Locally

#### Prerequisites
- Node.js (v18+)
- MongoDB Community Server running locally on port 27017

#### 1. Start the Backend Server (Terminal 1)
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:5000
```

#### 2. Start the React Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
# React SPA runs on http://localhost:5173
```

---

### Suggested Screenshots for Your Practical 7 Report 📸

1. **7.1 Authentication Gateway (401 Protected View)**:
   - Open `http://localhost:5173/tasks` while logged out (or after clicking **Sign Out**).
   - Capture the **"JWT Authentication Required"** lock gateway with login/register form.
2. **7.2 User Login & Token Generation**:
   - Click **"⚡ Fill Demo Account"** (`24cs042@charusat.edu.in` / `password123`) and click **"Sign In with JWT"**.
   - Capture the green success Toast notification: `Login successful! Authorized to access MongoDB.`.
3. **7.3 Authenticated User Session & /me Profile Inspection**:
   - Capture the active user profile card showing `👤 Jugal Kshatriya (24cs042@charusat.edu.in)` and the `🛡️ JWT Active (1h Expiry)` badge.
   - Click **"🔍 Inspect /me"** to capture the decoded JWT profile modal showing MongoDB User ID and email.
4. **7.4 Protected Task Creation & MongoDB Association**:
   - Add a new task (e.g. `Implement Role-Based Access Control`).
   - Capture the task saved under the authenticated user in MongoDB.
5. **7.5 Postman / Terminal Verification (401 vs 200)**:
   - Call `GET http://localhost:5000/tasks` without headers -> shows `401 Unauthorized: Missing or malformed Authorization header`.
   - Call with `Authorization: Bearer <token>` -> shows `200 OK`.
