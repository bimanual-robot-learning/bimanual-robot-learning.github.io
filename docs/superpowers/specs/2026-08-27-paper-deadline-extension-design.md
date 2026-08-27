# Paper Submission Deadline Extension Design

## Goal

Update the workshop homepage to communicate the extended paper submission
deadline without erasing the previously advertised deadline.

## Scope

- Keep the existing `Submission deadline` row in the Call for Papers
  `Important Dates` panel.
- Render the previous deadline, `August 24, 2026 · 11:59 PM AOE`, on the first
  line with semantic deleted-text markup.
- Render the new deadline, `August 27, 2026 · 11:59 PM AOE`, on the second line.
- Preserve the existing monospaced date typography for both lines. The previous
  deadline will use a subdued color and a visible strikethrough; the new
  deadline will retain the normal high-contrast date treatment.
- Leave the acceptance-notification and camera-ready dates unchanged.
- Do not modify Challenge dates or either leaderboard.

## Data Model

Extend only the submission entry in `importantDates` with an optional previous
value while keeping the current value as the canonical active deadline. Other
date entries remain simple current-value entries. This keeps the extension
explicit in the typed data instead of embedding date-specific conditions in the
component.

## Rendering

The Important Dates component will render an optional previous value inside a
semantic `<del>` element before the current value. Each value will be placed on
its own line inside the existing `<dd>`, so the layout remains readable on both
desktop and mobile. A scoped CSS class will style the previous value without
changing the typography of unrelated dates.

## Accessibility

Using `<del>` communicates that the old deadline is no longer current to
assistive technologies as well as visually. The new deadline remains plain text
immediately after it, preserving a clear reading order: old deadline, then new
deadline.

## Tests

Add a focused homepage test that verifies:

- the old deadline is present inside a `<del>` element;
- the new deadline is present in the same `Submission deadline` row;
- the acceptance-notification and camera-ready dates remain unchanged.

Run the complete test suite, linter, and production build before previewing or
publishing.
