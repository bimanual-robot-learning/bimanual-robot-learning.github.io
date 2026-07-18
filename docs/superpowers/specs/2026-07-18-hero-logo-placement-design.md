# Hero Logo Placement Design

## Goal

Move the complete IROS 2026 Pittsburgh logo out of the Hero title column and present it as an independent conference badge in the teaser’s upper-right area. Preserve the official artwork, existing Hero typography, and responsive readability.

## Problem

The current `hero__brand-row` places “WORKSHOP @ IROS 2026” and the full conference logo side by side. Both elements communicate conference identity at nearly the same visual level, which creates a duplicated brand cluster and interrupts the natural eyebrow → title → subtitle reading sequence.

## Approved placement

Use Option A from the visual comparison: a floating conference badge over the teaser’s upper-right negative space.

The logo link becomes an absolutely positioned child of `.hero`, separate from `.hero__content`. The left content column returns to this sequence:

1. “WORKSHOP @ IROS 2026” eyebrow
2. “Scaling vs. Structure?” title
3. Workshop subtitle
4. Date, time, and location
5. Hero actions

The badge remains above the teaser overlay and below the sticky navigation. It does not participate in title layout or change the teaser crop.

## Responsive geometry

- Desktop above `920px`: `top: 118px`, `right: clamp(32px, 5vw, 88px)`, `width: 148px`.
- Tablet at `920px` and below: `top: 104px`, `right: 22px`, `width: 124px`.
- Mobile at `480px` and below: `top: 96px`, `right: 16px`, `width: 112px`.
- Mobile eyebrow width is capped with `max-width: calc(100% - 132px)` so it cannot enter the badge’s horizontal area.

The badge retains its current light background, padding, rounded corners, shadow, hover state, and orange keyboard focus outline. The complete “IROS 2026 PITTSBURGH” wordmark remains visible at every breakpoint.

## Component changes

- In `App.tsx`, move the existing `.hero__conference-brand` anchor out of `.hero__content` and place it immediately after `.hero__media`.
- Remove `.hero__brand-row`; render `.hero__eyebrow` directly inside `.hero__content`.
- In `App.css`, replace brand-row flow rules with the approved absolute badge geometry and responsive overrides.
- Keep `workshopMeta.conferenceUrl`, the locally hosted logo image, alt text, external-link behavior, and CFP typography unchanged.

## Validation

- Update automated tests to assert that the badge is outside `.hero__content`, remains inside `.hero`, and uses the approved desktop/tablet/mobile position values.
- Confirm the Hero has no horizontal overflow at `1440 × 1000`, `768 × 1024`, and `390 × 844`.
- At all three sizes, verify the badge does not collide with the navigation, eyebrow, title, or key teaser subjects.
- Verify the official link, image alternative text, keyboard focus rule, reduced-motion behavior, full test suite, linter, production build, GitHub Pages workflow, and deployed asset.

## Scope

This change affects only the IROS logo’s Hero placement. It does not change workshop facts, teaser imagery, title sizes, CFP content, schedule, people data, navigation behavior, or the existing Google Site.
