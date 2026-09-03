# NijRitu Launch Audit

Last audited: 4 September 2026

## Product contract

NijRitu is a free, privacy-first personal cycle utility. The private tracker must remain useful without an account, subscription, advertising, advertising profile, or NijRitu health-data backend.

Core positioning: **Your cycle. Your data. Your choice.**

The product boundary is intentional: the utility is local-first; public layers are separate and must not weaken private tracking.

## Roadmap gate

Feature implementation has progressed through **V0.7**. V0.4 remote backup/community, V0.5 Community Pro, V0.6 local data portability and V0.7 experience work are implemented. Platform interoperability remains deliberately later work.

## Current scope

| Area | Current state |
|---|---|
| Local cycle tracker | Implemented |
| Calendar, estimates and insights | Implemented |
| Daily logging, custom symptoms and period editing | Implemented |
| Plain/encrypted backup and partner share | Implemented |
| WebDAV/Nextcloud and ciphertext-only relay backup | Implemented |
| Moderated anonymous community | Implemented |
| Community Pro professional directory | Implemented |
| Professional self-listing and credential verification | Implemented |
| PWA and opt-in best-effort reminders | Implemented |
| Local CSV export | Implemented |
| Local iCalendar export | Implemented, recorded period days only |
| Automated cycle-engine/backend CI | Implemented |
| Product visual redesign | Implemented |
| Origin story page | Implemented |
| Support page and persistent support footer | Implemented, payment destinations awaiting final links |
| Apple Health / Health Connect | Deliberately later |
| Native packaging | Deliberately later |

## V0.4 / V0.5 verification

CI successfully executes the V0.5 syntax checks, required-file checks, manifest validation and full cycle/backend test suite. The backend contract covers opaque backup storage, access-key authorization, expiry, CORS rejection, community moderation, replies, reports, professional listing moderation, credential verification and protected moderation endpoints.

V0.5 is structurally separated from private tracker data. The public professional endpoint exposes only approved and verified listings, while submissions remain pending until moderation.

## V0.6 data portability

V0.6 adds local-only portability rather than sending data to a new service. CSV contains the currently stored date, period, flow, pain, symptoms and notes fields. iCalendar contains recorded period days only and deliberately excludes predictions. The export layer performs browser-side file generation and does not upload tracker data.

## V0.7 experience

The interface has been rebuilt to remove the dense equal-weight card dashboard visible in early builds. The new visual system uses a warm neutral canvas, ink-led hierarchy, restrained vermillion accents, larger type, softer geometry and earlier responsive stacking. The redesign is presentation-only and does not change the private-data boundary.

The story page explains the motivation for NijRitu and the deliberate refusal to turn intimate health data into a business asset. The support page provides voluntary support routes without introducing subscriptions or paid access to core tracking. Final Buy Me a Coffee and Indian payment URLs are intentionally not invented and are awaiting the developer's supplied destinations.

## Privacy/security checks

1. Private cycle data remains in IndexedDB.
2. No tracker account or private health-data backend is required.
3. Remote backup services receive ciphertext only.
4. Backup passphrases are not stored by the client backup layer.
5. Relay retrieval/deletion uses a separate access key; only its hash is stored server-side.
6. Community and professional-directory records are separate from tracker data.
7. Community posts/replies require moderation before publication.
8. Professional listings require approval and credential verification before public display.
9. Application-level anonymity is not represented as infrastructure-level anonymity.
10. Predictions remain estimates, not contraception or diagnosis.
11. CSV and iCalendar exports are explicit user-created local files.
12. PWA cache is versioned through V0.7.
13. Story and support surfaces do not request tracker data.

## Remaining launch gates

The feature build is not being confused with operational launch readiness. Remaining work is production and validation: production-grade shared persistence/provider deployment, live WebDAV/Nextcloud testing, production CORS configuration, retention/deletion operations, moderation operations, final Safari iOS/Chrome Android/desktop testing, final support/privacy contact details, deployment verification and NijRitu domain/trademark clearance.

## Next major milestone

The next major feature family is **platform interoperability**. Current research shows a split in the privacy-first space: some products remain strictly device-only, while others use Apple Health and/or Android Health Connect as optional OS-owned data boundaries. NijRitu should follow the latter only where the integration strengthens user control rather than creating a new NijRitu data silo.

The intended rule is strict: platform sync must be opt-in, granular, local/native where possible, reversible, transparent about read/write scope, and never required for core tracking. No server-side mirror of a user's cycle history should be introduced merely to make platform sync convenient.

Native packaging should follow only if the PWA proves useful. Donation support can be added independently without subscriptions, advertising or paid access to core tracking.
