# Practical 12: CI/CD Pipeline with GitHub Actions

[![CI Pipeline](https://github.com/Jugal1406/AWDF-Practicals/actions/workflows/practical12-ci.yml/badge.svg)](https://github.com/Jugal1406/AWDF-Practicals/actions/workflows/practical12-ci.yml)

**Course**: Advanced Web Development Frameworks (ITUE301)  
**Department**: Department of Computer Science and Engineering  
**Institute**: Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Academic Year**: 2025–2026  
**Student Name**: Jugal Kshatriya  
**Student ID**: 24CS042  
**GitHub Repository**: [Jugal1406/AWDF-Practicals](https://github.com/Jugal1406/AWDF-Practicals/tree/main/ITUE301-AWDF_Practical12-main)

---

## 🎯 Practical Objective
To automate testing and deployment of the full-stack Task Management application using a CI/CD pipeline built with **GitHub Actions**. Every push and pull request to `main` that touches this practical runs static analysis and the automated test suite. A green push to `main` then builds the frontend and publishes Docker images to GitHub Container Registry.

> **Workflow location:** GitHub only reads workflows from the repository root, so the pipeline lives at
> [`/.github/workflows/practical12-ci.yml`](../.github/workflows/practical12-ci.yml) and targets this folder with `working-directory` plus a `paths` filter.

---

## 🏗️ GitHub Actions Pipeline Architecture

```
git push origin main / pull_request  (only when ITUE301-AWDF_Practical12-main/** changes)
 │
 ▼
Job 1: Lint  ── matrix: [backend, frontend] run in parallel ── npm ci → oxlint
 │  needs: lint
 ▼
Job 2: Automated Tests ── backend: npm ci → jest --ci (5 Supertest API tests)
 │  needs: test
 ▼
Job 3: Build Frontend ── vite build → upload "frontend-dist" artifact
 │  needs: build   (if: push to main — skipped on pull requests)
 ▼
Job 4: Deploy ── matrix: [backend, frontend]
         docker buildx → push ghcr.io/jugal1406/awdf-p12-<service>:{latest, <sha>}
```

Pull a deployed image:
```bash
docker pull ghcr.io/jugal1406/awdf-p12-backend:latest
docker pull ghcr.io/jugal1406/awdf-p12-frontend:latest
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

1. **Pre-test linter job:** a separate `lint` job runs real static analysis (**oxlint**) on both backend and frontend. The test job declares `needs: lint`, so tests run only after lint passes.
2. **Pull-request trigger:** the workflow runs on `push` and `pull_request` to `main`, with a `paths` filter so other practicals in this repo don't trigger it.
3. **Status badge:** a live workflow badge at the top of this README.
4. **Continuous Deployment:** after lint, test and build all pass on `main`, Docker images are published to GHCR. Pull requests never deploy.
5. **Extras:** npm dependency caching, `concurrency` to cancel superseded runs, a manual `workflow_dispatch` trigger, and the frontend build kept as an artifact.

---

## 📝 Lab Demonstration Workflow

1. **Workflow setup:** push the workflow and test suite. The run appears under **Actions → Practical 12 CI/CD** (all green).
2. **Deliberate failure:** in `backend/server.test.js`, change `expect(res.statusCode).toBe(200)` to `toBe(500)` and push. The **Automated Tests** job fails with a **red X**, and Build and Deploy are skipped.
3. **Fix:** change it back to `200` and push. The pipeline turns green and the images are redeployed.
