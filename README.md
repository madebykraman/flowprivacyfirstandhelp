# Flow

Free, local-first cycle tracking, knowledge and help.

Flow exists for a simple reason: useful cycle tracking should not require a subscription, and a person's private health history should not need to live in the developer's database.

## Current MVP

- Local-first cycle tracking
- Period start and daily logging
- Cycle history and simple rolling predictions
- Calendar view
- Self or partner-cycle mode
- Local IndexedDB storage
- Export and import of a complete JSON backup
- Browser persistent-storage request
- Offline-capable PWA shell
- Curated health knowledge with attribution and links to original publishers
- Privacy and medical-use boundaries built into the UI

## Privacy architecture

Private tracking data is stored in the browser on the user's device. The MVP has no login, analytics SDK, advertising SDK, personal-health API, or personal-health backend.

The public layers are intentionally separate:

```text
PRIVATE DEVICE
  tracking
  symptoms
  notes
  cycle history
       |
       | optional user-controlled backup
       v
user-selected storage

PUBLIC APP
  knowledge
  community
  professional directory
  help resources
```

The browser is not a permanent backup. Users should export backups when the data matters. Flow can request persistent storage where the browser supports it, but cannot guarantee that a browser will never clear site data.

## Important product boundaries

Flow provides tracking and estimates. It is not a medical device and does not diagnose or treat conditions.

Fertility-related calculations should not be presented as contraception or medical certainty.

Knowledge content is not copied into Flow as a replacement for the original publisher. The project links to reputable sources with attribution.

Community is designed around anonymous submissions rather than profiles, follower graphs or direct messages. The future community backend must never receive private tracker data.

Professional listings will be self-listed unless separately verified. A listing is not automatically an endorsement.

## Roadmap

### V0.1
- [x] Local-first tracker
- [x] Calendar
- [x] Basic cycle predictions
- [x] Daily logging
- [x] Import/export
- [x] PWA/offline shell
- [x] Knowledge links

### V0.2
- [ ] Better cycle statistics
- [ ] Custom symptoms and tags
- [ ] Period editing and multi-day entry
- [ ] Backup encryption
- [ ] Backup schema/version migration
- [ ] Local reminders where platform support allows
- [ ] Better accessibility and keyboard support
- [ ] Automated tests for prediction logic

### V0.3
- [ ] Partner mode with explicit sharing permissions
- [ ] User-controlled encrypted backup targets
- [ ] Offline backup files and restore validation
- [ ] Optional WebDAV/Nextcloud adapter
- [ ] Cloud-provider adapters that send backups directly to the user's provider

### V0.4
- [ ] Anonymous community submissions
- [ ] Anonymous replies
- [ ] Moderation and abuse controls without requiring user profiles
- [ ] Community privacy and retention policy

### V0.5
- [ ] Community Pro directory
- [ ] Professional self-listing
- [ ] Credential fields
- [ ] Verification workflow
- [ ] Contact and booking links

### Later
- [ ] Native mobile wrapper if the PWA proves useful
- [ ] Optional Apple Health / Health Connect integrations, opt-in only
- [ ] More knowledge categories and source search
- [ ] Local encrypted data vault
- [ ] Donation page / Buy Me a Coffee

## Research notes

The architecture follows a local-first approach because IndexedDB provides structured client-side persistence and works without network availability, while service workers can cache application assets for offline use. Browser persistent storage can be requested but is not an absolute guarantee.

Privacy concerns around period tracking are not theoretical. The FTC previously took action against Flo over sharing sensitive health information with analytics providers, and later litigation continued to focus on period and pregnancy data. Research presented through the FTC's PrivacyCon also found that data sharing and user control were major factors in privacy concern. These findings support Flow's data-minimization model.

The product is not trying to compete with paid apps feature-for-feature. The goal is a useful, inspectable hobby project where core functionality remains free.

## Development

This first version is intentionally dependency-light and can be hosted as a static site.

For local development, serve the repository over localhost rather than opening `index.html` directly so the service worker can register.

Example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## License

License to be decided before wider reuse. Do not assume the code is licensed for redistribution until a license file is added.
