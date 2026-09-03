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
| Cycle tracking | Period starts, period days, flow, pain, symptoms, notes | Implemented; V0.3 engine now identifies period starts as contiguous-range starts |
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
| Offline/PWA | Service-worker shell and install support | Implemented; V0.3 cache includes new local engine/enhancement assets |
| Local reminders | Explicit opt-in notifications, best-effort background check where browser permits | Implemented in V0.3; capability is feature-detected and browser-controlled |
| Automated tests | Pure cycle-engine regression tests | Implemented in V0.3; GitHub workflow configured |
| Accessibility | Semantic controls and accessible calendar labels | Implemented incrementally; final cross-browser audit remains a launch gate |
| Community | Anonymous, no profiles, no follower graph, no DMs | UI boundary only; server-backed feature not yet enabled |
| Community Pro | Professional directory, self-listing then verification | Planned separate public layer |
| User-controlled backup destinations | WebDAV/Nextcloud/cloud adapters | Planned V0.4 |
| Apple Health / Health Connect | Optional, explicit opt-in integration | Planned later |
| Donations | Donation support without subscriptions or advertising | Planned later |

## V0.3 engineering notes

The cycle engine is now isolated in `core.js` as pure, testable functions. The enhancement layer in `v03.js` consumes that engine without moving private health data to a backend. `v03-reminders.js` adds timezone-aware local reminder metadata and capability-gated registration.

The reminder implementation deliberately uses the browser's supported notification/background facilities rather than pretending a web page can guarantee an exact alarm while closed. Persistent notifications require a service worker, while periodic background synchronization is experimental/limited and remains subject to browser scheduling and permissions. citeturn0search0turn1search0

## Security and privacy checks

1. Private cycle data is stored in IndexedDB under `nijritu-local`.
2. The code contains no analytics SDK, advertising SDK, tracker account flow, or private health API endpoint.
3. Plain exports are intentionally user-created files.
4. Encrypted exports use Web Crypto AES-GCM with a random salt and IV and PBKDF2-SHA-256 key derivation.
5. The passphrase is never stored by the app.
6. Encrypted share files contain only the selected cycle fields and are intended to be transferred by the users through a channel they trust.
7. The browser database is not represented as encrypted merely because encrypted exports exist.
8. Browser storage retention is not guaranteed; the UI tells users to keep backups.
9. Public community and professional-directory data are kept outside the private tracker model.
10. Predictions are explicitly not contraception or diagnosis.
11. Period start detection treats consecutive period days as one period episode rather than multiple cycle starts.

## Automated verification

The repository quality workflow now checks syntax for the app, pure cycle engine, service worker and tests, executes the cycle-engine regression suite, validates required files and parses the manifest. GitHub Actions has not yet produced a verifiable run for this repository, so CI is not described as passed until an actual run is observed.

## What is not being falsely marked launch-ready

The anonymous public community, Community Pro verification, user-selected remote backup destinations, and native Apple Health / Health Connect integrations require additional infrastructure, platform permissions, or operational policies. They remain explicitly separated from the private tracker rather than being simulated as complete.

## Final operational gate

Before public promotion, the owner still needs to verify the live deployment on current Safari iOS, Chrome Android, and desktop browsers; exercise fresh-device backup/import/delete flows; verify PWA installation and notification behavior; publish the privacy policy and support contact; and complete domain/trademark clearance for NijRitu.
