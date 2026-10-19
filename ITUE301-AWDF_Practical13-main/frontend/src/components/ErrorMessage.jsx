import React from 'react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Failed to Load Repositories</h3>
      <p className="error-desc">{message || 'An unexpected network error occurred while reaching the GitHub API.'}</p>
      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          ↻ Retry API Request
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
