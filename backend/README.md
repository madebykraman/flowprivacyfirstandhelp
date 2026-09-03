# NijRitu V0.5 public-layer backend contract

This directory defines the public-layer and remote-backup boundary. It is deliberately separate from the private browser tracker.

## Non-negotiable rules

1. Plain private cycle history, symptoms and notes never enter a NijRitu backend.
2. Remote backup endpoints receive ciphertext only. Encryption happens in the browser before upload.
3. Community and professional records contain no tracker data and no required tracker account.
4. Community identity is application-level anonymous, not a promise that network infrastructure cannot observe IP addresses, timestamps or abuse signals.
5. No follower graph, DMs, targeted advertising or health-data analytics.
6. Community and professional moderation data are separate from private tracker storage.
7. Professional listings are public records and require moderation plus credential verification before appearing in the public directory.
8. Provider adapters must be replaceable. A failed public service must never make the private tracker unusable.

## Local preview

Run `node backend/server.js`. The default port is `8787`. The JSON adapter writes to `.nijritu-data/store.json` and uses atomic replacement, so local backups, moderation records and professional listings survive process restarts. Set `NIJRITU_STORE_FILE` to choose another location.

The static app remains usable without the backend. To connect the optional public layer during local development, set its API base in Settings, for example `http://localhost:8787`.

## Production boundary

The included JSON adapter is for local development and small controlled deployments. It is not a recommendation for a public multi-instance production service. A production adapter must provide durable storage, concurrency safety, backups, deletion/retention controls and operational monitoring without ever receiving private health data in plaintext.

Provider credentials must be supplied through the deployment environment and never committed to the repository.

## Endpoints

- `GET /api/health`
- `POST /api/backup` for opaque encrypted blobs only
- `GET /api/backup/:id` for opaque encrypted blobs only
- `DELETE /api/backup/:id`
- `POST /api/community/submissions`
- `GET /api/community/feed` for approved posts and replies
- `POST /api/community/replies`
- `POST /api/community/report`
- `GET /api/professionals` for approved and verified professional listings
- `POST /api/professionals` for professional self-listing
- `GET /api/moderation/queue` for community moderation
- `POST /api/moderation/submissions/:id/approve|reject`
- `POST /api/moderation/replies/:id/approve|reject`
- `GET /api/moderation/professionals` for professional moderation
- `POST /api/moderation/professionals/:id/approve|reject|verify`

All public submissions are pending until moderation. Basic per-IP rate limits are included in the local service. Production deployments need a durable/shared rate-limit mechanism, documented retention/deletion policy and operational moderation.

## Environment

- `PORT` optional, default `8787`
- `NIJRITU_STORE_FILE` optional, default `./.nijritu-data/store.json`
- `NIJRITU_ADMIN_TOKEN` required for moderation
- `NIJRITU_CORS_ORIGIN` should be the exact production web origin

Never place an admin token, WebDAV password or other credential in frontend code.
