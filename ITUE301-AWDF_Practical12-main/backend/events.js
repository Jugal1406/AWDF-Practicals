const EventEmitter = require('events');

/**
 * TaskEvents EventEmitter Module (Practical 10)
 * Uses Node.js native EventEmitter for decoupled asynchronous background processing.
 */
class TaskEvents extends EventEmitter {
  constructor() {
    super();
    // In-memory event audit log for observability and frontend dashboard
    this.eventHistory = [];
    this.stats = {
      totalEmitted: 0,
      taskCreatedCount: 0,
      taskDeletedCount: 0,
      errorCount: 0,
    };
  }

  logEvent(type, payload, details) {
    const entry = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      type,
      timestamp: new Date().toISOString(),
      payload,
      details,
    };
    this.eventHistory.unshift(entry);
    if (this.eventHistory.length > 50) {
      this.eventHistory.pop();
    }
    return entry;
  }

  getHistory() {
    return this.eventHistory;
  }

  getStats() {
    return {
      ...this.stats,
      bufferedEventsCount: this.eventHistory.length,
    };
  }
}

module.exports = new TaskEvents();
