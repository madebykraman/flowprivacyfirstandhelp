# Ritmi

**Your cycle. Your data. Your choice.**

Ritmi is a free, local-first cycle tracker designed around a simple boundary: useful private tracking should not require the company behind the product to own a person's health history.

## Current state

The product is in **Launch Hardening**. The V0.2–V0.8 product architecture is present in the repository, and the current work is focused on making the existing experience safe, coherent, accessible and deployable rather than adding another feature wave.

The private tracker is designed to work without a tracker account or private-health backend. Private records are kept in browser storage. Exports and backups are user initiated.

Current client capabilities include:

- local cycle and period tracking
- calendar with recorded and estimated states kept visually distinct
- daily flow, pain, symptoms and notes
- custom symptom labels
- cycle history and simple pattern insights
- JSON data export/import
- browser-side encrypted backup/share flows
- PWA/offline shell and optional best-effort reminders
- source-linked health knowledge
- privacy and medical-safety boundaries
- a separate, deliberately constrained community surface
- a separate professional-directory architecture
- local data portability work, including CSV/iCalendar surfaces
- privacy architecture and trust-boundary documentation
- mobile-first visual system and branded fallback page
- automated cycle-engine, backend and privacy-boundary tests

Some roadmap surfaces are intentionally not treated as production-ready merely because their UI or architecture exists. Remote storage providers, community operations, professional verification, payment destinations and production operational procedures remain launch gates until they are configured, tested and documented.

## Privacy architecture

Private tracker records live in the browser's local IndexedDB database. Ritmi does not require a tracker account and the private tracker is not dependent on a health-data backend.

Exports are generated locally. A remote destination is only involved when the user explicitly chooses a backup or sharing mechanism. Browser-side encryption is used for encrypted backup/share payloads so the intended remote storage layer does not need the private tracker fields in plaintext.

```text
PRIVATE DEVICE
  profile / period logs / symptoms / notes / cycle history
       |
       | explicit export / encrypted backup / encrypted share
       v
user-selected destination

SEPARATE PUBLIC LAYERS
  knowledge links
  community
  professional directory
  story / support
```

Community privacy is an application-level design boundary, not a promise that network infrastructure can observe zero technical metadata.

## Product boundaries

Ritmi provides tracking, organization and estimates. It is not a medical device and does not diagnose or treat conditions. Estimates are not medical certainty and must not be used as contraception.

Health knowledge links point to original publishers rather than presenting Ritmi as a medical authority.

The private tracker must remain useful even if every public/community feature is disabled.

## Design direction

Ritmi is an iPhone-first utility, not a desktop dashboard compressed into a phone. The mobile composition uses the viewport as the canvas, with one dominant task at a time, strong typography, hairline sectioning and restrained controls instead of a wall of equal-weight cards.

The visual language is warm mineral neutrals, near-black ink and restrained vermillion, with system typography and a quiet serif display treatment. Privacy is communicated through concrete boundaries rather than repeated marketing badges.

See `DESIGN_SYSTEM.md` for the working design rules.

## Development

Requires Node.js 20+.

```bash
npm test
npm run check
python3 -m http.server 8080 --bind 0.0.0.0
```

Open the local HTTP server rather than double-clicking `index.html` when testing PWA and service-worker behaviour.

## Launch hardening gates

Before public launch, the remaining gates include:

- production deployment verification
- real Safari iOS acceptance testing, including install, storage, dialogs, navigation and offline behaviour
- Chrome/Android and desktop acceptance checks
- accessibility acceptance and keyboard/screen-reader review
- backup recovery testing across fresh browser sessions
- threat-model and privacy-boundary review
- production storage/provider configuration where applicable
- retention and deletion procedures for any server-backed public layer
- community moderation operations
- professional-directory verification operations
- support and privacy contact details
- final domain and trademark clearance

The GitHub Pages workflow is configured for **GitHub Actions** publishing. A successful Actions deployment is the source of truth for live status; a workflow file alone is not treated as proof that the site is live.

## Deliberately deferred

Apple Health, Android Health Connect and native packaging are intentionally deferred. They should only return when there is a clear privacy-preserving product reason and a demonstrated need beyond the PWA.

## Roadmap

**V0.2 → V0.3 → V0.4 → V0.5 → V0.6 → V0.7 → V0.8 → Launch Hardening**

The earlier roadmap introduced local tracking, richer logging, encrypted/user-controlled backup architecture, community/professional-directory boundaries, data portability, the visual redesign and the privacy/trust layer. Launch Hardening is now about validating those boundaries in real browsers and real operational conditions.

## Naming

Current working product name: **Ritmi**.

This name remains a product-development name until final domain and trademark clearance is completed. The old internal storage identifier is intentionally not renamed casually because changing it without migration could strand existing local data.

## License

See `LICENSE` for the repository license.
