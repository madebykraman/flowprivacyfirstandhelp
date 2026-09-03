# NijRitu

**Your cycle. Your data. Your choice.**

NijRitu is a free, local-first cycle tracker and health utility built around a simple principle: useful personal health software should not require the company behind it to own your private health history.

## V0.2

- Local-first cycle tracking
- Period start and daily logging
- Calendar and simple rolling predictions
- Self or partner-cycle mode
- Local IndexedDB storage
- Browser persistent-storage request
- Complete JSON export/import backups
- Backward-compatible import of Flow V0.1 backups
- Curated knowledge with links to original publishers
- Anonymous-community architecture kept separate from private tracking
- PWA/offline shell

## Privacy architecture

Private tracking data is stored in the browser's local IndexedDB database on the user's device. The tracker has no login, advertising SDK, analytics SDK, personal-health API or personal-health backend.

```text
PRIVATE DEVICE
  profile
  period logs
  symptoms
  notes
  cycle history
       |
       | optional user-controlled backup
       v
user-selected storage

SEPARATE PUBLIC LAYERS
  knowledge
  anonymous community
  professional directory
  help resources
```

The browser is not a permanent backup. Site data can be cleared by the browser, device settings, private browsing, user action or storage pressure. NijRitu can request persistent storage where supported, but cannot guarantee retention. Export a backup when the information matters.

## Product boundaries

NijRitu provides tracking and estimates. It is not a medical device and does not diagnose or treat conditions.

Fertility-related calculations must never be presented as contraception or medical certainty.

Knowledge content links to reputable original publishers rather than replacing their work with copied medical content.

Community is intentionally separate from private tracking. Future community infrastructure must never receive private tracker data.

Professional listings are self-listed unless a separate verification workflow says otherwise. A listing is not automatically an endorsement.

## Development

The project is intentionally dependency-light and can run as a static site.

Serve it over localhost rather than opening `index.html` directly so the service worker can register:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

For an exact version, use Git history:

```bash
git log --oneline
git switch --detach <commit>
python3 -m http.server 8080
```

Return to the current build with:

```bash
git switch main
git pull
```

Vercel is not required for development or previewing.

## Roadmap

### V0.2
- [x] Local-first tracker
- [x] Calendar
- [x] Basic cycle predictions
- [x] Daily logging
- [x] Import/export
- [x] PWA/offline shell
- [x] Knowledge links
- [x] NijRitu brand foundation
- [x] Flow backup compatibility

### V0.3
- [ ] Better cycle statistics
- [ ] Custom symptoms and tags UI
- [ ] Period editing and multi-day entry
- [ ] Encrypted backups
- [ ] Backup schema/version migration
- [ ] Local reminders where platform support allows
- [ ] Better accessibility and keyboard support
- [ ] Automated prediction tests
- [ ] Explicit partner sharing permissions

### V0.4
- [ ] User-controlled encrypted backup destinations
- [ ] WebDAV/Nextcloud adapter
- [ ] Cloud-provider adapters that transfer backups directly to the user's provider
- [ ] Anonymous community submissions
- [ ] Anonymous replies
- [ ] Moderation and abuse controls without profiles

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
- [ ] Donation page

## Naming

Working product name: **NijRitu / निजऋतु**.

The name combines the idea of something belonging to oneself with the idea of a season or cycle. Trademark and domain clearance should be completed before public launch.

## License

License to be decided before wider reuse. Do not assume the code is licensed for redistribution until a license file is added.
