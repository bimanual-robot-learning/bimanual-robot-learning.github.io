# Hero Branding and CFP Legibility Design

## Goal

Improve the workshop landing page in three focused ways without changing its overall visual language:

1. Increase the prominence of “WORKSHOP @ IROS 2026” and “Rethinking Bimanual Manipulation Beyond Single-Arm Policies.”
2. Add the complete official IROS 2026 Pittsburgh logo to the Hero.
3. Improve the readability of the nine Call for Papers topic bullets while preserving equal emphasis across Scale, Structure, and Synthesis.

## Hero layout

Use a balanced brand row above the main “Scaling vs. Structure?” heading. The existing workshop eyebrow remains on the left; the complete IROS 2026 Pittsburgh logo sits on the right in a compact light brand card. The card keeps the official artwork intact, avoids recoloring it, and separates its black wordmark from the dark Hero background.

The brand row is limited to the same visual column as the Hero heading so the logo belongs to the title composition rather than floating over the teaser. The logo must not cover the teaser image. It links to the official IROS 2026 website and includes an accessible label.

The official logo asset will be downloaded from the IROS 2026 website and stored locally in `public/images/iros-2026-logo.png`. The production site will not depend on the external image URL.

## Typography

- Increase the workshop eyebrow from `0.72rem` to `0.82rem` and reduce its letter spacing from `0.12em` to `0.1em`.
- Increase the Hero subtitle from `clamp(1.15rem, 2vw, 1.55rem)` to `clamp(1.3rem, 2.1vw, 1.75rem)`.
- Preserve the main title size and orange/cyan color treatment.
- On small screens, keep the subtitle clearly larger than body text while preventing it from crowding the title and metadata.

## CFP topic cards

Keep the three equal topic cards and their shared blue accent. Increase each list item from `0.8rem` to `0.92rem`, raise the text contrast, and use a line height of `1.55`. Keep the existing padding and raise the desktop minimum height from `360px` to `380px`; no topic receives additional color or visual priority.

The labels, headings, topic text, and nine-item content remain unchanged.

## Responsive behavior

- Desktop: eyebrow and a `148px`-wide logo share a single brand row capped at the Hero heading width.
- Tablet: retain the row and reduce the logo to `138px` wide.
- Mobile at `480px` and below: stack the `128px`-wide logo below the eyebrow, without horizontal overflow; retain the complete official mark.
- CFP cards continue to collapse to one column at the existing breakpoint.

## Accessibility and quality checks

- The logo link receives a descriptive `aria-label`; the image uses meaningful alternative text.
- Keyboard focus remains visible on the logo link.
- The light logo card meets contrast requirements against the dark Hero.
- Automated tests verify the local logo, official link, typography rules, nine topic bullets, and responsive safeguards.
- Run the full test suite, linter, production build, and checks at desktop, tablet, and mobile widths before publishing.

## Scope

This change does not alter workshop facts, submission text, navigation, teaser content, schedule, speaker/organizer data, or the existing Google Site.
