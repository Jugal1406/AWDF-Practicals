// ==============================================================================
// ITUE301: Advanced Web Development Frameworks - Practical 13
// Student: Jugal Kshatriya (ID: 24CS042)
// Automated API tests: core API (P12) + AI integration (P13)
// ==============================================================================

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./server');
const { resetRateLimits, sanitiseForAI } = require('./aiService');

// Tests must never call the real Gemini API: force the graceful-fallback path.
delete process.env.GEMINI_API_KEY;
beforeEach(() => resetRateLimits());

describe('Practical 12: CI/CD Automated Test Pipeline', () => {

  // Test 1: Root route status & metadata (Fixed pipeline - returns 200)
  test('GET / returns 200 and confirms API metadata', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200); // Fixed assertion: expects 200 and receives 200
    expect(res.body).toHaveProperty('student');
    expect(res.body.student).toContain('24CS042');
  });

  // Test 2 (Student Assignment): Health Check endpoint returns valid status
  test('GET /health returns 200 or 503 with service health info', async () => {
    const res = await request(app).get('/health');
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('service', 'task_manager_backend');
  });

  // Test 3: Event-Driven telemetry endpoint (Practical 10 integration)
  test('GET /events/history returns 200 and event history array', async () => {
    const res = await request(app).get('/events/history');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.history)).toBe(true);
  });

  // Test 4: Protected endpoint security validation
  test('GET /tasks without auth token returns 401 Unauthorized', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('success', false);
  });

  // Test 5: 404 handler for undefined route
  test('GET /undefined-route returns 404 Route Not Found', async () => {
    const res = await request(app).get('/some-nonexistent-route-for-ci');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Route not found');
  });

  // ==============================================================================
  // PRACTICAL 13: AI API Integration & Graceful Degradation Tests
  // ==============================================================================

  // Test 6: AI Description Generation with Graceful Degradation Fallback
  test('POST /api/ai/generate-description returns 200 with editable description & disclaimer', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Configure JWT Authentication Pipeline' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('description');
    expect(typeof res.body.description).toBe('string');
    expect(res.body.description.length).toBeGreaterThan(10);
    expect(res.body).toHaveProperty('disclaimer');
    expect(res.body).toHaveProperty('fallback');
  }, 15000);

  // Test 7: Validation error when title is missing
  test('POST /api/ai/generate-description returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Task title is required');
  });

  // Test 8: Graceful fallback guarantees no crash on invalid API key
  test('POST /api/ai/generate-description gracefully falls back without throwing 500', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Build Docker Container with Multi-Stage Build' });

    expect(res.statusCode).toBe(200);
    expect(res.body.fallback).toBeDefined();
    expect(res.body.suggestedPriority).toMatch(/^(low|medium|high)$/);
  }, 15000);

  // Test 9 (Supplementary Problem 2): same task twice within a minute -> 429
  test('POST /api/ai/generate-description allows 1 request per task per minute', async () => {
    const first = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Setup GitHub Actions CI' });
    expect(first.statusCode).toBe(200);

    // Same task (different case/spacing is still the same task) -> blocked
    const second = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: '  setup   github actions CI ' });
    expect(second.statusCode).toBe(429);
    expect(second.body).toHaveProperty('rateLimited', true);
    expect(second.body.waitSeconds).toBeGreaterThan(0);
    expect(second.body.waitSeconds).toBeLessThanOrEqual(60);

    // A different task is not blocked
    const other = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Write README for deployment' });
    expect(other.statusCode).toBe(200);
  });

  // Test 10: a spoofed x-client-id header must NOT bypass the limiter
  test('rate limit cannot be bypassed by changing x-client-id header', async () => {
    await request(app).post('/api/ai/generate-description')
      .set('x-client-id', 'attacker-1').send({ title: 'Spam task' });
    const res = await request(app).post('/api/ai/generate-description')
      .set('x-client-id', 'attacker-2').send({ title: 'Spam task' });
    expect(res.statusCode).toBe(429);
  });

  // Test 11: logged-in users are limited per user, not per shared IP
  test('different authenticated users are rate-limited independently', async () => {
    const secret = process.env.JWT_SECRET || 'supersecretjwtkey_24cs042_jugal_practical10';
    const tokenA = jwt.sign({ id: 'userA' }, secret);
    const tokenB = jwt.sign({ id: 'userB' }, secret);
    const a = await request(app).post('/api/ai/generate-description')
      .set('Authorization', `Bearer ${tokenA}`).send({ title: 'Shared task name' });
    const b = await request(app).post('/api/ai/generate-description')
      .set('Authorization', `Bearer ${tokenB}`).send({ title: 'Shared task name' });
    expect(a.statusCode).toBe(200);
    expect(b.statusCode).toBe(200);
  });

  // Test 12: overly long titles are rejected before reaching the AI provider
  test('POST /api/ai/generate-description returns 400 for titles over 200 chars', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'x'.repeat(201) });
    expect(res.statusCode).toBe(400);
  });

  // Test 13 (Key Question 3): personal data is redacted before it is sent to AI
  test('sanitiseForAI redacts emails and phone numbers', () => {
    const out = sanitiseForAI('Call 9876543210 or mail jugal@charusat.edu.in about "login"');
    expect(out).not.toContain('9876543210');
    expect(out).not.toContain('jugal@charusat.edu.in');
    expect(out).toContain('[number]');
    expect(out).toContain('[email]');
    expect(out).not.toContain('"');
  });
});
