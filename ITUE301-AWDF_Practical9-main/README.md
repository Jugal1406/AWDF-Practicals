# Practical 9: In-Memory Caching and Query Optimization

**Course**: Advanced Web Development Frameworks (ITUE301)  
**Department**: Computer Science and Engineering  
**Institute**: Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT  
**Academic Year**: 2025–2026  
**Student Name**: Jugal Kshatriya  
**Student ID**: 24CS042  
**GitHub Repository**: [Jugal1406/ITUE301-AWDF_Practical9](https://github.com/Jugal1406/ITUE301-AWDF_Practical9)

---

## 🎯 Practical Objective
To implement server-side in-memory caching using `node-cache`, design correct cache invalidation logic for write operations (`POST`, `PUT`, `DELETE`), measure the empirical performance impact on API response times, and provide complete cache observability.

---

## 🏗️ Architecture & Cache Invalidation Pipeline

```
GET /tasks (Read Path)
 │
 ▼
Cache Check (node-cache)
 ├── [CACHE HIT] ──► Return cached tasks immediately from RAM (0.05 ms, X-Cache: HIT)
 └── [CACHE MISS] ─► Query MongoDB ──► Store in node-cache (TTL: 60s) ──► Return data (18 ms, X-Cache: MISS)

POST / PUT / DELETE /tasks (Write Path)
 │
 ▼
Execute Write to MongoDB
 │
 ▼
Invalidate Cache (cache.del('tasks_userId_*'))
 └── Prevents stale data reads by forcing the next GET request to perform a fresh database query
```

---

## 📊 Empirical Response Time Comparison (Cached vs. Uncached)

Measured on `http://localhost:5000/tasks` using Node.js high-resolution timers (`process.hrtime.bigint()`):

| Sample # | Uncached (Database Read) Server Time | Cached (In-Memory Read) Server Time | Client-to-Client Roundtrip (Cached) | Cache Status Header |
| :--- | :--- | :--- | :--- | :--- |
| **Reading 1** | **18.02 ms** | **0.05 ms** | 12.21 ms | `X-Cache: HIT` |
| **Reading 2** | **6.33 ms** | **0.06 ms** | 11.39 ms | `X-Cache: HIT` |
| **Reading 3** | **4.65 ms** | **0.05 ms** | 10.00 ms | `X-Cache: HIT` |
| **Average** | **9.67 ms** | **0.053 ms** | **11.20 ms** | **182x Server Speedup** |

---

## 💡 Key Implementation Details

### 1. Shared Cache Instance (`backend/cache.js`)
```javascript
const NodeCache = require('node-cache');
const cacheInstance = new NodeCache({
  stdTTL: 60,        // 60-second default Time-To-Live
  checkperiod: 120,  // Periodic expired key cleanup
  useClones: false,  // Optimized reference return
});
```

### 2. Cache-Aside Read Strategy (`backend/server.js`)
```javascript
app.get('/tasks', auth, async (req, res, next) => {
  const startTime = process.hrtime.bigint();
  const cacheKey = `tasks_${req.user._id}_${JSON.stringify(req.query || {})}`;

  // 1. Check in-memory cache
  const cached = cache.get(cacheKey);
  if (cached) {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    return res.status(200).json({ ...cached, cacheStatus: 'HIT', responseTimeMs: durationMs });
  }

  // 2. Cache MISS -> Query MongoDB
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  const payload = { success: true, count: tasks.length, data: tasks };

  // 3. Store in cache
  cache.set(cacheKey, payload, 60);

  const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
  res.setHeader('X-Cache', 'MISS');
  res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
  res.status(200).json({ ...payload, cacheStatus: 'MISS', responseTimeMs: durationMs });
});
```

### 3. Write Invalidation (`POST`, `PUT`, `DELETE`)
Whenever tasks are created, updated, or removed, all cached queries for that user are purged immediately:
```javascript
function invalidateUserTasksCache(userId, taskId = null) {
  const keysToDelete = cache.keys().filter(
    (k) => k.startsWith(`tasks_${userId}`) || k === 'all_tasks'
  );
  if (taskId) keysToDelete.push(`task_${taskId}`);
  if (keysToDelete.length > 0) cache.del(keysToDelete);
}
```

### 4. Supplementary Solutions Implemented
* **Supplementary 1 (Single-Task Caching)**: `GET /tasks/:id` is cached independently with key `task_${id}` and invalidated when that specific task is modified or deleted.
* **Supplementary 2 (Hit/Miss Counter & Debug Endpoint)**: `GET /tasks/cache-stats` exposes hits, misses, total requests, hit ratio percentage, and active key counts.
* **Supplementary 3 (TTL Trade-Offs)**: Implemented configurable TTL via `.env` (`CACHE_TTL_SECONDS=60`) and evaluated trade-offs between data freshness and DB offload.
* **Frontend Cache Observability Panel (`src/components/CacheMonitor.jsx`)**: Real-time browser dashboard displaying live response time comparison, cache hit/miss status, hit ratio %, and a one-click **"🧹 Flush Cache"** benchmark button.

---

## ❓ Key Questions & Analysis (Lab Viva Preparation)

### Q1: Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?
* **Why**: The cache stores a snapshot of database state in server RAM. If a write operation (`POST`, `PUT`, or `DELETE`) updates MongoDB without clearing the cache, subsequent read requests will continue returning stale data from memory until the TTL expires.
* **Impact**: Users would create or delete a task and not see their changes reflected, leading to serious data inconsistency and broken user experience. Invalidation guarantees cache consistency with the database.

### Q2: What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
* **Reasonable TTL**: 30 to 60 seconds is typical for a personal task manager with active write invalidation.
* **Trade-Off**:
  * **Shorter TTL (e.g. 10s)**: High data freshness and safety, but lower cache hit ratio and more frequent database reads.
  * **Longer TTL (e.g. 5–10 mins)**: High cache hit ratio and maximum DB offload, but higher risk of serving stale data if an edge-case invalidation fails or external updates occur.

### Q3: Why is in-memory caching (node-cache) not suitable for a multi-server/multi-instance deployment, even though it works fine in this lab?
* `node-cache` stores items in the **local heap memory of a single Node.js process**.
* In a production multi-server environment (e.g., behind a load balancer with multiple containers or PM2 cluster mode):
  1. A write request on Server A clears Server A's local cache.
  2. Server B and Server C never receive the invalidation signal, continuing to serve stale data.
  3. Subsequent read requests routed to Server B or C hit stale local memory.
* **Industry Solution**: Distributed caching using **Redis** or **Memcached**, where all application server instances share a centralized, synchronized caching cluster.

---

## 🚀 How to Run and Test

### 1. Start Backend with In-Memory Caching
```bash
cd backend
npm install
node server.js
# Runs on port 5000 with node-cache active (60s TTL)
```

### 2. Start Frontend with Cache Monitor
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173/tasks
```

### 3. Verify via Terminal Benchmark Script
```bash
cd backend
node test_cache.js
```
