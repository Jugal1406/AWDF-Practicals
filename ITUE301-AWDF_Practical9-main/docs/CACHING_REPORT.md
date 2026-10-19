# Caching & Query Optimization Benchmark Report: Practical 9

**Student**: Jugal Kshatriya (24CS042)  
**Institution**: CSPIT, CHARUSAT  
**Course**: ITUE301 - Advanced Web Development Frameworks  

---

## 1. Measured Response Time Data

### Test Environment:
* Node.js v24.4.0
* MongoDB Community Server 127.0.0.1:27017
* `node-cache` v5.1.2 (stdTTL: 60s)
* Timing instrumented via `process.hrtime.bigint()`

### Results Table:
| Condition | Sample # | Server-Side Processing Time (ms) | Client Roundtrip Time (ms) | HTTP Header (`X-Cache`) | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Uncached (Cache Miss)** | 1 | 18.02 ms | 44.11 ms | `MISS` | Queried MongoDB |
| **Uncached (Cache Miss)** | 2 | 6.33 ms | 19.97 ms | `MISS` | Queried MongoDB |
| **Uncached (Cache Miss)** | 3 | 4.65 ms | 16.30 ms | `MISS` | Queried MongoDB |
| **Cached (In-Memory Hit)** | 1 | 0.05 ms | 12.21 ms | `HIT` | Served from RAM |
| **Cached (In-Memory Hit)** | 2 | 0.06 ms | 11.39 ms | `HIT` | Served from RAM |
| **Cached (In-Memory Hit)** | 3 | 0.05 ms | 10.00 ms | `HIT` | Served from RAM |

### Summary Averages:
* **Average Uncached Server Time**: 9.67 ms
* **Average Cached Server Time**: 0.053 ms
* **Performance Gain**: ~182x reduction in server processing time.

---

## 2. Invalidation Verification Log
```text
Active keys before write: 1
Executing: POST /tasks (New task added to MongoDB)
[Cache Invalidation] Cleared 1 key(s): [ 'tasks_6ad3145a365d1e5cfe67eb8c_all' ]
Active keys after write: 0
Next GET /tasks -> X-Cache: MISS (Fresh database query verified)
```
