# Ritmi Design System

## Design direction

Ritmi should feel like a quiet personal instrument, not a health dashboard.

The product is designed **iPhone first**. Desktop is a development and inspection surface, not the composition the mobile interface is derived from. The phone viewport is the canvas; desktop may receive a wider reading layout only where it improves inspection without changing the core interaction model.

The deliberate structural rule is simple: Ritmi does not treat every feature as a card. Content earns space according to importance.

## Principles

1. Canvas before container. Use whitespace, rules and typography before boxes.
2. One dominant idea per viewport. The current state or next action must be immediately legible.
3. Recorded before estimated. Real user data has stronger visual authority than estimates.
4. One task at a time. Logging, reading and configuration should not compete within the same viewport.
5. Quiet interaction. Controls should feel like tools, not marketing buttons.
6. Editorial hierarchy. Large type, short labels and generous vertical rhythm replace dense explanatory blocks.
7. Mobile is the source composition. Never solve a desktop grid first and squeeze it down later.
8. Privacy is visible but not noisy. Communicate concrete boundaries without filling the interface with badges.
9. Health language is calm and non-diagnostic. Estimates are never certainty or contraception.
10. No visual ornament should compete with the tracking task.

## iPhone-first rules

- Target a 390–430px viewport first.
- Respect `safe-area-inset-top` and `safe-area-inset-bottom`.
- Keep primary controls comfortably tappable, with approximately 44px minimum hit areas.
- Prefer full-width sections and ruled rows over nested cards.
- Avoid horizontal scrolling for core tracking tasks.
- Keep the primary action reachable without forcing the user through a dense toolbar.
- Use bottom navigation only for the small number of top-level destinations that genuinely need persistent access.
- Dialogs and forms behave as bottom sheets on small screens.
- Avoid hover-dependent information or interactions.
- Use `dvh` rather than assuming a fixed mobile browser viewport where full-height composition is needed.
- Preserve readable type and spacing when iOS text-size settings increase content size.

## Visual language

Palette: warm mineral background, near-black ink, muted stone text, restrained vermillion for menstrual state and important actions.

Typography: system sans for controls and utility text; a quiet serif display face for major editorial headings and key statements. No web-font dependency is required.

Geometry: mostly square or minimally rounded structural surfaces. Pills are reserved for compact actions or labels. No decorative card shadows.

Lines: one-pixel hairlines establish sections and rhythm. They replace borders around every object.

Motion: small positional transitions only. Respect `prefers-reduced-motion`.

## Component rules

### Navigation

Use compact bottom navigation on iPhone. The active state is typographic plus a small point or underline, not a large selected tile. Do not turn navigation into a row of floating cards.

### Tracker hero

The current cycle state can occupy most of the first viewport. Use one dominant field, large metric typography and minimal supporting copy. The primary logging action should remain obvious.

### Calendar

The calendar is a field of dates, not a grid of cards. Recorded period days use the menstrual accent and a small marker. Estimated days use quieter treatment. Today gets restrained emphasis.

### Statistics

Use large numerals and ruled rows. Avoid independent metric cards unless a value genuinely needs separate emphasis.

### Forms

Labels sit above quiet controls. Dialogs become sheets on mobile. Group fields by decision rather than by arbitrary grid symmetry.

### Knowledge

Use editorial source rows. Source, title and context should be readable without turning every article into a tile.

### Community

Community should feel like a publication or noticeboard, not a social network. No follower mechanics, engagement counters or profile chrome.

### Privacy

Represent privacy as boundaries: browser, user-selected destination and separate public layers. Avoid absolute anonymity claims.

## Content language

Prefer:

- “Log your day” over “Add daily health data”
- “Mark this as a period day” over “Enable period tracking”
- “Save locally” over “Submit”
- “Your rhythm” over “Your health metrics”
- “Recorded” over “Confirmed”
- “Estimated” over “Predicted” where context allows
- “Begin” over “Create account”
- “Local by default” over repeated privacy marketing badges

Avoid:

- gamification language
- fear-based health copy
- fertility certainty
- medical diagnosis language
- subscription pressure
- vague claims such as “100% anonymous”

## Interaction audit rules

Every release should answer these questions on a real iPhone viewport:

1. Can a first-time user understand what the app is for without reading a long introduction?
2. Can an existing user log today in one obvious path?
3. Can a user distinguish recorded information from estimates at a glance?
4. Can a user find and export their data without hunting through decorative UI?
5. Can a user understand where private data lives and when it leaves the device?
6. Can every primary action be completed by touch without precision tapping?
7. Does the interface remain coherent when there is little or no data?
8. Does the interface remain usable with larger text and reduced motion?

## Competitive lessons

Apple demonstrates restrained health utility. Clue demonstrates clear tracking categories and information hierarchy. Privacy-first products demonstrate that local-first architecture can be a product principle rather than a footnote. Editorial cycle products demonstrate the value of a distinct emotional identity.

Ritmi combines those lessons with a stricter constraint: private tracking must remain useful even if every public/community feature disappears.

## Implementation status

The current visual system is an iPhone-first foundation. Launch Hardening should now validate real task completion, Safari behaviour, accessibility, storage recovery and deployment while preserving the canvas-first hierarchy. New feature work should not reintroduce a dashboard made from equal-weight cards.
