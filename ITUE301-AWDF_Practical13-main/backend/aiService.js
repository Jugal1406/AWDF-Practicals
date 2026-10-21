// ==============================================================================
// ITUE301: Advanced Web Development Frameworks - Practical 13
// Student: Jugal Kshatriya (ID: 24CS042)
// AI API Service (Google Gemini Integration & Graceful Degradation)
// ==============================================================================

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ------------------------------------------------------------------------------
// Supplementary Problem 2: max 1 AI request per task per minute.
// The key is (client + normalised task title), so the same user can still ask
// for a suggestion on a *different* task straight away, but cannot spam the
// same task. `clientId` comes from the verified JWT user or the request IP in
// server.js - never from a header the browser controls.
// ------------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_TITLE_LENGTH = 200;
const rateLimitStore = new Map();

const normaliseTitle = (title) => title.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Checks and records rate limiting for one task title from one client.
 * @param {string} clientId
 * @param {string} title
 * @returns {{ allowed: boolean, waitSeconds?: number }}
 */
function checkRateLimit(clientId, title) {
  const now = Date.now();

  // Drop expired entries so the Map cannot grow forever
  for (const [key, ts] of rateLimitStore) {
    if (now - ts >= RATE_LIMIT_WINDOW_MS) rateLimitStore.delete(key);
  }

  const key = `${clientId}::${normaliseTitle(title)}`;
  const lastRequest = rateLimitStore.get(key);

  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return {
      allowed: false,
      waitSeconds: Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequest)) / 1000),
    };
  }

  rateLimitStore.set(key, now);
  return { allowed: true };
}

/** Test helper: clears the limiter between test cases. */
function resetRateLimits() {
  rateLimitStore.clear();
}

/**
 * Governance (Key Question 3): strip personal data before a title leaves our
 * server for a third-party AI provider, and neutralise characters that could
 * break out of the quoted prompt.
 * @param {string} title
 * @returns {string}
 */
function sanitiseForAI(title) {
  return title
    .trim()
    .slice(0, MAX_TITLE_LENGTH)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email]')
    .replace(/(\+?\d[\d\s-]{8,}\d)/g, '[number]')
    .replace(/["`\\]/g, "'")
    .replace(/\s+/g, ' ');
}

/**
 * Generates an intelligent, contextual task description & priority using Gemini API
 * Implements Graceful Degradation on error/timeout/missing key.
 *
 * @param {string} title
 * @param {string} clientId
 * @returns {Promise<Object>}
 */
async function generateTaskDescription(title, clientId = 'default') {
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new Error('Task title is required to generate AI description');
  }

  // 1. Enforce Rate Limiting
  const rateLimit = checkRateLimit(clientId, title);
  if (!rateLimit.allowed) {
    return {
      success: false,
      rateLimited: true,
      waitSeconds: rateLimit.waitSeconds,
      error: `This task already got an AI suggestion in the last minute. Try again in ${rateLimit.waitSeconds}s.`,
      disclaimer: 'AI Rate Limiter active to prevent excessive third-party API usage.',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // 2. If Gemini API key is missing or placeholder, trigger Graceful Degradation
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
    console.warn('[AI Service] GEMINI_API_KEY is not configured. Returning graceful fallback description.');
    return generateFallbackDescription(title, 'Missing GEMINI_API_KEY in backend/.env');
  }

  // 3. Call Google Gemini API
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash (primary active production model) with gemini-flash-latest fallback
    const candidateModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
    let result = null;
    let selectedModel = candidateModels[0];
    let lastError = null;

    const prompt = `You are an expert full-stack developer and agile project management assistant.
Analyze this task title: "${sanitiseForAI(title)}".
Provide an actionable, structured task summary in valid JSON format:
{
  "description": "2-3 concise sentences detailing technical scope, deliverables, and actionable acceptance criteria.",
  "suggestedPriority": "high" | "medium" | "low",
  "estimatedTime": "e.g. 2 hours, 1 day, or 3 days"
}
Return ONLY raw parseable JSON. Do not include markdown code block ticks (\`\`\`).`;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json', temperature: 0.4 },
        });
        let timer;
        try {
          result = await Promise.race([
            model.generateContent(prompt),
            new Promise((_, reject) => {
              timer = setTimeout(() => reject(new Error('AI API request timed out after 15 seconds')), 15000);
            }),
          ]);
        } finally {
          clearTimeout(timer); // otherwise every request leaves a 15s timer running
        }
        selectedModel = modelName;
        break;
      } catch (mErr) {
        lastError = mErr;
        console.warn(`[AI Service] Model ${modelName} failed (${mErr.message}). Trying fallback model...`);
      }
    }

    if (!result) {
      throw lastError || new Error('No candidate Gemini model succeeded');
    }

    const rawText = result.response.text().trim();
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed;

    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {
        description: rawText,
        suggestedPriority: 'medium',
        estimatedTime: '2-4 hours',
      };
    }

    return {
      success: true,
      title: title.trim(),
      description: parsed.description || rawText,
      suggestedPriority: ['low', 'medium', 'high'].includes(parsed.suggestedPriority?.toLowerCase())
        ? parsed.suggestedPriority.toLowerCase()
        : 'medium',
      estimatedTime: parsed.estimatedTime || '2 hours',
      provider: `Google Gemini AI (${selectedModel})`,
      model: selectedModel,
      isAIGenerated: true,
      fallback: false,
      timestamp: new Date().toISOString(),
      disclaimer: 'AI-generated suggestion. Please review and edit before saving.',
    };
  } catch (err) {
    console.error(`[AI Service] Gemini API call failed (${err.message}). Activating Graceful Degradation.`);
    return generateFallbackDescription(title, err.message);
  }
}

/**
 * Intelligent Local Fallback Generator (Graceful Degradation)
 * Ensures the user and application can ALWAYS create tasks even if Gemini is down/offline.
 */
function generateFallbackDescription(title, reason = '') {
  const lower = title.toLowerCase();
  let priority = 'medium';
  let category = 'development task';
  let steps = 'Plan architecture, write core implementation, run tests, and document progress.';

  if (lower.includes('bug') || lower.includes('fix') || lower.includes('error') || lower.includes('crash')) {
    priority = 'high';
    category = 'bug fix & remediation';
    steps = 'Reproduce issue in isolated test, inspect server stack trace, patch root cause, and verify regression.';
  } else if (lower.includes('deploy') || lower.includes('docker') || lower.includes('ci/cd') || lower.includes('release')) {
    priority = 'high';
    category = 'DevOps & deployment';
    steps = 'Validate container configs, test automated CI pipelines, verify environment secrets, and deploy.';
  } else if (lower.includes('docs') || lower.includes('readme') || lower.includes('comment')) {
    priority = 'low';
    category = 'documentation';
    steps = 'Review API endpoints, update markdown guides, and add clear code comments.';
  } else if (lower.includes('test') || lower.includes('jest') || lower.includes('qa')) {
    priority = 'medium';
    category = 'quality assurance';
    steps = 'Write integration tests using Supertest, assert edge cases, and ensure high branch coverage.';
  }

  const fallbackDescription = `[Template Suggestion for "${title}"] Perform ${category}: ${steps} Ensure full compliance with academic project criteria.`;

  return {
    success: true,
    title: title.trim(),
    description: fallbackDescription,
    suggestedPriority: priority,
    estimatedTime: '1-2 days',
    provider: 'Local Heuristic Engine (Graceful Degradation)',
    model: 'fallback-v1',
    isAIGenerated: false,
    fallback: true,
    reason: reason,
    timestamp: new Date().toISOString(),
    disclaimer: 'Offline template suggestion. The AI service is currently degraded, but task creation remains fully operational.',
  };
}

module.exports = {
  generateTaskDescription,
  generateFallbackDescription,
  checkRateLimit,
  resetRateLimits,
  sanitiseForAI,
  MAX_TITLE_LENGTH,
  RATE_LIMIT_WINDOW_MS,
};
