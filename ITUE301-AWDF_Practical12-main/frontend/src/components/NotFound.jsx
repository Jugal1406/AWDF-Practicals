import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="section-card not-found-card">
      <div className="not-found-code">404</div>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-text">
        The route you are looking for does not exist in this Single Page Application.
      </p>
      <Link to="/" className="action-btn">
        ← Return to Home Page
      </Link>
    </div>
  );
}

export default NotFound;
