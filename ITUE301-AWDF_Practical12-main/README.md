# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://github.com/Jugal1406/ITUE301-AWDF_Practical12/actions/workflows/ci.yml/badge.svg)](https://github.com/Jugal1406/ITUE301-AWDF_Practical12/actions/workflows/ci.yml)

**Course**: Advanced Web Development Frameworks (ITUE301)  
**Department**: Department of Computer Science and Engineering  
**Institute**: Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Academic Year**: 2025–2026  
**Student Name**: Jugal Kshatriya  
**Student ID**: 24CS042  
**GitHub Repository**: [Jugal1406/ITUE301-AWDF_Practical12](https://github.com/Jugal1406/ITUE301-AWDF_Practical12)

---

## 🎯 Practical Objective
To automate testing and code-quality verification of the full-stack Task Management application using a Continuous Integration (CI) pipeline with **GitHub Actions**. The pipeline automatically executes static linting and automated Jest/Supertest integration suites on every push and pull request to the `main` branch.

---

## 🏗️ GitHub Actions Pipeline Architecture

```
git push origin main / pull_request
 │
 ▼
GitHub Actions Trigger (.github/workflows/ci.yml)
 │
 ├── Job 1: Code Quality & Lint Audit (ubuntu-latest)
 │    ├── Checkout code (actions/checkout@v4)
 │    ├── Setup Node.js 20 with npm caching
 │    ├── npm ci
 │    └── npm run lint
 │
 └── Job 2: Build & Automated Tests (needs: lint)
      ├── Checkout code (actions/checkout@v4)
      ├── Setup Node.js 20 with npm caching
      ├── npm ci
      └── npm test (Jest & Supertest test suite)
           ├── GET / (API Metadata & Student ID)
           ├── GET /health (Microservice Health Status)
           ├── GET /events/history (Event-Driven Telemetry)
           ├── GET /tasks (401 Unauthorized Security Guard)
           └── GET /undefined (404 Error Handler)
 │
 ▼
Pipeline Result: Green Checkmark (Pass) or Red X (Fail)
```

---

## 🧪 Automated Test Suite (`backend/server.test.js`)

Run tests locally:
```bash
# In backend directory:
npm test

# From root directory:
npm run test:backend
```

### Verified Test Cases:
1. `GET / returns 200 and confirms API metadata` (Verifies student ID `24CS042`).
2. `GET /health returns 200 or 503 with service health info` (Microservice observability).
3. `GET /events/history returns 200 and event history array` (EventEmitter integration).
4. `GET /tasks without auth token returns 401 Unauthorized` (Security guard).
5. `GET /undefined-route returns 404 Route Not Found` (Global error handling).

---

## 💡 Supplementary Problems Implemented

1. **Pre-test Linter Job (`lint`)**:
   - Added a separate `lint` job running static code analysis before tests.
   - The test job specifies `needs: lint` so tests execute only if lint checks pass.

2. **Trigger Configuration for Pull Requests**:
   - Workflow runs on both `push: branches: [main]` and `pull_request: branches: [main]` to guard merge requests.

3. **Status Badge in README**:
   - Configured live workflow badge at the top of this README showing real-time build status.

---

## 📝 Lab Demonstration Workflow

1. **Step 1 - Workflow Setup**: Push `.github/workflows/ci.yml` and test suite to GitHub.
2. **Step 2 - Deliberate Failure Demonstration**: Change expected status code in test to `500` and push. Observe the **Red X** and failed run in GitHub Actions.
3. **Step 3 - Corrected Pipeline Demonstration**: Restore expected status code to `200` and push. Observe the pipeline turning green with a **Green Checkmark**.
