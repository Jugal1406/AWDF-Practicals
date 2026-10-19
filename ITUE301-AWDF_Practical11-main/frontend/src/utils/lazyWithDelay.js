import { lazy } from 'react';

/**
 * Helper to lazy load a component with a minimum artificial delay.
 * Useful for avoiding flickering loading spinners on ultra-fast network connections (e.g. localhost),
 * and for demonstrating Suspense fallback behavior during lab evaluation.
 *
 * @param {() => Promise<{ default: React.ComponentType<any> }>} factory - Dynamic import function
 * @param {number} minDelay - Minimum delay in milliseconds (default: 300ms as per lab manual)
 * @returns {React.LazyExoticComponent<React.ComponentType<any>>}
 */
export function lazyWithMinDelay(factory, minDelay = 300) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, minDelay)),
    ]).then(([moduleExports]) => moduleExports)
  );
}

export default lazyWithMinDelay;
