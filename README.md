# NijRitu

**Your cycle. Your data. Your choice.**

NijRitu is a free, local-first cycle tracker built around a simple boundary: the product should provide the utility without requiring the company behind it to own a person's private health history.

## V0.4 build

- Local-first cycle tracking with no tracker account
- Period start detection based on contiguous period episodes
- Daily logging for flow, pain, symptoms and notes
- Calendar with recorded days and estimated period window
- Range-based period editing
- Robust median-based cycle and period baselines
- Cycle, period, symptom and pain insights
- Self mode and partner-cycle mode
- Local custom symptom labels
- Plain JSON export and passphrase-encrypted AES-GCM backups
- Encrypted share files for optional partner transfer
- Browser persistent-storage request where supported
- Versioned backup format and validation
- PWA/offline shell
- Opt-in local reminders with service-worker support where browser capabilities permit
- Source-linked health knowledge
- Privacy display mode and safety boundaries
- Optional encrypted WebDAV/Nextcloud backups
- Optional ciphertext-only NijRitu relay with separate backup access keys and expiry
- Moderated application-level anonymous community submissions and replies
- No ads, analytics SDK, advertising profile or private health-data backend
- Automated cycle-engine and backend contract tests

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
       | optional export / encrypted backup
       v
user-controlled file / storage

SEPARATE PUBLIC LAYERS
  knowledge links
  optional anonymous community
  future professional directory
```

Encrypted backups use Web Crypto AES-GCM with a PBKDF2-SHA-256 derived key. The passphrase is not stored by NijRitu and cannot be recovered by the app. Encryption protects the exported or remote backup; it does not make an unlocked browser database encrypted.

Browser storage is not a permanent backup. Site data can be cleared by browser settings, device settings, private browsing, user action or storage pressure. Persistent storage can be requested where supported, but cannot be guaranteed.

## Partner mode

Partner mode is file-based. A person can create an encrypted share file containing selected cycle data, send that file through a channel they trust, and the recipient can import it locally. No shared NijRitu account is required.

## V0.4 remote backup

Direct WebDAV/Nextcloud backup encrypts the snapshot in the browser before upload. WebDAV credentials are entered for the operation and are not stored by the backup layer.

The optional NijRitu relay stores ciphertext only. Each relay backup receives a separate random access key; only a SHA-256 hash of that key is stored server-side. Relay backups expire after 90 days by default. The relay never receives the encryption passphrase.

The relay is an optional convenience layer, not the strongest ownership model. User-controlled WebDAV/Nextcloud storage remains the preferred destination.

## Community boundary

Community is separate from private tracking. Posts and replies contain only what a person explicitly submits and enter moderation before public display. There are no profiles, follower graphs or direct messages.

Application-level anonymity is not infrastructure-level anonymity. A production deployment may still observe technical metadata such as IP addresses, timestamps and abuse signals. Do not publish names, contact details, medical records or other identifying information.

## Product boundaries

NijRitu provides tracking, organization and estimates. It is not a medical device and does not diagnose or treat conditions.

Predictions are estimates. Fertility-related calculations must never be presented as contraception or medical certainty.

Knowledge cards link to reputable original publishers rather than reproducing their medical content.

Professional listings are a later V0.5 layer and must clearly distinguish verified and unverified status without exposing private tracker data.

## Local preview

The app is a static site and Vercel is not required for development or previewing.

```bash
git clone https://github.com/madebykraman/flowprivacyfirstandhelp.git
cd flowprivacyfirstandhelp
python3 -m http.server 8080
```

Open `http://localhost:8080`.

Do not double-click `index.html` if you want service-worker and PWA behavior. Localhost is a secure context for the relevant browser APIs.

## Launch gate

Before public promotion, complete the operational checks outside the codebase:

- [ ] Confirm domain and trademark clearance for NijRitu
- [ ] Publish the privacy policy and support contact
- [ ] Test current Safari iOS, Chrome Android and desktop browsers
- [ ] Test backup, encrypted backup, import, period editing, reminders and delete flows on fresh devices
- [ ] Verify PWA installation and notification behavior on supported platforms
- [ ] Verify live WebDAV/Nextcloud CORS behavior
- [ ] Verify production relay persistence, expiry and deletion behavior
- [ ] Establish production moderation, abuse handling and retention procedures
- [ ] Review medical source links periodically
- [ ] Complete V0.5 before describing professional-directory features as live

## Roadmap

The roadmap is sequential and binding:

**V0.2 → V0.3 → V0.4 → V0.5 → later platform integrations**

### V0.4

- User-controlled encrypted backup destinations such as WebDAV/Nextcloud
- Provider adapter architecture with ciphertext-only remote storage
- Anonymous community backend with documented metadata and abuse controls
- Anonymous submissions/replies without profiles, follower graph or DMs
- Moderation and retention controls separate from private tracker data

### V0.5

- Community Pro professional directory
- Self-listing workflow
- Qualification and registration fields where applicable
- Verification workflow and clear verified/unverified states
- Public contact/booking links
- Strict separation from private tracker health data

### Later

- Optional Apple Health / Health Connect integrations, opt-in only
- Donation support without subscriptions or advertising
- Native wrapper only if the PWA proves useful

## Naming

Product name: **NijRitu / निजऋतु**.

The name combines the idea of something belonging to oneself with the idea of a season or cycle. Trademark and domain clearance should be completed before public launch.

## License

See `LICENSE` for the repository license.
