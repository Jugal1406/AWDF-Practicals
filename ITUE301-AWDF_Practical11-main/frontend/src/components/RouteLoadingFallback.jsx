import React from 'react';

/**
 * RouteLoadingFallback Component
 * Displayed via React <Suspense fallback={...}> while route chunks are being loaded.
 */
function RouteLoadingFallback({ message = 'Loading page module...' }) {
  return (
    <div className="route-fallback-container" role="status" aria-live="polite">
      <div className="route-fallback-card">
        <div className="fallback-spinner-wrapper">
          <div className="fallback-pulse-ring"></div>
          <div className="fallback-spinner-core"></div>
        </div>
        <h3 className="fallback-title">{message}</h3>
        <p className="fallback-subtitle">
          Dynamically loading route chunk via <code>React.lazy()</code> &amp; <code>Suspense</code>
        </p>
        <div className="fallback-skeleton-bars">
          <div className="skeleton-bar bar-long"></div>
          <div className="skeleton-bar bar-medium"></div>
          <div className="skeleton-bar bar-short"></div>
        </div>
        <span className="fallback-badge">Practical 8: Code Splitting</span>
      </div>
    </div>
  );
}

export default RouteLoadingFallback;
