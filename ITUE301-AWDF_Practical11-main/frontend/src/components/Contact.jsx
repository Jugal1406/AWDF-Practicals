import React, { useState } from 'react';

function Contact({ studentInfo }) {
  // useState #1: Controlled input for form fields
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
  });

  // Controlled input for message specifically as outlined in the lab steps
  const [message, setMessage] = useState('');

  // useState #2: Toggle visibility of a help tooltip / guidance card
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  // Form submission status
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ senderName: '', senderEmail: '', subject: '' });
    setMessage('');
    setSubmitted(false);
  };

  return (
    <div className="contact-page">
      <div className="section-card">
        <div className="contact-header-row">
          <div>
            <h2 className="section-heading">Contact & Collaboration</h2>
            <p className="section-subtext">
              Have an inquiry or project collaboration idea? Leave a message below.
            </p>
          </div>

          {/* Help Tooltip Visibility Toggle using useState */}
          <button
            type="button"
            className="help-toggle-btn"
            onClick={() => setShowHelpTooltip(!showHelpTooltip)}
            title="Toggle Contact Guidelines"
          >
            {showHelpTooltip ? '✕ Close Guide' : 'ℹ️ Help / Guidelines'}
          </button>
        </div>

        {/* Conditional rendering based on showHelpTooltip state */}
        {showHelpTooltip && (
          <div className="help-tooltip-box">
            <h4>💡 Quick Contact Guidelines</h4>
            <ul>
              <li>For academic queries, contact via student email: <code>{studentInfo.email}</code></li>
              <li>For code reviews or open-source issues, refer to GitHub: <code>{studentInfo.githubUrl}</code></li>
              <li>This form demonstrates controlled state binding and real-time live preview.</li>
            </ul>
          </div>
        )}

        {submitted ? (
          <div className="success-banner">
            <h3>Message Recorded!</h3>
            <p>Thank you, <strong>{formData.senderName || 'Visitor'}</strong>. Your message has been saved in state.</p>
            <div className="submitted-preview">
              <p><strong>Subject:</strong> {formData.subject || 'General Inquiry'}</p>
              <p><strong>Message:</strong> {message}</p>
            </div>
            <button type="button" className="action-btn" onClick={handleReset}>
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="senderName">Your Name:</label>
                <input
                  id="senderName"
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="senderEmail">Your Email:</label>
                <input
                  id="senderEmail"
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. user@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject / Inquiry:</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Topic or Project collaboration"
                className="form-input"
              />
            </div>

            {/* Controlled input tied directly to useState with live character count */}
            <div className="form-group">
              <label htmlFor="message">Message (Controlled State Input):</label>
              <textarea
                id="message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here to observe real-time state updates..."
                className="form-input"
                required
              />
              {/* Supplementary problem: live character count */}
              <div className="char-count-row">
                <span>Character Count: <strong>{message.length}</strong> characters</span>
                <span className={message.length > 200 ? 'char-warning' : 'char-ok'}>
                  {message.length} / 500 max
                </span>
              </div>
            </div>

            <button type="submit" className="action-btn">
              Submit Message
            </button>
          </form>
        )}
      </div>

      {/* Real-time Controlled Input Live Preview Card */}
      <div className="section-card preview-card">
        <h3 className="preview-heading">⚡ Real-Time Input State Preview</h3>
        <p className="preview-subtext">
          Demonstrates reactive state binding without page reload (controlled component):
        </p>
        <div className="live-preview-content">
          <p>
            <strong>Sender:</strong> {formData.senderName || <span className="placeholder-text">&lt;Not entered&gt;</span>}
          </p>
          <p>
            <strong>Email:</strong> {formData.senderEmail || <span className="placeholder-text">&lt;Not entered&gt;</span>}
          </p>
          <p>
            <strong>Subject:</strong> {formData.subject || <span className="placeholder-text">&lt;Not entered&gt;</span>}
          </p>
          <p>
            <strong>Live Message Stream:</strong>{' '}
            {message ? (
              <span className="live-message-text">"{message}"</span>
            ) : (
              <span className="placeholder-text">&lt;Awaiting input in message field...&gt;</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
