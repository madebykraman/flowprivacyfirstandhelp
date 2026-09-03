# NijRitu Launch Audit

Last audited: 4 September 2026

## Product contract

NijRitu is a free, privacy-first personal cycle utility. The private tracker must remain useful without an account, subscription, advertising, advertising profile, or NijRitu health-data backend.

Core positioning: **Your cycle. Your data. Your choice.**

The product boundary is intentional: the utility is local-first; public layers are separate and must not weaken private tracking.

## Roadmap gate

Feature implementation has progressed through **V0.8**. V0.4 remote backup/community, V0.5 Community Pro, V0.6 local data portability, V0.7 experience work and V0.8 trust/transparency work are implemented.

Apple Health, Android Health Connect and native packaging are deliberately deferred.

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
| Product visual redesign | Implemented |
| Origin story page | Implemented |
| Voluntary support page and persistent footer | Implemented, payment destinations awaiting final links |
| Privacy architecture / data map | Implemented |
| Privacy boundary acceptance tests | Implemented |
| Branded 404 fallback | Implemented |
| Automated cycle-engine/backend CI | Implemented |
| Apple Health / Health Connect | Deferred by product decision |
| Native packaging | Deferred |

## Historical path audit

The existing build remains layered rather than rewritten: core cycle logic remains in `core.js` and `app.js`; V0.3 owns improved cycle metrics and reminders; V0.4 owns encrypted remote backup and the public community boundary; V0.5 owns Community Pro; V0.6 owns local portability; V0.7 owns experience/branding surfaces; V0.8 adds a presentation-only privacy architecture layer.

The V0.7 and V0.8 layers do not move tracker records into a new backend. They wrap presentation and settings surfaces around the existing application path.

## V0.6 data portability

CSV contains the currently stored date, period, flow, pain, symptoms and notes fields. iCalendar contains recorded period days only and deliberately excludes predictions. Export generation is local and does not upload tracker data.

## V0.7 experience

The interface was rebuilt around editorial hierarchy instead of an equal-weight card dashboard. It adds the origin story, voluntary support experience and persistent support footer. Payment destinations remain placeholders until real links are supplied.

## V0.8 trust layer

The privacy architecture surface maps three boundaries: local browser storage, user-selected export/backup destinations and separate public layers. It explicitly lists what is stored locally, what can leave only through an explicit action, and what NijRitu does not require.

A navigation collision found during audit was fixed so the V0.8 trust surface is handled independently from the older V0.7 special-page router.

This layer intentionally contains no tracker-data upload, account system, health-platform connection or new server-side health store.

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
12. PWA cache is versioned through V0.8.
13. Story, support and trust surfaces do not request tracker data.
14. The private client layers are covered by a static privacy-boundary test that rejects remote script loading, network requests and telemetry primitives.
15. Apple Health / Health Connect integration is not present, by deliberate product decision.

## Deployment

The Pages workflow now follows GitHub's current custom-workflow pattern: explicit `pages: write` and `id-token: write` permissions, `configure-pages`, Pages artifact upload and `deploy-pages`. The workflow no longer asks `configure-pages` to enable the Pages site itself, avoiding an unnecessary settings mutation during deployment. GitHub still requires the repository Pages publishing source to be configured for GitHub Actions. citeturn0search0turn0search1

## Remaining launch gates

The feature build is not being confused with operational launch readiness. Remaining work is production and validation: production-grade shared persistence/provider deployment, live WebDAV/Nextcloud testing, production CORS configuration, retention/deletion operations, moderation operations, final Safari iOS/Chrome Android/desktop testing, final support/privacy contact details, deployment verification and NijRitu domain/trademark clearance.

## Next major milestone

Do not add platform integrations merely to increase the feature count. The next work should be launch hardening: browser/device acceptance, accessibility, threat-model documentation, storage and backup recovery testing, moderation operations, support/contact details, and deployment verification.

Apple Health, Android Health Connect and native packaging remain deferred until there is a clear privacy-preserving product reason to revisit them.
