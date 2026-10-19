import React, { useState } from 'react';

export default function Contact() {
  // State 1: Managing the controlled input for message
  const [message, setMessage] = useState('');

  // State 2: Managing the toggle visibility of the help section/tooltip
  const [showHelp, setShowHelp] = useState(false);

  // Optional clear handler to demonstrate state reset
  const handleClear = () => {
    setMessage('');
  };

  return (
    <div className="page contact-page">
      <div className="page-header">
        <h1 className="page-title">Get in Touch</h1>
        <p className="page-subtitle">
          Demonstrating React <code>useState</code> with controlled inputs, live character counting,
          and conditional UI rendering.
        </p>
      </div>

      <div className="contact-container">
        {/* Help Toggle Button and Collapsible Help Section */}
        <div className="help-toggle-wrapper">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowHelp(!showHelp)}
            aria-expanded={showHelp}
          >
            {showHelp ? '✕ Hide Form Guidance' : 'ℹ Show Form Guidance'}
          </button>

          {showHelp && (
            <div className="help-box" role="region" aria-label="Form Guidance">
              <h3>📋 Form Guidance &amp; Instructions</h3>
              <ul>
                <li>Type your message in the textarea below to see two-way data binding in action.</li>
                <li>The input is completely controlled via <code>useState</code>.</li>
                <li>The live character counter and preview reflect your keystrokes immediately.</li>
                <li>This practical showcases client-side state management without external APIs.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Contact Form Card */}
        <div className="contact-card card">
          <h2 className="card-heading">Send a Message</h2>

          <div className="form-group">
            <label htmlFor="message-input" className="form-label">
              Your Message:
            </label>
            <textarea
              id="message-input"
              rows={5}
              className="form-textarea"
              placeholder="Type your message here to observe real-time state updates..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <div className="counter-row">
              <span className="character-counter">
                Characters: <strong>{message.length}</strong>
              </span>
              {message.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn-clear"
                  title="Clear input"
                >
                  Clear text
                </button>
              )}
            </div>
          </div>

          {/* Real-time Display Section */}
          <div className="live-preview-section">
            <h3 className="preview-heading">Live Message Display:</h3>
            <div className="preview-content">
              {message.trim() ? (
                <p className="preview-text">{message}</p>
              ) : (
                <p className="preview-placeholder">
                  (Nothing typed yet. Start typing above to see your message displayed here in real time.)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Practical Concept Info Card */}
        <div className="state-info-card card">
          <h3>State Management Summary (Practical 2)</h3>
          <table className="state-table">
            <thead>
              <tr>
                <th>State Variable</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Current Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>message</code></td>
                <td>String</td>
                <td>Stores controlled textarea content</td>
                <td><code>"{message.slice(0, 20)}{message.length > 20 ? '...' : ''}"</code></td>
              </tr>
              <tr>
                <td><code>showHelp</code></td>
                <td>Boolean</td>
                <td>Controls visibility of the help guidance box</td>
                <td><code>{showHelp ? 'true' : 'false'}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}