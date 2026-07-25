
# Service-Level Objectives

These service-level objectives define the expected behavior of the Study Room Access system during normal operation.

## Availability

The Room Service and Reservation Service should successfully respond to at least 99% of valid requests while the application is running.

## Response Time

For standard endpoints:

* At least 95% of requests should complete within 500 milliseconds.
* Basic health-check endpoints should complete within 200 milliseconds.

The endpoint designed to demonstrate simulated latency is excluded from the normal response-time objective because it intentionally uses a delay.

## Error Rate

Fewer than 1% of valid requests should result in unexpected server errors.

Client errors caused by invalid requests, such as requesting a room that does not exist, are not counted as unexpected server errors.

## Health Monitoring

Each application service should provide a health-check endpoint, such as:

```text
GET /health
```

A healthy service should return an HTTP `200` response with a simple result such as:

```json
{
  "status": "healthy"
}
```

The sidecar container should periodically check the connected service and log whether the health check succeeds or fails.

## Data Consistency

The Reservation Service should return consistent reservation information during a single application session. Because the initial system may use in-memory fake data, reservations may reset when the container restarts.
