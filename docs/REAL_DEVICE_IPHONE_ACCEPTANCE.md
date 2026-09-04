# iPhone Safari Acceptance Record

Status: prepared for physical execution.

Target: iPhone Safari, portrait, 390–430px viewport class.

## Acceptance script

- [ ] Open Ritmi on a clean Safari session.
- [ ] App boot completes without a console/runtime error.
- [ ] Today screen uses the full viewport without horizontal scrolling.
- [ ] Bottom navigation remains reachable above the home indicator.
- [ ] Log a period day and confirm the state survives navigation.
- [ ] Add symptoms, including a custom symptom, and confirm persistence after reload.
- [ ] Open Calendar and History and verify the recorded entry is present.
- [ ] Open Insights and confirm estimates are labelled as estimates.
- [ ] Export JSON and CSV and verify files can be produced.
- [ ] Create an encrypted local backup and restore it with the correct password.
- [ ] Confirm incorrect backup password fails without exposing plaintext data.
- [ ] Open More > Privacy and verify the local-first boundary copy.
- [ ] Exercise reduced-motion behavior with iOS accessibility enabled.
- [ ] Verify icon-only controls expose accessible labels.
- [ ] Install/add to Home Screen and relaunch offline.
- [ ] Confirm the app remains usable when the optional public backend is unavailable.

## Result

NOT RUN IN THIS ENVIRONMENT. This is a physical-device gate and must be signed off on an actual iPhone Safari session before claiming device acceptance.
