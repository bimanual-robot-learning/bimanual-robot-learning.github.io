# Section Lead Hierarchy Refinement

## Goal

Reduce the visual prominence of the five explanatory sentences below section titles while keeping them comfortably readable. These sentences should support the section titles rather than compete with them.

## Scope

The change applies only to `.section-description`, including its inverse treatment in dark sections. It covers the lead sentences for Introduction, Workshop Schedule, Invited Speakers, Call for Papers, and Workshop Organizers.

No copy, DOM structure, section spacing, maximum text width, navigation, schedule content, person cards, or other body typography will change.

## Approved Visual Direction

The approved direction is the restrained editorial treatment shown as Option C in the visual comparison:

- Font size: `clamp(1rem, 1.05vw, 1.0625rem)`
- Font weight: `400`
- Line height: `1.64`
- Light sections: `var(--slate)` (`#5d6d78`)
- Dark sections: `var(--slate-light)` (`#9fb0bc`)
- Maximum width: retain the existing `760px`
- Top margin and responsive layout: retain existing values

The existing slate tokens provide a softer hierarchy than the brighter readable tokens while maintaining normal-text contrast against the current light and dark section backgrounds.

## Implementation

Update the base `.section-description` rule and the `.section-heading--inverse .section-description` color override in `src/App.css`. Do not add section-specific exceptions.

Update the existing typography regression test in `src/App.test.tsx` to require the approved size, weight, line height, and color tokens.

## Validation

- Demonstrate the regression test fails before the CSS change and passes afterward.
- Run the complete test suite, linter, and production build.
- Check the five section leads at 1440px, 768px, and 390px.
- Confirm no page-level horizontal overflow or undesirable orphaned words are introduced.
- Confirm the leads remain readable but are visually subordinate to their section titles.
- Preserve existing keyboard focus and reduced-motion behavior.

## Release Boundary

Keep the work on the existing `feature/typography-readability` branch for local review. Do not push or publish without explicit user approval.
