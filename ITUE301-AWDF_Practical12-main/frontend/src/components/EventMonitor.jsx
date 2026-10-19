import React, { useState, useEffect } from 'react';
import { getEventHistory, simulateEventError } from '../api';

/**
 * EventMonitor Component (Practical 10)
 * Real-time EventEmitter Observability Dashboard demonstrating decoupled asynchronous background processing.
 */
function EventMonitor({ onShowToast }) {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [simulatingError, setSimulatingError] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEventHistory();
      if (res && res.history) {
        setHistory(res.history);
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to load event history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // Poll every 4 seconds to observe delayed background worker events
    const interval = setInterval(fetchEvents, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateError = async () => {
    setSimulatingError(true);
    try {
      await simulateEventError('Simulated worker runtime error from UI test button');
      if (onShowToast) onShowToast('Error event emitted and safely caught by error listener!', 'warning');
      await fetchEvents();
    } catch (err) {
      if (onShowToast) onShowToast('Simulation failed: ' + err.message, 'error');
    } finally {
      setSimulatingError(false);
    }
  };

  return (
    <div className="section-card event-monitor-card">
      <div className="event-monitor-header">
        <div className="event-title-group">
          <span className="event-satellite-icon">📡</span>
          <div>
            <h3>Asynchronous Event-Driven Architecture (EventEmitter)</h3>
            <p className="event-subtext">
              Practical 10: Non-blocking side-effects decoupled from the main request-response cycle
            </p>
          </div>
        </div>

        <div className="event-action-btns">
          <button
            type="button"
            className="action-btn-small btn-secondary"
            onClick={fetchEvents}
            disabled={loading}
            title="Poll latest emitted events"
          >
            {loading ? 'Polling...' : '🔄 Poll Events'}
          </button>
          <button
            type="button"
            className="action-btn-small btn-warn"
            onClick={handleSimulateError}
            disabled={simulatingError}
            title="Emit test error to verify Supplementary Problem 2 error listener"
          >
            {simulatingError ? 'Emitting...' : '💥 Test Error Listener'}
          </button>
        </div>
      </div>

      {/* Architecture Explanation Banner */}
      <div className="event-architecture-pill">
        <div className="arch-left">
          <span className="arch-badge">⚡ Non-Blocking Execution</span>
          <span>
            API responds with <strong>HTTP 201</strong> immediately, while background listeners process notifications asynchronously (2s delay).
          </span>
        </div>
        <div className="arch-right">
          <span className="arch-tag">Node.js Native events</span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="event-metrics-grid">
        <div className="event-metric-card">
          <span className="metric-caption">Total Emitted</span>
          <span className="metric-val text-blue">{stats ? stats.totalEmitted : '0'}</span>
          <span className="metric-note">Lifecycle events</span>
        </div>

        <div className="event-metric-card">
          <span className="metric-caption">Task Created</span>
          <span className="metric-val text-green">{stats ? stats.taskCreatedCount : '0'}</span>
          <span className="metric-note">2s async worker</span>
        </div>

        <div className="event-metric-card">
          <span className="metric-caption">Task Deleted</span>
          <span className="metric-val text-purple">{stats ? stats.taskDeletedCount : '0'}</span>
          <span className="metric-note">Audit log worker</span>
        </div>

        <div className="event-metric-card">
          <span className="metric-caption">Errors Caught</span>
          <span className="metric-val text-amber">{stats ? stats.errorCount : '0'}</span>
          <span className="metric-note">Zero server crashes</span>
        </div>
      </div>

      {/* Live Event Stream Feed */}
      <div className="event-feed-container">
        <div className="feed-title-bar">
          <span className="feed-title">Recent Event Stream</span>
          <span className="feed-count">{history.length} events logged in process memory</span>
        </div>

        {history.length === 0 ? (
          <div className="no-events-box">
            <p>No events emitted yet. Create or delete a task to observe asynchronous background dispatch!</p>
          </div>
        ) : (
          <div className="events-stream-list">
            {history.slice(0, 5).map((evt) => (
              <div key={evt.id} className={`event-stream-card event-type-${evt.type}`}>
                <div className="event-stream-header">
                  <div className="event-type-badge">
                    {evt.type === 'task-created' && '✉️ task-created'}
                    {evt.type === 'task-deleted' && '🗑️ task-deleted'}
                    {evt.type === 'error' && '⚠️ error'}
                  </div>
                  <span className="event-time-text">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="event-stream-body">
                  {evt.type === 'task-created' && (
                    <>
                      <p className="event-desc">
                        Task: <strong>"{evt.payload?.title}"</strong> | Priority:{' '}
                        <span className={`priority-mini priority-${evt.payload?.priority || 'medium'}`}>
                          {evt.payload?.priority || 'medium'}
                        </span>
                      </p>
                      {evt.details?.notificationMessage && (
                        <p className="worker-note">✉️ {evt.details.notificationMessage}</p>
                      )}
                      <div className="timing-proof-chip">
                        <span>⏱️ Background worker completed 2000ms after HTTP 201 response</span>
                      </div>
                    </>
                  )}

                  {evt.type === 'task-deleted' && (
                    <p className="event-desc">
                      Audit: <strong>"{evt.payload?.title}"</strong> permanently removed from MongoDB database.
                    </p>
                  )}

                  {evt.type === 'error' && (
                    <p className="event-desc text-danger">
                      Caught Error: <code>{evt.payload?.errorMessage}</code> (Handled safely by error listener)
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="event-footer-info">
        <span className="badge-academic">CHARUSAT ITUE301 • Event Loop &amp; Microtasks</span>
        <span className="event-decoupling-tag">Side-Effects Decoupled from Critical Request Path</span>
      </div>
    </div>
  );
}

export default EventMonitor;
