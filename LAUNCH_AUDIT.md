# NijRitu Launch Audit

Last audited: 4 September 2026

## Product contract

NijRitu is a free, privacy-first personal cycle utility. The private tracker must remain useful without an account, subscription, advertising, advertising profile, or NijRitu health-data backend.

Core positioning: **Your cycle. Your data. Your choice.**

The product boundary is intentional: the utility is local-first; public layers are separate and must not weaken private tracking.

## Roadmap gate

The implementation sequence is binding: **V0.2 → V0.3 → V0.4 → V0.5 → later platform integrations**. V0.4 and V0.5 feature work is now implemented as a continuous build milestone. Later integrations are not implied by the version label.

## Approved scope

| Area | Required direction | Current state |
|---|---|---|
| Cycle tracking | Period starts, period days, flow, pain, symptoms, notes | Implemented |
| Calendar | Historical logs plus estimated next-period window | Implemented |
| Predictions | Useful estimates, never medical certainty | Implemented with safety copy and robust baseline |
| Insights | Cycle history, range, consistency, symptom and pain patterns | Implemented |
| Knowledge | Source-linked education rather than copied medical authority | Implemented |
| Local privacy | IndexedDB, no tracker account, no health backend | Implemented |
| Backups | Plain export plus passphrase-encrypted export | Implemented |
| Backup portability | Versioned format and validation | Implemented |
| Partner mode | Explicit, selected-data, encrypted file transfer without shared account | Implemented |
| Private display | Reduce visible identity/context on screen | Implemented |
| Custom symptoms | Local symptom labels | Implemented |
| Period editing | Range-based local period correction | Implemented |
| Offline/PWA | Service-worker shell and install support | Implemented; V0.5 cache includes all client layers |
| Local reminders | Explicit opt-in, best-effort browser background check | Implemented; browser-controlled timing |
| Automated tests | Cycle-engine and backend contract coverage | Implemented in CI |
| Accessibility | Semantic controls and accessible calendar labels | Implemented incrementally; final device audit remains a gate |
| User-controlled backup destinations | WebDAV/Nextcloud plus encrypted relay option | Implemented client-side; provider-specific live testing remains a gate |
| Community | Application-level anonymous identity, no profiles/follower graph/DMs, moderation | Implemented client and backend |
| Community Pro | Professional directory, self-listing, credentials, verification, contact/booking | Implemented client and backend |
| Apple Health / Health Connect | Optional, explicit opt-in integration | Planned later |
| Donations | Donation support without subscriptions or advertising | Planned later |

## V0.4 and V0.5 engineering notes

The backend has a durable local JSON adapter for development, opaque encrypted relay storage, per-backup random access keys stored only as hashes, default relay expiry, exact-origin CORS, rate limiting, browser security headers and server-side moderation authentication.

The public community exposes only approved posts and approved replies. Submissions and replies remain pending until moderation. Repeated reports move an approved post back into review. Application-level anonymity is explicitly not presented as network-level anonymity.

Community Pro is a separate public directory. Professionals can self-submit a listing with role, specialties, service area, credential details and optional public website/booking URL or email. Listings are pending by default. Moderators can approve and separately verify credentials. Only approved and verified listings enter the public directory. No private tracker fields are accepted by or attached to this model.

The browser client renders approved community content safely, searches the professional directory locally after retrieval, validates public contact fields and keeps the private tracker independent of public-layer availability.

## Security and privacy checks

1. Private cycle data is stored in IndexedDB under `nijritu-local`.
2. There is no analytics SDK, advertising SDK, tracker account flow, or private health API endpoint.
3. Plain exports are intentionally user-created files.
4. Encrypted exports and remote backups use Web Crypto AES-GCM with random salt/IV and PBKDF2-SHA-256 key derivation.
5. Backup passphrases are never stored by the V0.4/V0.5 client layer.
6. Remote backup services receive ciphertext only and never attempt decryption.
7. Relay backup retrieval and deletion require a separate random access key; only its SHA-256 hash is stored server-side.
8. Relay backups receive a 90-day default expiry.
9. Browser database contents are not described as encrypted merely because encrypted exports exist.
10. Browser storage retention is not guaranteed; users are told to keep backups.
11. Community and professional-directory data are separate from the private tracker model.
12. Predictions are explicitly not contraception or diagnosis.
13. Consecutive period days are treated as one period episode.
14. Community posts and replies require moderation before publication.
15. Professional directory listings require approval and credential verification before public display.
16. Application-level anonymity is not represented as infrastructure-level anonymity.
17. API responses use no-store caching and browser security headers.
18. CORS rejects unexpected origins rather than reflecting arbitrary browser origins.

## Automated verification

The repository quality workflow checks syntax for all client layers, the service worker, backend and tests; executes the cycle-engine and backend contract suites; validates required launch files; and parses the manifest. V0.5 is included in syntax and launch-file coverage.

## Remaining launch gates

The feature roadmap for V0.4 and V0.5 is implemented. Remaining work is operational rather than another sequence of feature fragments: production-grade shared persistence/provider deployment, live WebDAV/provider testing, production CORS configuration, retention/deletion operations, moderation operations, final browser/device testing, support/privacy contact details, deployment verification and NijRitu name/domain/trademark clearance.

Apple Health, Health Connect, native packaging and donations remain deliberately outside V0.5.

## Final operational gate

Before public promotion, the owner needs the final real-device/live-environment checks: current Safari iOS, Chrome Android and desktop browsers; fresh-device backup/import/delete; PWA installation; notification behavior; production backend privacy/retention behavior; privacy policy/support contact; and domain/trademark clearance.
