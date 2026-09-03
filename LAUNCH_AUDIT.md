# NijRitu Launch Audit

Last audited: 4 September 2026

## Product contract

NijRitu is a free, privacy-first personal cycle utility. The private tracker must remain useful without an account, subscription, advertising, advertising profile, or NijRitu health-data backend.

Core positioning: **Your cycle. Your data. Your choice.**

The product boundary is intentional: the utility is local-first; public layers are separate and must not weaken private tracking.

## Roadmap gate

The implementation sequence is binding: **V0.2 → V0.3 → V0.4 → V0.5 → later platform integrations**. A release label must never imply that later roadmap work is complete merely because the local tracker is usable.

## Approved scope

| Area | Required direction | Current state |
|---|---|---|
| Cycle tracking | Period starts, period days, flow, pain, symptoms, notes | Implemented; V0.3 engine identifies contiguous period episodes |
| Calendar | Historical logs plus estimated next-period window | Implemented |
| Predictions | Useful estimates, never medical certainty | Implemented with explicit safety copy; V0.3 uses a robust median baseline |
| Insights | Cycle history, range, consistency, symptom and pain patterns | Implemented and expanded in V0.3 |
| Knowledge | Source-linked education rather than copied medical authority | Implemented |
| Help | Reputable health resources and safety boundaries | Implemented in product copy |
| Local privacy | IndexedDB, no tracker account, no health backend | Implemented |
| Backups | Plain export plus passphrase-encrypted export | Implemented |
| Backup portability | Versioned format and validation | Implemented |
| Partner mode | Explicit, selected-data, encrypted file transfer without shared account | Implemented |
| Private display | Reduce visible identity/context on screen | Implemented |
| Custom symptoms | Local symptom labels | Implemented |
| Period editing | Range-based local period correction without silently erasing unrelated history | Implemented in V0.3 |
| Offline/PWA | Service-worker shell and install support | Implemented; V0.4 adds its client layer to the static app |
| Local reminders | Explicit opt-in notifications, best-effort background check where browser permits | Implemented in V0.3; browser-controlled capability |
| Automated tests | Pure cycle-engine regression tests plus backend contract tests | Implemented; GitHub workflow executing |
| Accessibility | Semantic controls and accessible calendar labels | Implemented incrementally; final cross-browser audit remains a launch gate |
| User-controlled backup destinations | WebDAV/Nextcloud plus encrypted relay option | V0.4 client implemented; live provider/CORS testing remains a gate |
| Community | Anonymous application-level identity, no profiles/follower graph/DMs, moderation | V0.4 client and backend implemented; production operations still required |
| Community Pro | Professional directory, self-listing then verification | Planned V0.5 |
| Apple Health / Health Connect | Optional, explicit opt-in integration | Planned later |
| Donations | Donation support without subscriptions or advertising | Planned later |

## V0.4 engineering notes

`backend/storage.js` provides a durable local JSON adapter with atomic replacement for local development. `backend/server.js` stores only opaque encrypted backup payloads, protects backup retrieval/deletion with a separate 256-bit access key, expires relay backups after 90 days by default, applies basic per-IP rate limits, rejects unexpected CORS origins and disables moderation authentication when no server-side admin token is configured.

The community feed exposes only approved top-level posts and approved replies. Moderation endpoints are protected by a server-side bearer token. The token is never placed in frontend code. Repeated reports move an approved post back into review. Production deployments still need a shared/durable rate-limit mechanism, operational moderation, retention/deletion policy, abuse monitoring and a production-grade database/provider adapter.

`v04.js` adds browser-side AES-GCM/PBKDF2 encrypted backup creation, direct WebDAV/Nextcloud upload/restore, an optional ciphertext-only NijRitu relay, and the first community client. WebDAV credentials are entered for the operation and are not stored by this layer. Direct WebDAV use depends on the user's storage provider allowing browser CORS.

## Security and privacy checks

1. Private cycle data is stored in IndexedDB under `nijritu-local`.
2. The code contains no analytics SDK, advertising SDK, tracker account flow, or private health API endpoint.
3. Plain exports are intentionally user-created files.
4. Encrypted exports and V0.4 remote backups use Web Crypto AES-GCM with random salt/IV and PBKDF2-SHA-256 key derivation.
5. The passphrase is never stored by the V0.4 backup layer.
6. Remote backup endpoints receive ciphertext only and never attempt to decrypt it.
7. Relay backup retrieval and deletion require a separate random access key; only its SHA-256 hash is stored server-side.
8. Relay backups receive a 90-day default expiry unless the caller supplies a valid expiry date.
9. The browser database is not represented as encrypted merely because encrypted exports exist.
10. Browser storage retention is not guaranteed; the UI tells users to keep backups.
11. Public community and professional-directory data are kept outside the private tracker model.
12. Predictions are explicitly not contraception or diagnosis.
13. Period start detection treats consecutive period days as one period episode rather than multiple cycle starts.
14. Community posts and replies are pending until moderation approves them.
15. Application-level anonymity is not presented as infrastructure-level anonymity.
16. API responses include no-store caching and basic browser isolation/security headers.
17. Configured CORS is exact-origin rather than reflecting arbitrary browser origins.

## Automated verification

The repository quality workflow checks syntax for the app, cycle engine, enhancement layers, service worker, backend and tests; executes the cycle-engine and backend contract suites; validates required files; and parses the manifest. The latest quality run completed successfully after the V0.4 backend hardening.

## What is not being falsely marked launch-ready

V0.4 still has explicit operational gates: production-grade durable/shared persistence, live provider integration testing, production CORS/security configuration, retention/deletion operations, moderation operations, final browser testing and deployment verification. Community Pro verification and native Apple Health / Health Connect integrations remain later roadmap work.

## Final operational gate

Before public promotion, the owner needs only to perform the final real-device/live-environment checks after the build is complete: current Safari iOS, Chrome Android and desktop browsers; fresh-device backup/import/delete; PWA installation; notification behavior; production backend privacy/retention behavior; privacy policy/support contact; and domain/trademark clearance for NijRitu.
