# Left-Aligned IROS Badge Design

## Goal

Move the official IROS 2026 logo from the upper-right teaser overlay into the left Hero identity column, directly above `WORKSHOP @ IROS 2026`. This creates a single conference-identity group and leaves the teaser image unobstructed.

## Approved Visual Treatment

- Keep the existing official IROS 2026 image and external link.
- Retain a compact light card so the logo's black wordmark remains legible on the dark Hero background.
- Align the card with the left edge of the workshop eyebrow and the Hero title.
- Place the workshop eyebrow 16px below the card.
- Preserve the existing rounded corners, restrained shadow, hover treatment, keyboard focus ring, accessible link label, and image alternative text.

## Responsive Geometry

- Desktop: card width 132px.
- Tablet at 920px and below: card width 112px.
- Mobile at 480px and below: card width 96px.
- The badge stays in the normal Hero content flow at every viewport. It must not use `top` or `right` positioning and must not reserve horizontal space beside the eyebrow.

## Implementation Structure

- Move `.hero__conference-brand` inside `.hero__content`, immediately before `.hero__eyebrow`.
- Group the badge and eyebrow in a small `.hero__identity` container with a vertical layout and consistent spacing.
- Remove the absolute teaser-overlay geometry and the mobile eyebrow width reservation that only existed to avoid the overlay.
- Do not alter the teaser image, workshop copy, metadata, navigation, or other page sections.

## Accessibility and Interaction

- Keep the logo link pointing to `https://2026.ieee-iros.org/` in a new tab with `rel="noreferrer"`.
- Preserve `aria-label="Visit the official IROS 2026 website"` and the `IROS 2026 Pittsburgh` image alternative text.
- Maintain a visible keyboard focus outline and reduced-motion behavior.

## Validation

- Add a structural test proving the logo is inside `.hero__content`, precedes the eyebrow, and is no longer a direct teaser overlay.
- Add scoped CSS assertions for the desktop, tablet, and mobile card widths and the absence of absolute-position geometry.
- Run the full test suite, linter, and production build.
- Inspect the Hero at 1440px, 768px, and 390px widths for alignment, overlap, horizontal overflow, logo legibility, and teaser visibility.
- Push the verified `main` branch and confirm the GitHub Pages deployment and live assets.
