# NijRitu

**Your cycle. Your data. Your choice.**

NijRitu is a free, local-first cycle tracker built around a simple boundary: the product should provide the utility without requiring the company behind it to own a person's private health history.

## Current feature build: V0.6

V0.4, V0.5 and the first V0.6 portability layer are implemented.

- Local-first cycle tracking with no tracker account
- Period start detection, calendar, estimates and insights
- Daily flow, pain, symptoms and notes
- Custom symptoms and range-based period editing
- Plain JSON and passphrase-encrypted AES-GCM backups
- Encrypted partner share files
- User-controlled WebDAV/Nextcloud encrypted backups
- Optional ciphertext-only relay backups with separate access keys and expiry
- PWA/offline shell and opt-in best-effort reminders
- Source-linked health knowledge
- Privacy display and medical safety boundaries
- Moderated community without profiles, follower graphs or DMs
- Community Pro professional directory
- Professional self-listing, credential details, moderation and verified status
- Public website/booking and contact links
- Local CSV export for analysis
- Local iCalendar export for recorded period days
- Automated cycle-engine and backend contract tests

## Privacy architecture

Private tracker data is stored in the browser's local IndexedDB database. NijRitu does not require an account or send cycle history, symptoms or notes to a NijRitu health backend.

V0.6 data exports are generated entirely in the browser. CSV and iCalendar exports are files the user explicitly creates. No upload is involved.

Encrypted backups use Web Crypto AES-GCM with PBKDF2-SHA-256 key derivation. The passphrase is never stored. Remote relay storage receives ciphertext only and uses a separate access key whose hash is stored server-side.

```text
PRIVATE DEVICE
  profile / period logs / symptoms / notes / cycle history
       |
       | optional export or encrypted backup
       v
user-controlled file / storage

SEPARATE PUBLIC LAYERS
  knowledge links
  anonymous community
  Community Pro directory
```

The public layers never receive private tracker fields. Community anonymity is application-level, not a promise that network infrastructure cannot observe technical metadata.

## Community Pro

Professionals can submit a public listing with name, role or qualification, specialties, service area, credential details and optional public contact links. Listings remain pending until moderation. Verification is a separate moderator action and means the submitted credential evidence was reviewed; it is not a guarantee of treatment quality, outcome or availability.

## V0.6: Data portability

The next layer is deliberately portability-first rather than immediately jumping to native health-platform APIs. Users can now export tracker history to CSV and recorded period days to iCalendar locally. This establishes a transparent, inspectable data boundary before any future Apple Health or Health Connect integration.

The iCalendar export includes recorded period days only. It never exports predicted dates as facts.

## Product boundaries

NijRitu provides tracking, organization and estimates. It is not a medical device and does not diagnose or treat conditions. Predictions are estimates and must not be treated as contraception or medical certainty.

Knowledge cards link to reputable original publishers rather than reproducing medical content.

## Development

Requires Node.js 20+.

```bash
npm test
npm run check
python3 -m http.server 8080
```

Open `http://localhost:8080`. Use a local HTTP server rather than double-clicking `index.html` when testing PWA and service-worker behavior.

## Launch gate

The feature roadmap through V0.6 is implemented. Remaining gates are operational: production provider deployment, live storage/provider testing, retention and deletion procedures, moderation operations, final browser/device checks, support/privacy contact details, deployment verification, and NijRitu domain/trademark clearance.

Future platform work remains intentionally separate: native Apple Health / Health Connect integration, native packaging, local encrypted vault improvements and donations.

## Roadmap

**V0.2 → V0.3 → V0.4 → V0.5 → V0.6 → platform integrations**

### V0.6

- Local data portability
- CSV export of recorded tracker fields
- iCalendar export of recorded period days
- Clear separation between recorded data and predictions
- Foundation for future platform adapters without requiring platform access

### Later platform integrations

- Optional Apple Health / Health Connect integrations, explicit opt-in only
- Native wrapper only if the PWA proves useful
- Local encrypted vault improvements
- Donation support without subscriptions or advertising

## Naming

Product name: **NijRitu / निजऋतु**. Trademark and domain clearance should be completed before public launch.

## License

See `LICENSE` for the repository license.
