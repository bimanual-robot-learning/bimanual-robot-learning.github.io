# CFP Submission Guidelines

## Goal

Make the Call for Papers submission requirements explicit, easy to scan, and visually consistent with the workshop website. Preserve the workshop's existing facts and welcoming academic tone while clarifying review, format, length, and appendix requirements.

## Scope and Placement

Replace the current submission panel with one structured guidance card placed after the three CFP topic cards and before the Awards and Important Dates row.

The change is limited to the submission guidance content and its presentation. It does not change CFP topics, awards, important dates, submission deadlines, schedule content, OpenReview destination, or any other section of the site.

## Approved Copy

The guidance card uses the following copy:

- Eyebrow: `Submission format`
- Title: `Short papers & extended abstracts`
- Introduction: `We welcome short papers and extended abstracts describing ongoing or completed work.`
- Review: `Submissions will undergo double-blind review. Authors must anonymize their manuscripts.`
- Format: `Use the standard IEEE conference paper format.`
- Length: `Submissions must not exceed 4 pages, excluding references.`
- Appendices: `To keep submissions concise and consistent, we kindly ask authors not to include appendices.`
- Presentation: `Accepted submissions will be presented as posters, with a subset selected for spotlight talks.`

The words `standard IEEE conference paper format` link to the official IEEE Author Center:

`https://conferences.ieeeauthorcenter.ieee.org/write-your-paper/authoring-tools-and-templates/`

The existing OpenReview call to action remains prominent and continues to use the configured OpenReview URL.

## Content Model

Keep all changeable submission content in `src/data/workshop.ts`, rather than hardcoding it in the React component. Use a type-safe structure equivalent to:

```ts
export interface SubmissionGuideline {
  label: 'Review' | 'Format' | 'Length' | 'Appendices'
  description: string
  href?: string
  linkLabel?: string
}

export interface SubmissionInfo {
  eyebrow: string
  title: string
  introduction: string
  guidelines: SubmissionGuideline[]
  presentation: string
}
```

The format guideline carries the official IEEE URL and link label. The presentation statement remains part of the submission data. The OpenReview URL continues to come from the existing workshop metadata.

## Layout and Visual Direction

Use the approved Option A treatment: one cohesive light guidance card within the dark CFP section.

- The card header contains the eyebrow, title, concise introduction, and OpenReview call to action.
- Four rule tiles form a two-by-two grid on desktop: Review, Format, Length, and Appendices.
- Each tile gives its label clear visual hierarchy while keeping the explanatory copy comfortably readable.
- A full-width, cyan-accented band at the bottom highlights the poster and spotlight presentation policy.
- Borders, spacing, typography, cyan accents, and corner treatment reuse the site's established design language.
- The result should read as practical author guidance, not as four competing promotional cards.

On smaller screens, the header and call to action stack naturally and the rule tiles become a single column. The presentation band remains full width. No element may cause horizontal overflow at 390px.

## Semantics and Accessibility

- Render the rule collection as a semantic list or an equivalent grouped structure with descriptive headings.
- Use meaningful visible link text for the IEEE template link.
- Open the IEEE resource in a new tab with `rel="noreferrer"`; preserve the existing external-link behavior for OpenReview.
- Retain clear keyboard focus styles for both links.
- Maintain sufficient contrast for body copy, labels, borders, and the presentation band in the dark CFP section.
- Do not encode rule meaning through color alone.
- Preserve the site's reduced-motion behavior.

## Validation

- Add automated coverage for all four guideline labels and their required copy.
- Verify the IEEE link uses the exact official URL, opens in a new tab, and has the appropriate `rel` attribute.
- Verify the OpenReview call to action and configured destination remain present.
- Verify the presentation statement remains prominent.
- Verify the responsive rule layout is two columns on desktop and one column on mobile.
- Run the complete test suite, linter, and production build.
- Inspect the CFP section at 1440px, 768px, and 390px.
- Confirm readable hierarchy, visible focus states, adequate contrast, and no page-level horizontal overflow.

## Release Boundary

Keep the design and later implementation on `feature/cfp-submission-guidelines` for local review. Do not push, merge, or publish until the user has reviewed the implementation and explicitly approved release.
