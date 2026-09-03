# NijRitu V0.4 backend contract

This directory defines the public-layer and remote-backup boundary. It is deliberately separate from the private browser tracker.

## Non-negotiable rules

1. Plain private cycle history, symptoms and notes never enter a NijRitu backend.
2. Remote backup endpoints receive ciphertext only. Encryption happens in the browser before upload.
3. Community records contain no tracker data and no required user profile.
4. Community identity is application-level anonymous, not a promise that network infrastructure cannot observe IP addresses, timestamps or abuse signals.
5. No follower graph, DMs, targeted advertising or health-data analytics.
6. Community moderation data and retention are separate from private tracker storage.
7. Provider adapters must be replaceable. A failed public service must never make the private tracker unusable.

## Local preview architecture

The backend contract is implemented as a small Node HTTP service for local development and test fixtures. Production deployment may use a Vercel-compatible adapter plus an external persistence provider. No provider credentials belong in the repository.

Planned endpoints:

- `GET /api/health`
- `POST /api/backup` for opaque encrypted blobs only
- `GET /api/backup/:id` for opaque encrypted blobs only
- `DELETE /api/backup/:id`
- `POST /api/community/submissions`
- `GET /api/community/feed`
- `POST /api/community/replies`
- `POST /api/community/report`
- moderation-only administrative operations

The exact production persistence layer is intentionally an adapter decision and must be selected before V0.4 production launch. The repository must never pretend a local file store is durable server storage.
