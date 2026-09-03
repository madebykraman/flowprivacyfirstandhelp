# NijRitu Launch Audit

Last audited: 4 September 2026

## Product contract

NijRitu is a free, privacy-first personal cycle utility. The private tracker must remain useful without an account, subscription, advertising, advertising profile, or NijRitu health-data backend.

Core positioning: **Your cycle. Your data. Your choice.**

The product boundary is intentional: the utility is local-first; public layers are separate and must not weaken private tracking.

## Approved scope

| Area | Required direction | Current state |
|---|---|---|
| Cycle tracking | Period starts, period days, flow, pain, symptoms, notes | Implemented |
| Calendar | Historical logs plus estimated next-period window | Implemented |
| Predictions | Useful estimates, never medical certainty | Implemented with explicit safety copy |
| Insights | Cycle history, range, consistency, symptom and pain patterns | Implemented |
| Knowledge | Source-linked education rather than copied medical authority | Implemented |
| Help | Reputable health resources and safety boundaries | Implemented in product copy |
| Local privacy | IndexedDB, no tracker account, no health backend | Implemented |
| Backups | Plain export plus passphrase-encrypted export | Implemented |
| Backup portability | Versioned format and validation | Implemented |
| Partner mode | Explicit, selected-data, encrypted file transfer without shared account | Implemented |
| Private display | Reduce visible identity/context on screen | Implemented |
| Custom symptoms | Local symptom labels | Implemented |
| Offline/PWA | Service-worker shell and install support | Implemented |
| Community | Anonymous, no profiles, no follower graph, no DMs | UI boundary only; server-backed feature intentionally not enabled |
| Community Pro | Professional directory, self-listing then verification | Planned separate public layer |
| User-controlled backup destinations | WebDAV/Nextcloud/cloud adapters | Planned |
| Apple Health / Health Connect | Optional, explicit opt-in integration | Planned |
| Donations | Donation support without subscriptions or advertising | Planned |

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

## Code audit findings addressed in V1.1

- Raised IndexedDB schema version to 4 so the hardened state model can migrate from earlier local data.
- Normalized imported state and preserved existing logs/custom symptom lists/settings.
- Added local custom symptom management.
- Added stronger encrypted-file format validation before decryption.
- Fixed partner-share note serialization so optional notes remain strings rather than malformed objects.
- Added bounds to cycle and period baseline values.
- Added calendar day accessibility labels.
- Refreshed the service-worker cache version to 1.1.0.
- Added a repository quality workflow for JavaScript syntax, service-worker syntax, required files, and manifest JSON.

## What is not being falsely marked launch-ready

The anonymous public community, Community Pro verification, user-selected remote backup destinations, and native Apple Health / Health Connect integrations require additional infrastructure, platform permissions, or operational policies. They remain explicitly separated from the private tracker rather than being simulated as complete.

## Final operational gate

Before public promotion, the owner still needs to verify the live deployment on current Safari iOS, Chrome Android, and desktop browsers; exercise fresh-device backup/import/delete flows; verify PWA installation; publish the privacy policy and support contact; and complete domain/trademark clearance for NijRitu.
