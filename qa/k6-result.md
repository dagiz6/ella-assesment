# k6 Performance Test Results

## Test Overview

A k6 performance test was executed against the `GET /users` endpoint of the Ella API.

### Scenario

* **Endpoint:** `GET /users`
* **Environment:** Local development environment
* **Base URL:** `http://localhost:4000`
* **Maximum virtual users:** 10
* **Test duration:** 40 seconds
* **Iterations completed:** 307
* **Interrupted iterations:** 0

### Load Profile

The test used three stages:

1. Ramp up from 0 to 10 virtual users over 10 seconds.
2. Maintain 10 virtual users for 20 seconds.
3. Ramp down from 10 to 0 virtual users over 10 seconds.

The test script also included a 1-second sleep between iterations.

---

## Test Results

### Functional Checks

| Metric            | Result |
| ----------------- | -----: |
| Total checks      |    614 |
| Successful checks |    614 |
| Failed checks     |      0 |
| Success rate      |   100% |

The following checks were performed:

* `GET /users returns 200`
* `response contains data`

Both checks passed for every request.

---

## HTTP Performance

| Metric                |               Result |
| --------------------- | -------------------: |
| Total HTTP requests   |                  307 |
| Request rate          | 7.62527 requests/sec |
| Average response time |              8.63 ms |
| Minimum response time |                 0 ms |
| Median response time  |              3.35 ms |
| Maximum response time |            771.23 ms |
| 90th percentile (p90) |              6.11 ms |
| 95th percentile (p95) |              9.08 ms |
| Failed requests       |                    0 |
| HTTP failure rate     |                0.00% |

---

## Threshold Results

The test defined two performance thresholds.

| Threshold                         | Actual Result | Status   |
| --------------------------------- | ------------: | -------- |
| `http_req_duration: p(95)<1000ms` | p95 = 9.08 ms | **PASS** |
| `http_req_failed: rate<0.05`      |         0.00% | **PASS** |

The API successfully satisfied both configured thresholds.

---

## Execution Results

| Metric                     | Result |
| -------------------------- | -----: |
| Average iteration duration | 1.01 s |
| Minimum iteration duration | 1.00 s |
| Median iteration duration  | 1.00 s |
| Maximum iteration duration | 1.84 s |
| p90 iteration duration     | 1.00 s |
| p95 iteration duration     | 1.01 s |
| Completed iterations       |    307 |
| Interrupted iterations     |      0 |
| Minimum VUs                |      1 |
| Maximum VUs                |     10 |

---

## Network Results

| Metric        |   Result |
| ------------- | -------: |
| Data received |   333 kB |
| Receive rate  | 8.3 kB/s |
| Data sent     |    23 kB |
| Send rate     |  572 B/s |

---

## Summary

The `GET /users` endpoint performed successfully under the tested load of up to 10 concurrent virtual users.

A total of **307 HTTP requests** were completed during the 40-second test. There were **zero failed HTTP requests**, resulting in a **0.00% failure rate**.

The average response time was **8.63 ms**, while the **95th percentile response time was 9.08 ms**. This is well below the configured 1000 ms p95 threshold.

All **614 functional checks passed**, confirming that the endpoint continued returning the expected HTTP status and response structure during the test.

### Overall Result: PASS

The endpoint met all configured performance and functional thresholds in the local test environment.

---

## Assumptions and Limitations

This test was performed against the API running locally on a development machine.

The test used a relatively small load of up to 10 virtual users and therefore should not be interpreted as a measurement of production capacity.

The results may also be affected by the local machine, database configuration, network environment, and other processes running during the test.

For a more representative performance assessment, the same test could be executed against a staging or production-like environment with a larger and more realistic user load.
