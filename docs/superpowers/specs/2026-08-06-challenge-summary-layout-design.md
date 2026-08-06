# Challenge Homepage Summary Layout Design

## Objective

Reorganize the homepage Challenge section so that visitors immediately recognize it as a challenge, can find the participation destinations near the introduction, and can understand the evaluation process and schedule without parsing several visually similar card groups.

The homepage will function as a concise Challenge summary and entry point. The standalone `/challenge/` page remains the destination for future detailed rules, dataset documentation, submission instructions, and leaderboard content.

## Confirmed Information Hierarchy

The Challenge section will use this order:

1. Challenge identity and sponsor
2. Introduction
3. Participation destinations
4. Evaluation Format and Challenge Timeline
5. Household Manipulation Tasks
6. Challenge Prize Pool

The existing three-item facts strip will be removed. Its useful information will be communicated in the introduction and task section instead.

## Title

The visible and accessible title is:

> Real-World Household Bimanual Manipulation Challenge

It remains one semantic `h2`. On desktop, the title is deliberately arranged as two lines:

1. `Real-World Household`
2. `Bimanual Manipulation Challenge`

Every word uses the same font size, weight, and line-height. Only `Challenge` uses the orange accent color. The previous `Towards Bimanual Intelligence:` lead is removed.

The desktop design should retain the intended two-line composition when the content width permits. Tablet and mobile layouts may wrap naturally to avoid clipping or horizontal overflow; they must not reduce only part of the title to a smaller typographic tier.

The section index becomes `05 / Workshop Challenge` to reinforce that this is a challenge within the workshop rather than an IROS-wide challenge track.

## Introduction

The introduction retains its current meaning and paragraph structure:

> This challenge focuses on real-world bimanual manipulation in household environments. Participants train on thousands of hours of real-robot teleoperation and UMI data spanning diverse household tasks, with the freedom to design their own data mixtures and training strategies.

Within the paragraph, `thousands of hours` and `teleoperation and UMI data` receive restrained bold emphasis. The emphasis should improve scanning without turning the phrases into links, badges, or separate statistics.

The sponsor line remains directly beneath the title:

> Designed and sponsored by PrimeBot

## Participation Destinations

A distinct dark participation module appears immediately after the introduction. Its purpose is to separate actionable destinations from informational content.

The module contains:

- Eyebrow: `Get started`
- Heading: `Participate in the Challenge`
- Supporting copy: `The full rules, dataset documentation, submission instructions, and leaderboard will live on the challenge website.`

It presents three destinations:

1. `Explore Challenge Details` — an active, visually primary link to `/challenge/`
2. `Dataset` — `Coming Soon` until a URL is configured
3. `Evaluation Portal` — `Coming Soon` until a URL is configured

The primary challenge-details link uses a cyan filled treatment within the dark module. Unavailable resources remain visually subordinate and non-interactive. When a resource becomes available, the existing configuration-driven status should allow it to render as a link without restructuring the component.

This module replaces the resources block currently nested at the bottom of Challenge Timeline.

## Evaluation and Timeline

Evaluation Format and Challenge Timeline become two equal-width columns within a shared logistics grid, similar in hierarchy to the paired content used in the Call for Papers section.

### Evaluation Format

The left column uses primarily text and dividers rather than nested stage cards or a diagram:

1. `Online Evaluation` — `Submit trained models through the online evaluation portal.`
2. `Real-Robot Evaluation` — `Up to five top-performing entries advance to household task evaluation.`

The final-ranking statement appears beneath the two steps in the same panel:

- Label: `Final ranking`
- Formula: `Online evaluation score + final real-robot evaluation score.`
- Note: `Detailed scoring protocols will be announced before online evaluation opens.`

The former connector arrow is removed because the numbered order and text already communicate progression.

### Challenge Timeline

The right column lists all five milestones with dates:

- Sample Data Release — August 7, 2026 · 11:59 PM AOE
- Full Dataset Release — August 11, 2026 · 11:59 PM AOE
- Online Evaluation Opens — August 25, 2026 · 11:59 PM AOE
- First Real-World Evaluation — September 11, 2026
- Final Real-World Evaluation — September 21, 2026

The timeline uses a compact text list with row dividers and right-aligned dates on desktop. It does not contain the resource destinations.

Both columns share the current light cyan Challenge styling and equal visual weight. On narrow screens, they stack vertically with Evaluation Format first and Challenge Timeline second.

## Content Retained Below Logistics

The four Household Manipulation Tasks remain on the homepage with their current names and descriptions because they are core Challenge information and the standalone Challenge page is not yet complete.

The Challenge Prize Pool remains visually prominent and unchanged in meaning:

- 1st Place — USD 1,000
- 2nd Place — USD 500
- 3rd Place — USD 500

Challenge organizers and their institutions remain unchanged from the previously approved design.

## Responsive Behavior

- Desktop: the title targets two deliberate lines; participation destinations use three columns; Evaluation and Timeline use two equal columns.
- Tablet: the title may wrap as needed; participation destinations may remain three columns if readable or stack based on the existing breakpoint; Evaluation and Timeline remain legible without horizontal overflow.
- Mobile: participation destinations stack; Evaluation and Timeline stack; dates may move below labels; all title words retain a common typographic scale even when the title occupies additional lines.
- Existing reduced-motion behavior remains unchanged.

## Accessibility and Semantics

- Keep a single `h2` for the complete Challenge title.
- Use semantic links only for destinations that are available.
- Keep unavailable Dataset and Evaluation Portal entries out of keyboard focus.
- Preserve visible focus styles for the active Challenge Details link and future resource links.
- Maintain logical heading order: Challenge `h2`, module and content `h3`, item headings `h4`.
- Bold introduction phrases remain plain text emphasis and must not be announced as links or controls.

## Configuration and Component Boundaries

The Challenge section remains configuration-driven.

- Replace the previous split title fields with data that supports two equal-scale lines and an inline accent on `Challenge` without duplicating the accessible title.
- Preserve the current resource status model so URLs can be enabled later.
- Remove the facts array from rendered output. It may be removed from the configuration if no other code consumes it.
- Group Evaluation and Timeline in a dedicated layout wrapper while keeping each as an independent semantic section.

The standalone `/challenge/` Coming Soon page is outside this change and must remain functional.

## Validation

Automated tests should verify:

- the old `Towards Bimanual Intelligence:` title is absent from the homepage Challenge section;
- the complete new title remains one `h2`, uses equal-scale title segments, and accents only `Challenge`;
- the two emphasized introduction phrases are present;
- the facts strip is absent;
- `Explore Challenge Details` links to `/challenge/`;
- Dataset and Evaluation Portal remain non-interactive while marked `Coming Soon`;
- the participation module precedes the logistics grid;
- Evaluation and Timeline occupy two equal desktop columns and stack on mobile;
- the Evaluation connector arrow is absent;
- all evaluation text, dates, tasks, prizes, and organizer institutions remain correct;
- `/challenge/` still builds and renders.

Visual acceptance should cover 1440 px, 768 px, and 390 px viewports, checking title wrapping, action hierarchy, text readability, focus states, and horizontal overflow.
