# System Design Building Blocks

Summarize key architecture concepts, trade-offs, and back-of-the-envelope numbers here.

## Core Topics
- **Load Balancing & API Gateway:** L4 vs L7, health checks, rate limiting algorithms (Token Bucket, Sliding Window).
- **Caching:** Cache-aside, write-through, write-back, eviction policies (LRU/LFU).
- **Databases & Scaling:** Read replicas, sharding/partitioning keys, consistent hashing, SQL vs NoSQL trade-offs.
- **Async Processing:** Message queues (Kafka/SQS), dead-letter queues, idempotency keys.

## Reference Architecture Diagram (Rendered via Kroki)

```mermaid
flowchart LR
  Client[Client Browser / App] --> LB[L4/L7 Load Balancer]
  LB --> GW[API Gateway + Rate Limiter]
  GW --> Auth[Auth Service]
  GW --> Core[Core Service]
  Core --> Cache[(Redis Cache)]
  Core --> DB[(Primary PostgreSQL)]
  Core --> MQ[[Kafka Queue]]
  MQ --> Worker[Async Worker]
```
