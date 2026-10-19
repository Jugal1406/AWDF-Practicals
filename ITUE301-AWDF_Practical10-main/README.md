# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Course**: Advanced Web Development Frameworks (ITUE301)  
**Department**: Computer Science and Engineering  
**Institute**: Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Academic Year**: 2025–2026  
**Student Name**: Jugal Kshatriya  
**Student ID**: 24CS042  
**GitHub Repository**: [Jugal1406/ITUE301-AWDF_Practical10](https://github.com/Jugal1406/ITUE301-AWDF_Practical10)

---

## 🎯 Practical Objective
To implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies, decouple non-critical side effects from the HTTP request-response cycle, demonstrate non-blocking execution with concrete timestamp proof, and ensure resilient error handling.

---

## 🏗️ Architecture & Event-Driven Pipeline

```
Client (Postman / Browser)
 │
 ▼ HTTP POST /tasks
Express Controller Route
 │
 ├── 1. Save task to MongoDB
 ├── 2. Invalidate In-Memory Cache
 ├── 3. Send HTTP 201 Created Response IMMEDIATELY (Elapsed: ~15ms)
 │       └── Client request finishes and unblocks!
 │
 └── 4. taskEvents.emit('task-created', taskData)
         │
         ▼ (Handled asynchronously by Event Loop)
      Notification Listener (listeners.js)
         ├── Simulated Heavy Workload (2000ms setTimeout)
         └── Completes at T0 + 2000ms:
             Logs notification email dispatch and user details
```

---

## ⏱️ Asynchronous Non-Blocking Timing Proof

The console logs below provide concrete empirical evidence that the HTTP response is returned **before** the notification listener completes:

```text
=================================================================
[API Response] Task created & HTTP 201 sent to client at: 2026-10-17T11:45:00.120Z
[Event Dispatched] 'task-created' event received by listener at: 2026-10-17T11:45:00.122Z
... [Client already received HTTP 201 and UI unblocked in 18ms] ...
=================================================================
[Notification Worker] ✉️  Notification email dispatched for task: "Practical 10 Async Event Demo"
[Notification Worker] ⏱️  Background job completed at: 2026-10-17T11:45:02.125Z
[Non-Blocking Proof]  API response was sent ~2000ms PRIOR to this log!
=================================================================
```

### Timing Breakdown:
| Execution Step | Timestamp | Relative Elapsed Time | Blocking Status |
| :--- | :--- | :--- | :--- |
| **API Response Sent** | `11:45:00.120Z` | **T + 18 ms** | **Non-blocking (Client unblocked)** |
| **Event Emitted** | `11:45:00.122Z` | **T + 20 ms** | Dispatched to event queue |
| **Background Worker Finished** | `11:45:02.125Z` | **T + 2023 ms** | Executed in background |

---

## 💡 Key Implementation Details

### 1. Dedicated EventEmitter Module (`backend/events.js`)
```javascript
const EventEmitter = require('events');
class TaskEvents extends EventEmitter {
  constructor() {
    super();
    this.eventHistory = [];
    this.stats = { totalEmitted: 0, taskCreatedCount: 0, taskDeletedCount: 0, errorCount: 0 };
  }
}
module.exports = new TaskEvents();
```

### 2. Modular Event Listeners (`backend/listeners.js`)
```javascript
const taskEvents = require('./events');

// Listener 1: task-created (Simulates slow email notification)
taskEvents.on('task-created', (task) => {
  setTimeout(() => {
    console.log(`[Notification Worker] ✉️ Email dispatched for task: "${task.title}"`);
  }, 2000);
});

// Listener 2 (Supplementary 1): task-deleted (Audit logging)
taskEvents.on('task-deleted', (task) => {
  console.log(`[Audit Log Worker] 🗑️ Task "${task.title}" deleted from database`);
});

// Listener 3 (Supplementary 2): error (Resilient error handling)
taskEvents.on('error', (err) => {
  console.error(`[Event Error Handler] ⚠️ Caught background event error: ${err.message}`);
});
```

### 3. Immediate Response in Controller (`backend/server.js`)
```javascript
app.post('/tasks', auth, validateTask, async (req, res, next) => {
  const newTask = await Task.create({ ...req.body, user: req.user._id });

  // 1. Respond immediately
  res.status(201).json({ success: true, data: newTask, apiResponseTimestamp: new Date().toISOString() });

  // 2. Emit event asynchronously AFTER response
  taskEvents.emit('task-created', newTask);
});
```

### 4. Supplementary Solutions Implemented
* **Supplementary 1 (`task-deleted` Event)**: Dispatched in `DELETE /tasks/:id` and audited by a dedicated background listener.
* **Supplementary 2 (`error` Event Listener)**: Catches background exceptions and prevents unhandled error crashes.
* **Supplementary 3 (Simulated Heavy I/O)**: 2000ms delay demonstrates non-blocking behavior.
* **Frontend Event Stream Monitor (`src/components/EventMonitor.jsx`)**: Real-time browser feed showing event logs, timing proof chips, and error test triggers.

---

## ❓ Key Questions & Analysis (Lab Viva Preparation)

### Q1: Why does emitting an event not block the API response, even though both run on the same Node.js process?
* Node.js operates on an **event loop** using a single-threaded execution model.
* When `taskEvents.emit()` triggers a listener that initiates asynchronous I/O or schedules a callback via `setTimeout()` / `setImmediate()`, the callback is handed off to the Node.js runtime/libuv timer phase.
* The synchronous execution of the route handler concludes, the HTTP socket writes the response to the client immediately, and the listener callback executes during a later turn of the event loop.

### Q2: What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
* If the notification (e.g. sending an email or connecting to an external push service with a 2-second delay) were executed synchronously using `await` inside the route, the HTTP client would be forced to wait **2000+ milliseconds** before receiving the HTTP 201 response.
* This severely degrades perceived user experience, increases server connection concurrency, and causes request timeouts under heavy traffic.

### Q3: Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
* **Why it works here**: Built into Node.js core, zero third-party dependencies, extremely low overhead, and ideal for single-process architectures.
* **Why it fails at scale**:
  1. **Memory & Process Bound**: If the Node.js process crashes or restarts, all pending in-memory events are permanently lost (no persistence).
  2. **No Horizontal Distribution**: Cannot distribute jobs across multiple server instances or worker nodes.
  3. **No Retries or Backpressure**: If background tasks pile up, the event loop becomes choked, leading to high memory usage.
* **Production Solution**: Message queues and distributed job brokers such as **RabbitMQ**, **Apache Kafka**, or **Redis BullMQ**.

---

## 🚀 How to Run and Test

### 1. Start Backend
```bash
cd backend
npm install
node server.js
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173/tasks
```

### 3. Run Automated Event-Driven Test Suite
```bash
cd backend
node test_events.js
```
