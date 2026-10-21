# Practical 12: CI/CD Pipeline with GitHub Actions
**Course**: Advanced Web Development Frameworks (ITUE301)  
**Student**: Jugal Kshatriya (ID: 24CS042)  
**Department**: Department of Computer Science & Engineering, CSPIT, CHARUSAT  
**Repository**: [Jugal1406/AWDF-Practicals](https://github.com/Jugal1406/AWDF-Practicals/tree/main/ITUE301-AWDF_Practical12-main)  
**Pipeline Status**: [![CI Pipeline](https://github.com/Jugal1406/AWDF-Practicals/actions/workflows/practical12-ci.yml/badge.svg)](https://github.com/Jugal1406/AWDF-Practicals/actions/workflows/practical12-ci.yml)

---

## 1. Practical Overview & Objectives
- **Course Outcome (CO)**: CO5 / PO3, PO5
- **Objective**: To automate testing and deployment of the application using a CI/CD pipeline powered by GitHub Actions.
- **Key Deliverables**:
  - Root-level workflow `.github/workflows/practical12-ci.yml`, scoped to this folder with `working-directory` and a `paths` filter.
  - Four chained jobs: `lint` → `test` → `build` → `deploy`.
  - Real static analysis with oxlint on backend and frontend (matrix job).
  - Automated Jest + Supertest suite with 5 integration tests.
  - Continuous Deployment: Docker images pushed to GitHub Container Registry on every green push to `main`.
  - A deliberately failing run (red X) and the fixed run (green checkmark).

---

## 2. CI/CD Architecture & Pipeline Flow

```
          push / pull_request to main  (paths: ITUE301-AWDF_Practical12-main/**)
                                   │
                                   ▼
        ┌──────────────────────────────────────────────────────┐
        │ Job 1: LINT   matrix [backend, frontend]  (parallel)  │
        │ checkout → setup-node 22 (npm cache) → npm ci → oxlint│
        └──────────────────────────┬───────────────────────────┘
                                   ▼ needs: lint
        ┌──────────────────────────────────────────────────────┐
        │ Job 2: TEST   backend: npm ci → jest --ci (5 tests)   │
        └──────────────────────────┬───────────────────────────┘
                                   ▼ needs: test
        ┌──────────────────────────────────────────────────────┐
        │ Job 3: BUILD  frontend: vite build → upload artifact  │
        └──────────────────────────┬───────────────────────────┘
                                   ▼ needs: build, if: push to main
        ┌──────────────────────────────────────────────────────┐
        │ Job 4: DEPLOY matrix [backend, frontend]              │
        │ docker login ghcr.io → buildx → push :latest + :sha   │
        └──────────────────────────────────────────────────────┘
```

A failure at any stage stops every later stage. For example, a failing test means nothing is built or deployed.

---

## 3. Workflow Implementation

See [`/.github/workflows/practical12-ci.yml`](../../.github/workflows/practical12-ci.yml) for the full file. Design choices:

| Decision | Why |
| :--- | :--- |
| Workflow at repo root, not inside this folder | GitHub ignores `.github/workflows` in subdirectories. |
| `paths:` filter | This repo holds 13 practicals, and only Practical 12 changes should trigger this pipeline. |
| `needs:` chain | Enforces lint → test → build → deploy ordering. |
| `if: github.event_name == 'push'` on deploy | Pull requests are verified but never deployed. |
| `permissions: packages: write` | Lets the built-in `GITHUB_TOKEN` push to GHCR, so no extra secrets are needed. |
| `concurrency` + `cancel-in-progress` | A newer push cancels a stale, still-running pipeline. |

---

## 4. Automated Test Suite Breakdown (`backend/server.test.js`)

| Test # | Test Name | Endpoint | Expected Result | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Root API Metadata | `GET /` | Status `200 OK`, JSON has student ID | Verifies core Express server routing & metadata |
| **2** | Container Health Check | `GET /health` | Status `200` or `503`, JSON has service status | Validates microservice health probe (Student Assignment) |
| **3** | Event History Stream | `GET /events/history` | Status `200 OK`, array of events | Confirms EventEmitter telemetry integration (Prac 10) |
| **4** | Auth Protection Guard | `GET /tasks` | Status `401 Unauthorized` | Ensures unprotected requests are rejected (Prac 7) |
| **5** | Global 404 Handler | `GET /invalid-route` | Status `404 Not Found` | Validates fallback error routing |

### Local Test Execution Output:
```text
PASS ./server.test.js
  Practical 12: CI/CD Automated Test Pipeline
    √ GET / returns 200 and confirms API metadata (743 ms)
    √ GET /health returns 200 or 503 with service health info (143 ms)
    √ GET /events/history returns 200 and event history array (146 ms)
    √ GET /tasks without auth token returns 401 Unauthorized (69 ms)
    √ GET /undefined-route returns 404 Route Not Found (64 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        9.854 s
```

---

## 5. Deliberate Pipeline Failure & Fix Demonstration

### A. Inducing a Deliberate Failure
To demonstrate pipeline failure detection, an intentional mismatch assertion is committed:
```javascript
// Deliberate breaking test:
test('GET / returns 200 and confirms API metadata', async () => {
  const res = await request(app).get('/');
  expect(res.statusCode).toBe(500); // Fails because API returns 200!
});
```
- **Observed Result on GitHub Actions**:
  - Job `Automated Tests (Jest)` exited with code `1`, and `build` and `deploy` were skipped.
  - GitHub displays a prominent **Red X** next to the commit.
  - Pull requests targeting `main` are blocked from merging.

### B. Correcting the Test
Reverting the expected status back to `200`:
```javascript
expect(res.statusCode).toBe(200);
```
- **Observed Result on GitHub Actions**:
  - All 5 tests pass.
  - All four jobs succeed, and new images are pushed to GHCR.
  - GitHub displays a **Green Checkmark** and updates the status badge to `passing`.

---

## 6. Answers to Key Analysis Questions (Viva Preparation)

### Q1: What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical actually demonstrate?
> - **Continuous Integration (CI)**: The automated practice of frequently merging code changes into a shared repository, where every push triggers automated build, linting, and testing pipelines to detect regressions immediately.
> - **Continuous Deployment (CD)**: The automated practice of automatically packaging and releasing verified code directly to production environments (e.g. AWS, Render, Docker Hub) without human intervention.
> - **Demonstrated in this Practical**: Both. **CI** covers the lint and test jobs on every push and PR. **Continuous Delivery/Deployment** covers the deploy job, which publishes versioned Docker images to GHCR automatically after a green push to `main`. Pushing a deployable artifact to a registry is CD up to the registry. Fully automatic release to a live server would need one more step (e.g. a Render or Railway deploy hook pulling `:latest`).

### Q2: Why does running tests automatically on every push catch problems earlier than testing manually before a release?
> 1. **Immediate Feedback Loop**: Developers are notified within 60 seconds of pushing broken code while context is fresh in their minds, rather than discovering bugs weeks later during release QA.
> 2. **Isolates Culprit Commits**: Because tests run on every discrete commit, the exact commit and code line that introduced the bug is pinpointed immediately via git bisect / GitHub Actions run logs.
> 3. **Eliminates Human Error**: Automated CI pipelines run identically on neutral, clean cloud runners (`ubuntu-latest`), eliminating "it works on my machine" discrepancies.

### Q3: What would happen to the pipeline if the test file path were incorrect — would the workflow fail at the same step as a genuine test failure?
> - **No, it would fail differently**: If the test file path were wrong (e.g., `jest nonexistent.test.js`), Jest exits with code 1 at the runner initialization step with an error like `No tests found matching "nonexistent.test.js"`.
> - A genuine test failure occurs after Jest discovers the file, boots the application, executes the HTTP request, and encounters an assertion error (e.g., `Expected 200, Received 500`).
> - While both result in a non-zero exit code (failing the CI job), the logs clearly distinguish between a **test harness configuration failure** and a **regression defect in application code**.
