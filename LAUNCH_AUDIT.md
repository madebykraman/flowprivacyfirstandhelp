# NijRitu Launch Audit

Last audited: 4 September 2026

## Product contract

NijRitu is a free, privacy-first personal cycle utility. The private tracker must remain useful without an account, subscription, advertising, advertising profile, or NijRitu health-data backend.

Core positioning: **Your cycle. Your data. Your choice.**

The product boundary is intentional: the utility is local-first; public layers are separate and must not weaken private tracking.

## Roadmap gate

Feature implementation has now progressed through **V0.6**. V0.4 remote backup/community, V0.5 Community Pro and V0.6 local data portability are implemented. Platform integrations remain deliberately later work.

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
| Apple Health / Health Connect | Deliberately later |
| Native packaging | Deliberately later |
| Donations | Deliberately later |

## V0.4 / V0.5 verification

CI has successfully executed the V0.5 syntax checks, required-file checks, manifest validation and full cycle/backend test suite. The backend contract covers opaque backup storage, access-key authorization, expiry, CORS rejection, community moderation, replies, reports, professional listing moderation, credential verification and protected moderation endpoints. fileciteturn261file0L2-L10

V0.5 is structurally separated from private tracker data. The public professional endpoint exposes only approved and verified listings, while submissions remain pending until moderation. fileciteturn278file0L2-L2

## V0.6 data portability

V0.6 adds local-only portability rather than sending data to a new service. CSV contains the currently stored date, period, flow, pain, symptoms and notes fields. iCalendar contains recorded period days only and deliberately excludes predictions. The export layer performs browser-side file generation and does not upload tracker data.

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
12. PWA cache is versioned through V0.6.

## Remaining launch gates

The feature build is not being confused with operational launch readiness. Remaining work is production and validation: production-grade shared persistence/provider deployment, live WebDAV/Nextcloud testing, production CORS configuration, retention/deletion operations, moderation operations, final Safari iOS/Chrome Android/desktop testing, support/privacy contact details, deployment verification and NijRitu domain/trademark clearance.

## Next major milestone

The next major feature family is **platform interoperability**, not another arbitrary minor tracker release. That means optional, explicit integrations with Apple Health and Android Health Connect, designed as adapters around the local data model rather than as a reason to move private tracking into a central NijRitu backend.

Native packaging should follow only if the PWA proves useful. Donation support can be added independently without subscriptions, advertising or paid access to core tracking.
