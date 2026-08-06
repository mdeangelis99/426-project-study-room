Sprint 3 load test

I ran load-tests/sprint-3-load.js with k6 against Caddy on localhost:3001 (the load-balanced room service). 10 VUs for 30 seconds.

Numbers from k6:
- p50: 2.38 ms
- p95: 5.42 ms
- p99: 19.27 ms
- request rate: about 48 req/s
- error rate: 0% (0 failed out of 1449)

Compared to docs/SLO.md:
We're hitting the availability target (want 99%+, we got 100%).
We're also under the latency SLO — 95% of requests should be under 500 ms and p95 was only 5.42 ms.
Error rate target is under 1% and we had none, so that one's good too.

What this means:
The system handled this load fine. Caddy splitting traffic across two room-service replicas plus Redis caching for /rooms/:id keeps most requests fast. The slow ones (up to ~381 ms) are basically cache misses where we intentionally wait before talking to Redis. So the bottleneck right now is that fake miss delay, not the load balancer. I'll use this run as the baseline when we compare again in Sprint 5.
