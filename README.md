# NijRitu

**Your cycle. Your data. Your choice.**

NijRitu is a free, local-first cycle tracker built around a simple boundary: the product should provide the utility without requiring the company behind it to own a person's private health history.

## V1.1 hardened core

- Local-first cycle tracking with no tracker account
- Period start and daily logging for flow, pain, symptoms and notes
- Calendar with recorded days and estimated period window
- Baseline cycle and period settings with bounded inputs
- Simple cycle history and consistency insights
- Self mode and partner-cycle mode
- Local custom symptom labels
- Encrypted AES-GCM backups using a passphrase-derived key
- Plain JSON export for portability
- Encrypted share files for optional partner transfer
- Browser persistent-storage request where supported
- Import validation and versioned backup format
- PWA/offline shell
- Source-linked health knowledge from established publishers
- Help and safety boundaries
- Private display mode
- No ads, analytics SDK, advertising profile or personal-health backend
- Repository quality workflow for syntax and required-file checks

## Privacy architecture

Private tracker data is stored in the browser's local IndexedDB database on the user's device. NijRitu does not require an account or send cycle history, symptoms or notes to a NijRitu health backend.

```text
PRIVATE DEVICE
  profile
  period logs
  symptoms
  notes
  cycle history
       |
       | optional encrypted or plain export
       v
user-controlled file / storage

SEPARATE PUBLIC LAYERS
  knowledge links
  future anonymous community
  future professional directory
```

Encrypted backups use Web Crypto AES-GCM with a PBKDF2-SHA-256 derived key. The passphrase is not stored by NijRitu and cannot be recovered by the app. Encryption protects the exported file; it does not make an unlocked browser database encrypted.

Browser storage is not a permanent backup. Site data can be cleared by the browser, device settings, private browsing, user action or storage pressure. Persistent storage can be requested where supported, but cannot be guaranteed. Export when the information matters.

## Partner mode

Partner mode is intentionally file-based. A person can create an encrypted share file containing selected cycle data, send that file through a channel they trust, and the recipient can import it locally. No shared NijRitu account is required.

This avoids silently creating a central health-data database. A future live sync feature should preserve the same rule: the NijRitu service must not receive plaintext private health history.

## Product boundaries

NijRitu provides tracking, organization and estimates. It is not a medical device and does not diagnose or treat conditions.

Predictions are estimates. Fertility-related calculations must never be presented as contraception or medical certainty.

Knowledge cards link to reputable original publishers rather than reproducing their medical content.

The public Community and Community Pro layers are not enabled as server-backed features in the current static build. They will only ship when their identity, moderation, metadata and retention model can be documented honestly without weakening the private tracker.

Professional listings must be clearly distinguished from verified listings and are not automatically endorsements.

## Local preview

The app is a static site and Vercel is not required for development or previewing.

```bash
git clone https://github.com/madebykraman/flowprivacyfirstandhelp.git
cd flowprivacyfirstandhelp
python3 -m http.server 8080
```

Open `http://localhost:8080`.

Do not double-click `index.html` if you want the service worker and PWA behavior. Localhost is a secure context for the relevant browser APIs.

For a historical version:

```bash
git log --oneline
git switch --detach <commit>
python3 -m http.server 8080
```

Return to the current build:

```bash
git switch main
git pull
```

## Launch checklist

Before public promotion, complete the operational items outside the static codebase:

- [ ] Confirm domain and trademark clearance for NijRitu
- [ ] Publish the privacy policy and support contact
- [ ] Test the app on current Safari iOS, Chrome Android and desktop browsers
- [ ] Test backup, encrypted backup, import and delete flows on fresh devices
- [ ] Verify PWA install behavior on supported platforms
- [ ] Review all medical source links periodically
- [ ] Keep public community disabled until its backend privacy model is ready

## Roadmap after the hardened core

- User-controlled encrypted backup destinations such as WebDAV/Nextcloud
- Local reminders where browser/platform support permits
- Optional Apple Health / Health Connect integrations, opt-in only
- Anonymous community with documented metadata and abuse controls
- Community Pro professional directory and verification workflow
- Donation support without subscriptions or advertising
- Native wrapper only if the PWA proves useful

## Naming

Product name: **NijRitu / निजऋतु**.

The name combines the idea of something belonging to oneself with the idea of a season or cycle. Trademark and domain clearance should be completed before public launch.

## Audit log

See `LAUNCH_AUDIT.md` for the preserved product contract, privacy checks, implemented scope, deliberate launch boundaries and operational gate.

## License

See `LICENSE` for the repository license.
