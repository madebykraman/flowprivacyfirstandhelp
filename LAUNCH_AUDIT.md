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
| Offline/PWA | Service-worker shell and install support | Implemented; V0.3 assets included |
| Local reminders | Explicit opt-in notifications, best-effort background check where browser permits | Implemented in V0.3; browser-controlled capability |
| Automated tests | Pure cycle-engine regression tests | Implemented in V0.3; GitHub workflow configured |
| Accessibility | Semantic controls and accessible calendar labels | Implemented incrementally; final cross-browser audit remains a launch gate |
| Community | Anonymous, no profiles, no follower graph, no DMs | V0.4 backend contract/scaffold started; not production-ready |
| Community Pro | Professional directory, self-listing then verification | Planned V0.5 |
| User-controlled backup destinations | WebDAV/Nextcloud/cloud adapters | V0.4 architecture required; provider integration still in progress |
| Apple Health / Health Connect | Optional, explicit opt-in integration | Planned later |
| Donations | Donation support without subscriptions or advertising | Planned later |

## V0.3 engineering notes

The cycle engine is isolated in `core.js` as pure, testable functions. The enhancement layer in `v03.js` consumes that engine without moving private health data to a backend. `v03-reminders.js` adds timezone-aware local reminder metadata and capability-gated registration.

The reminder implementation deliberately uses the browser's supported notification/background facilities rather than pretending a web page can guarantee an exact alarm while closed. Browser scheduling and permissions remain authoritative.

## V0.4 engineering started

`backend/README.md` records the backend contract. `backend/server.js` is a local development/test implementation for the public boundary and opaque encrypted backup records. It is deliberately not described as production persistence: its in-memory store disappears when the process stops. A production adapter and durable provider must be implemented and tested before V0.4 can be considered complete.

The backend contract requires ciphertext-only remote private backups and keeps community data outside the private tracker model. Community identity is application-level anonymous, not a claim that network infrastructure cannot observe technical metadata.

## Security and privacy checks

1. Private cycle data is stored in IndexedDB under `nijritu-local`.
2. The code contains no analytics SDK, advertising SDK, tracker account flow, or private health API endpoint.
3. Plain exports are intentionally user-created files.
4. Encrypted exports use Web Crypto AES-GCM with a random salt and IV and PBKDF2-SHA-256 key derivation.
5. The passphrase is never stored by the app.
6. Encrypted share files contain only the selected cycle fields and are intended to be transferred by users through a channel they trust.
7. The browser database is not represented as encrypted merely because encrypted exports exist.
8. Browser storage retention is not guaranteed; the UI tells users to keep backups.
9. Public community and professional-directory data are kept outside the private tracker model.
10. Predictions are explicitly not contraception or diagnosis.
11. Period start detection treats consecutive period days as one period episode rather than multiple cycle starts.
12. The V0.4 server contract rejects backup requests that do not provide an opaque ciphertext field and never attempts to decrypt it.

## Automated verification

The repository quality workflow checks syntax for the app, cycle engine, enhancement layers, service worker, backend and tests; executes the cycle-engine and backend contract suites; validates required files; and parses the manifest. GitHub Actions still has not produced a verifiable run in the connector, so CI is not described as passed until an actual run is observed.

## What is not being falsely marked launch-ready

The anonymous public community, durable remote backup provider, Community Pro verification, and native Apple Health / Health Connect integrations require additional implementation, infrastructure, platform permissions or operational policies. They remain explicitly incomplete until tested end-to-end.

## Final operational gate

Before public promotion, the owner needs only to perform the final real-device/live-environment checks after the build is complete: current Safari iOS, Chrome Android and desktop browsers; fresh-device backup/import/delete; PWA installation; notification behavior; production backend privacy/retention behavior; privacy policy/support contact; and domain/trademark clearance for NijRitu.
