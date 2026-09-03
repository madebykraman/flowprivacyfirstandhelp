# NijRitu Design System

## Design direction

NijRitu should feel like a quiet personal instrument, not a health dashboard.

The interface takes cues from the strongest ideas in current cycle tracking: Apple's restrained health utility model, Clue's science-forward clarity, privacy-first local products such as Ovumcy, and the more editorial/ritual visual language seen in Stardust. Research on menstrual-tracking UX consistently points toward simplicity, personal context and respect for the sensitivity of the data. citeturn0search1turn0search3turn0search4

The deliberate departure is structural: NijRitu does not treat every feature as a card. The page is the canvas. Content earns space according to importance.

## Principles

1. Canvas before container. Sections use whitespace, rules and typography before boxes.
2. One dominant idea per viewport. The current state should be immediately legible.
3. Recorded before predicted. Real user data has stronger visual authority than estimates.
4. Quiet interaction. Controls should feel like tools, not marketing buttons.
5. Editorial hierarchy. Large type, short labels and generous vertical rhythm replace dense explanatory blocks.
6. Privacy is visible but not noisy. The product communicates the boundary without covering the interface in badges.
7. Mobile is a first-class composition. It is not a desktop grid squeezed into a phone.
8. Health language is calm and non-diagnostic. Predictions are estimates, never certainty or contraception.

## Visual language

Palette: warm mineral background, near-black ink, muted stone text, restrained vermillion for menstrual state and important actions.

Typography: system sans for controls and utility text; a quiet serif display face for major editorial headings and key statements. This creates distinction without adding a web-font dependency or tracking surface.

Geometry: mostly square or minimally rounded structural surfaces. Pills are reserved for actions and compact navigation. No decorative card shadows.

Lines: one-pixel hairlines establish sections and rhythm. They replace borders around every object.

Motion: small positional transitions only. Respect `prefers-reduced-motion`.

## Component rules

### Navigation

Use a compact dark floating navigation rail on mobile and desktop. Active state is typographic plus a small point, not a large selected tile.

### Hero

The primary tracker state can occupy most of the viewport. Use one dark field for the dominant moment, large metric typography, and minimal supporting copy.

### Calendar

The calendar is a field of dates, not a grid of cards. Period days use vermillion typography and a small marker. Predicted days use a quieter rule. Today uses a hairline emphasis.

### Statistics

Use large numerals and ruled rows. Avoid metric cards unless a value genuinely needs independent emphasis.

### Forms

Forms use labels above quiet underlined controls. Dialogs behave like sheets of paper rather than rounded application cards.

### Knowledge

Knowledge content uses editorial lists and article rows. Source, title and short context should be visible without turning each article into a tile.

### Community

Community should feel like a publication or noticeboard, not a social network. No follower mechanics, engagement counters or profile chrome.

### Privacy

The privacy architecture is represented as a flow of boundaries: browser, user-selected storage, separate public layers. Avoid claiming absolute anonymity.

## Content language

Prefer:

- "Log your day" over "Add daily health data"
- "Mark this as a period day" over "Enable period tracking"
- "Save locally" over "Submit"
- "Your rhythm" over "Your health metrics"
- "Recorded" over "Confirmed"
- "Estimated" over "Predicted" where context allows
- "Begin" over "Create account"
- "Local by default" over a persistent privacy marketing badge

Avoid:

- gamification language
- fear-based health copy
- fertility certainty
- medical diagnosis language
- subscription pressure
- vague claims such as "100% anonymous"

## Competitive lessons

Apple demonstrates the value of making cycle tracking part of a broader health utility without turning the interaction into a social feed. Clue demonstrates clear tracking categories and an information-first approach. Privacy-first projects such as Ovumcy demonstrate that local-first architecture can be a product principle rather than a footnote. Stardust demonstrates the power of a distinct emotional visual identity, while its category also shows why privacy claims need to be backed by concrete boundaries. citeturn0search1turn0search3turn0search9turn0search10

NijRitu combines those lessons with a stricter constraint: private tracking should remain useful even if the public/community parts of the product disappear.

## Implementation status

V0.8 implements the first complete editorial pass across the application shell, tracker surfaces, calendar, forms, story, support and privacy architecture. The next hardening pass should preserve this visual system while validating accessibility, device behaviour and real-world task completion.
