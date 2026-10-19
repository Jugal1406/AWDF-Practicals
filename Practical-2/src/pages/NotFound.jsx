import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page not-found-page card">
      <div className="not-found-content">
        <span className="error-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          Oops! The page you are looking for does not exist or may have been moved.
          This 404 response is handled client-side via React Router's catch-all route (<code>path="*"</code>).
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            ← Return to Home Page
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            View Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
