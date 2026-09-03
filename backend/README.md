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

## Local preview

Run `node backend/server.js`. The default port is `8787`. The JSON adapter writes to `.nijritu-data/store.json` and uses atomic replacement, so local backups and moderation records survive process restarts. Set `NIJRITU_STORE_FILE` to choose another location.

The static app remains usable without the backend. To connect the optional public layer during local development, set its API base in Settings, for example `http://localhost:8787`.

## Production boundary

The included JSON adapter is for local development and small controlled deployments. It is not a recommendation for a public multi-instance production service. A production adapter must provide durable storage, concurrency safety, backups, deletion/retention controls and operational monitoring without ever receiving private health data in plaintext.

The server is structured around a storage interface so a production deployment can replace the JSON adapter with a managed database or equivalent durable provider. Provider credentials must be supplied through the deployment environment and never committed to the repository.

## Endpoints

- `GET /api/health`
- `POST /api/backup` for opaque encrypted blobs only
- `GET /api/backup/:id` for opaque encrypted blobs only
- `DELETE /api/backup/:id`
- `POST /api/community/submissions`
- `GET /api/community/feed` for approved top-level posts
- `POST /api/community/replies`
- `POST /api/community/report`
- `GET /api/moderation/queue` for administrators
- `POST /api/moderation/submissions/:id/approve|reject`
- `POST /api/moderation/replies/:id/approve|reject`

Community submissions and replies are pending until moderation approves them. Basic per-IP rate limits are included in the local service. Production deployments need a durable/shared rate-limit mechanism and a documented retention policy.

## Environment

- `PORT` optional, default `8787`
- `NIJRITU_STORE_FILE` optional, default `./.nijritu-data/store.json`
- `NIJRITU_ADMIN_TOKEN` required in production for moderation
- `NIJRITU_CORS_ORIGIN` should be set to the exact production web origin

Never place an admin token, WebDAV password or other credential in frontend code.
