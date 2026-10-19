const NodeCache = require('node-cache');

/**
 * Shared In-Memory Cache Module (Practical 9)
 * Uses node-cache with default TTL of 60 seconds.
 */
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '60', 10);

const cacheInstance = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: 120, // Check for expired keys every 120s
  useClones: false, // Performance boost by avoiding deep cloning when not mutating
});

// Cache Metrics Tracking for Supplementary Problem 2
const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
  invalidations: 0,
  lastInvalidation: null,
};

// Helper methods wrapper
const cache = {
  // Core node-cache methods
  get: (key) => {
    const val = cacheInstance.get(key);
    if (val !== undefined) {
      stats.hits += 1;
      return val;
    }
    stats.misses += 1;
    return undefined;
  },

  set: (key, val, ttl = DEFAULT_TTL) => {
    stats.sets += 1;
    return cacheInstance.set(key, val, ttl);
  },

  del: (keyOrKeys) => {
    stats.invalidations += 1;
    stats.lastInvalidation = new Date().toISOString();
    return cacheInstance.del(keyOrKeys);
  },

  flush: () => {
    stats.invalidations += 1;
    stats.lastInvalidation = new Date().toISOString();
    return cacheInstance.flushAll();
  },

  keys: () => cacheInstance.keys(),

  getStats: () => {
    const totalRequests = stats.hits + stats.misses;
    const hitRatio = totalRequests > 0 ? ((stats.hits / totalRequests) * 100).toFixed(1) + '%' : '0%';
    const nodeCacheStats = cacheInstance.getStats();

    return {
      hits: stats.hits,
      misses: stats.misses,
      totalRequests,
      hitRatio,
      sets: stats.sets,
      invalidations: stats.invalidations,
      lastInvalidation: stats.lastInvalidation,
      activeKeysCount: cacheInstance.keys().length,
      activeKeys: cacheInstance.keys(),
      stdTTL: DEFAULT_TTL,
      internalNodeCache: nodeCacheStats,
    };
  },

  resetStats: () => {
    stats.hits = 0;
    stats.misses = 0;
    stats.sets = 0;
    stats.invalidations = 0;
    stats.lastInvalidation = null;
    cacheInstance.flushAll();
  },
};

module.exports = cache;
