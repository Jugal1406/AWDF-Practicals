import React, { useState, useEffect } from 'react';
import { getCacheStats, flushCache } from '../api';

/**
 * CacheMonitor Component (Practical 9)
 * Real-time In-Memory Cache Observability Dashboard (node-cache).
 */
function CacheMonitor({ lastCacheInfo, onRefreshTasks, onShowToast }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flushing, setFlushing] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getCacheStats();
      if (res && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to fetch cache stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [lastCacheInfo]);

  const handleFlush = async () => {
    setFlushing(true);
    try {
      await flushCache();
      if (onShowToast) onShowToast('In-memory cache flushed successfully! Next query will MISS.', 'info');
      await fetchStats();
    } catch (err) {
      if (onShowToast) onShowToast('Failed to flush cache: ' + err.message, 'error');
    } finally {
      setFlushing(false);
    }
  };

  return (
    <div className="section-card cache-monitor-card">
      <div className="cache-monitor-header">
        <div className="cache-title-group">
          <span className="cache-bolt-icon">⚡</span>
          <div>
            <h3>In-Memory Cache Observability (node-cache)</h3>
            <p className="cache-subtext">
              Practical 9: Server-side caching for <code>GET /tasks</code> with 60s TTL &amp; write invalidation
            </p>
          </div>
        </div>

        <div className="cache-action-btns">
          <button
            type="button"
            className="action-btn-small btn-secondary"
            onClick={fetchStats}
            disabled={loading}
            title="Fetch latest node-cache stats"
          >
            {loading ? 'Refreshing...' : '🔄 Poll Stats'}
          </button>
          <button
            type="button"
            className="action-btn-small btn-flush"
            onClick={handleFlush}
            disabled={flushing}
            title="Flush in-memory cache to force next request to query MongoDB"
          >
            {flushing ? 'Flushing...' : '🧹 Flush Cache'}
          </button>
          {onRefreshTasks && (
            <button
              type="button"
              className="action-btn-small btn-accent"
              onClick={onRefreshTasks}
              title="Execute GET /tasks to observe HIT vs MISS"
            >
              🚀 Fetch Tasks
            </button>
          )}
        </div>
      </div>

      {/* Real-time Last Request Banner */}
      {lastCacheInfo && (
        <div className={`last-request-pill ${lastCacheInfo.cacheStatus === 'HIT' ? 'status-hit' : 'status-miss'}`}>
          <div className="pill-left">
            <span className="pill-badge">
              {lastCacheInfo.cacheStatus === 'HIT' ? '⚡ CACHE HIT' : '💾 CACHE MISS'}
            </span>
            <span className="pill-timing">
              Response Time: <strong>{lastCacheInfo.responseTimeMs ?? '0.05'} ms</strong>
            </span>
          </div>
          <div className="pill-right">
            <span>
              {lastCacheInfo.cacheStatus === 'HIT'
                ? 'Served from RAM in < 1ms'
                : 'Fetched directly from MongoDB & cached'}
            </span>
            <span className="pill-ttl">TTL: 60s</span>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="cache-metrics-grid">
        <div className="cache-metric-card">
          <span className="metric-caption">Cache Hits</span>
          <span className="metric-val text-green">{stats ? stats.hits : '0'}</span>
          <span className="metric-note">Served from memory</span>
        </div>

        <div className="cache-metric-card">
          <span className="metric-caption">Cache Misses</span>
          <span className="metric-val text-amber">{stats ? stats.misses : '0'}</span>
          <span className="metric-note">Queried MongoDB</span>
        </div>

        <div className="cache-metric-card">
          <span className="metric-caption">Hit Ratio</span>
          <span className="metric-val text-blue">{stats ? stats.hitRatio : '0%'}</span>
          <span className="metric-note">Efficiency index</span>
        </div>

        <div className="cache-metric-card">
          <span className="metric-caption">Active Keys</span>
          <span className="metric-val text-purple">{stats ? stats.activeKeysCount : '0'}</span>
          <span className="metric-note">Stored in process RAM</span>
        </div>
      </div>

      <div className="cache-footer-info">
        <span className="badge-academic">CHARUSAT ITUE301 • Performance Engineering</span>
        <span className="invalidation-tag">
          Auto-Invalidation on <code>POST</code> / <code>PUT</code> / <code>DELETE</code>
        </span>
      </div>
    </div>
  );
}

export default CacheMonitor;
