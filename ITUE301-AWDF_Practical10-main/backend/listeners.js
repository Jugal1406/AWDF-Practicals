const taskEvents = require('./events');

/**
 * Event Listeners Registration Module (Practical 10)
 * Handles background side-effects asynchronously without blocking the main HTTP request-response cycle.
 */

// 1. Task Created Listener (Background Notification with simulated 2s delay)
taskEvents.on('task-created', (task) => {
  taskEvents.stats.totalEmitted += 1;
  taskEvents.stats.taskCreatedCount += 1;

  const emitTimestamp = new Date().toISOString();
  console.log(`[Event Dispatched] 'task-created' event received by listener at: ${emitTimestamp}`);

  // Artificial 2-second delay to simulate slow I/O (e.g., email notification, push alert)
  // Confirms the API client received HTTP 201 response 2000ms before this worker finishes!
  setTimeout(() => {
    try {
      // Simulate edge case error if title contains 'ERROR_TRIGGER'
      if (task.title && task.title.includes('ERROR_TRIGGER')) {
        throw new Error(`Simulated worker failure for task: "${task.title}"`);
      }

      const completionTimestamp = new Date().toISOString();
      const notificationMessage = `Notification email dispatched for task: "${task.title}" (Priority: ${task.priority || 'medium'}, User: ${task.user || 'authenticated'})`;

      console.log(`=================================================================`);
      console.log(`[Notification Worker] ✉️  ${notificationMessage}`);
      console.log(`[Notification Worker] ⏱️  Background job completed at: ${completionTimestamp}`);
      console.log(`[Non-Blocking Proof]  API response was sent ~2000ms PRIOR to this log!`);
      console.log(`=================================================================`);

      taskEvents.logEvent('task-created', {
        taskId: task._id,
        title: task.title,
        priority: task.priority,
        user: task.user,
      }, {
        status: 'SUCCESS',
        notificationMessage,
        emitTimestamp,
        completionTimestamp,
        delayMs: 2000,
      });
    } catch (err) {
      // Forward error to the dedicated error listener (Supplementary Problem 2)
      taskEvents.emit('error', err);
    }
  }, 2000);
});

// 2. Task Deleted Listener (Supplementary Problem 1: Distinct message for task deletion)
taskEvents.on('task-deleted', (task) => {
  taskEvents.stats.totalEmitted += 1;
  taskEvents.stats.taskDeletedCount += 1;

  const timestamp = new Date().toISOString();
  const auditMessage = `Task "${task.title}" (ID: ${task._id}) permanently removed from database`;

  console.log(`=================================================================`);
  console.log(`[Audit Log Worker] 🗑️  ${auditMessage} at ${timestamp}`);
  console.log(`=================================================================`);

  taskEvents.logEvent('task-deleted', {
    taskId: task._id,
    title: task.title,
  }, {
    status: 'DELETED',
    auditMessage,
    timestamp,
  });
});

// 3. Error Event Listener (Supplementary Problem 2: Catches and logs errors without crashing server)
taskEvents.on('error', (err) => {
  taskEvents.stats.errorCount += 1;
  const timestamp = new Date().toISOString();

  console.error(`=================================================================`);
  console.error(`[Event Error Handler] ⚠️  Caught background event error at ${timestamp}:`);
  console.error(`[Event Error Handler] Message: ${err.message}`);
  console.error(`[Event Error Handler] Server process protected from crash by error listener.`);
  console.error(`=================================================================`);

  taskEvents.logEvent('error', {
    errorMessage: err.message,
    stack: err.stack ? err.stack.split('\n').slice(0, 3).join(' | ') : null,
  }, {
    status: 'CAUGHT_ERROR',
    timestamp,
  });
});

console.log('[TaskEvents] All listeners registered: (task-created, task-deleted, error)');

module.exports = taskEvents;
