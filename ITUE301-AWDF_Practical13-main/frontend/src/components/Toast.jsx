import React, { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast-notification toast-${type}`}>
      <span className="toast-icon">
        {type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <span className="toast-text">{message}</span>
      <button type="button" className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}

export default Toast;
