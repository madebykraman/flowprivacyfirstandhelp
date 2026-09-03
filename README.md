# NijRitu

**Your cycle. Your data. Your choice.**

NijRitu / निजऋतु is a free, local-first cycle tracker built around a simple boundary: the product should provide the utility without requiring the company behind it to own a person's private health history.

## Current feature build: V0.7

V0.4, V0.5, V0.6 portability and the V0.7 experience layer are implemented.

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
- Editorial product redesign with responsive layouts and calmer information hierarchy
- Dedicated origin story and support experience
- Persistent support footer across the product
- Automated cycle-engine and backend contract tests

## Privacy architecture

Private tracker data is stored in the browser's local IndexedDB database. NijRitu does not require an account or send cycle history, symptoms or notes to a NijRitu health backend.

Exports are generated entirely in the browser. CSV and iCalendar exports are files the user explicitly creates. No upload is involved.

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
  story / support pages
```

The public layers never receive private tracker fields. Community anonymity is application-level, not a promise that network infrastructure cannot observe technical metadata.

## V0.7: Experience

The product shell has been rebuilt around editorial hierarchy rather than a dense dashboard of equal-weight cards. The visual system uses a warm neutral field, ink surfaces, restrained vermillion accents, larger typography, softer geometry and much more deliberate spacing. Mobile layouts collapse early instead of forcing narrow multi-column cards.

The new story page explains why NijRitu exists, including the central tension behind the project: making a useful health utility without turning its users' data into the product. The support page keeps the tracker free while allowing voluntary support for development, infrastructure, testing, accessibility and security work.

Payment destinations are intentionally configuration placeholders until the developer supplies the final Buy Me a Coffee and Indian payment links. No fake payment URLs are shipped.

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

The feature roadmap through V0.7 is implemented. Remaining gates are operational: production provider deployment, live storage/provider testing, retention and deletion procedures, moderation operations, final browser/device checks, support/privacy contact details, deployment verification, and NijRitu domain/trademark clearance.

Platform interoperability remains deliberately separate from the experience layer. Future native work includes explicit Apple Health / Health Connect adapters, native packaging only if the PWA proves useful, local encrypted vault improvements and donations.

## Roadmap

**V0.2 → V0.3 → V0.4 → V0.5 → V0.6 → V0.7 → platform interoperability**

### V0.6

- Local data portability
- CSV export of recorded tracker fields
- iCalendar export of recorded period days
- Clear separation between recorded data and predictions

### V0.7

- Major visual and interaction redesign
- Dedicated origin story
- Dedicated voluntary support page
- Persistent support footer
- Payment-link placeholders ready for final destinations
- Privacy-first design retained across all new surfaces

### Later platform interoperability

- Optional Apple Health / Health Connect integrations, explicit opt-in only
- Native wrapper only if the PWA proves useful
- Local encrypted vault improvements
- Donation support without subscriptions or advertising

## Naming

Product name: **NijRitu / निजऋतु**. Trademark and domain clearance should be completed before public launch.

## License

See `LICENSE` for the repository license.
