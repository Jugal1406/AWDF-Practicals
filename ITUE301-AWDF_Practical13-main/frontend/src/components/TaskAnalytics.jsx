import React, { useMemo } from 'react';

/**
 * TaskAnalytics Component
 * Heavy visual analytics module lazy-loaded on demand to demonstrate component-level code splitting.
 */
function TaskAnalytics({ tasks = [], onClose }) {
  // Compute analytics using useMemo for performance optimization
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const highPriority = tasks.filter((t) => t.priority === 'high').length;
    const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
    const lowPriority = tasks.filter((t) => t.priority === 'low').length;

    return {
      total,
      completed,
      pending,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
    };
  }, [tasks]);

  return (
    <div className="task-analytics-card">
      <div className="analytics-header">
        <div className="analytics-header-title">
          <span className="analytics-icon">📊</span>
          <div>
            <h3>Task Management Performance &amp; Analytics</h3>
            <p className="analytics-subtext">
              Heavy component loaded on-demand via <code>React.lazy()</code> (Chunk Splitting Demo)
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            title="Collapse Analytics"
          >
            ✕ Close
          </button>
        )}
      </div>

      <div className="analytics-grid">
        {/* Metric 1: Completion Radial */}
        <div className="analytics-metric-box">
          <span className="metric-label">Completion Rate</span>
          <div className="radial-progress-wrapper">
            <svg className="radial-svg" viewBox="0 0 36 36">
              <path
                className="radial-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="radial-fill"
                strokeDasharray={`${stats.completionRate}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="radial-text">
                {stats.completionRate}%
              </text>
            </svg>
          </div>
          <span className="metric-caption">
            {stats.completed} of {stats.total} tasks completed
          </span>
        </div>

        {/* Metric 2: Status Breakdown */}
        <div className="analytics-metric-box">
          <span className="metric-label">Status Distribution</span>
          <div className="bar-stat-group">
            <div className="bar-stat-item">
              <div className="bar-stat-info">
                <span>Completed</span>
                <strong>{stats.completed}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar progress-completed"
                  style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            <div className="bar-stat-item">
              <div className="bar-stat-info">
                <span>Pending</span>
                <strong>{stats.pending}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-bar progress-pending"
                  style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Priority Breakdown */}
        <div className="analytics-metric-box">
          <span className="metric-label">Priority Distribution</span>
          <div className="priority-tags-group">
            <div className="priority-stat-chip priority-stat-high">
              <span className="chip-label">High</span>
              <span className="chip-count">{stats.highPriority}</span>
            </div>
            <div className="priority-stat-chip priority-stat-medium">
              <span className="chip-label">Medium</span>
              <span className="chip-count">{stats.mediumPriority}</span>
            </div>
            <div className="priority-stat-chip priority-stat-low">
              <span className="chip-label">Low</span>
              <span className="chip-count">{stats.lowPriority}</span>
            </div>
          </div>
          <div className="priority-ratio-bar">
            {stats.total > 0 ? (
              <>
                <div
                  className="ratio-segment ratio-high"
                  style={{ width: `${(stats.highPriority / stats.total) * 100}%` }}
                  title={`High: ${stats.highPriority}`}
                ></div>
                <div
                  className="ratio-segment ratio-medium"
                  style={{ width: `${(stats.mediumPriority / stats.total) * 100}%` }}
                  title={`Medium: ${stats.mediumPriority}`}
                ></div>
                <div
                  className="ratio-segment ratio-low"
                  style={{ width: `${(stats.lowPriority / stats.total) * 100}%` }}
                  title={`Low: ${stats.lowPriority}`}
                ></div>
              </>
            ) : (
              <div className="ratio-segment ratio-empty" style={{ width: '100%' }}></div>
            )}
          </div>
        </div>
      </div>

      <div className="analytics-footer">
        <span className="badge-academic">CHARUSAT ITUE301 • Supplementary Optimization Feature</span>
        <span className="analytics-lazy-tag">⚡ Loaded via On-Demand Dynamic Import</span>
      </div>
    </div>
  );
}

export default TaskAnalytics;
