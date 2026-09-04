# Ritmi Launch Hardening

Status: launch package complete on `main`.

This document separates repository-complete launch gates from external gates that cannot truthfully be represented as live without third-party credentials, a real device, or legal verification.

## Gate matrix

| Gate | Repository state | Reality |
|---|---|---|
| Production community infrastructure | Staged production-shaped backend contract + demo data path | Not publicly deployed |
| Production professional directory | Staged moderation + verification API | Not publicly deployed |
| Production remote backup | Ciphertext-only backup API + expiry/delete semantics | Not publicly deployed |
| Production moderation operations | Admin-authenticated moderation endpoints + operating checklist | Human moderation team not connected |
| Real-device iPhone Safari acceptance | Acceptance script and pass/fail checklist included | Physical device run still required |
| Final domain/trademark clearance | Legal clearance record template included | Not legally cleared |
| Production privacy/support contact | Privacy/support configuration template included | Production contact/domain still requires owner confirmation |

## Launch decision

The static Ritmi application is launchable as a local-first public web app. The optional network services remain explicitly opt-in and non-operational until a real backend deployment, moderation operator, support contact and legal clearance are supplied.

No placeholder is presented by the application as a real service, credential, legal clearance, or physical-device test.

## Final audit requirements

1. Private tracker data remains browser-local unless the user explicitly exports or backs up encrypted ciphertext.
2. Remote backup endpoints accept ciphertext only.
3. Community submissions are pending until moderation.
4. Professional listings require approval and verification.
5. Admin credentials never belong in frontend code.
6. Public-layer failure must not prevent local tracking.
7. Predictions remain estimates and are not presented as diagnosis, ovulation confirmation, pregnancy determination, or contraception.
8. Service-worker assets match the current launch bundle.
9. Manifest parses as valid JSON and declares standalone portrait-first behavior.
10. CI checks JavaScript syntax, core/privacy/backend tests and required launch files.

## Demo/staging posture

The repository contains enough structure to exercise the public-layer contracts without pretending that a public service exists. Any deployment of the backend must replace the local JSON adapter with durable shared storage and configure real operational controls before being called production.
