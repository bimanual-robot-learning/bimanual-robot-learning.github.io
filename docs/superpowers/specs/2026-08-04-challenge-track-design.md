# Real-World Household Manipulation Challenge Track — Design Specification

## Purpose

Add a Challenge Track to the IROS 2026 Bimanual Robot Learning Workshop website
without diluting the existing Workshop identity or turning the landing page into
a technical manual. The main website will introduce the challenge, explain how
to participate, make the prize pool and dates prominent, and provide stable
entry points for dataset and evaluation resources as they become available.

The official Challenge title is:

> Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge

The Challenge is designed and sponsored by PrimeBot.

## Information Architecture

Use a hybrid architecture:

1. The Workshop landing page remains the promotional overview and contains the
   Challenge identity, overview, evaluation flow, household tasks, prize pool,
   important dates, resource status, and organizers.
2. A future `/challenge/` page will become the authoritative source for detailed
   evaluation protocols, eligibility, submission instructions, FAQs,
   leaderboard, results, and changelog. It will not be created while the core
   links and detailed rules are still unavailable.
3. Hugging Face will host the training data and document data fields, subsets,
   samples, loading code, license, citation, versions, and checksums.
4. The evaluation platform will handle model submissions, run state, and
   machine-generated evaluation results.

The Workshop page must not duplicate long-form dataset documentation or a
dynamic leaderboard.

## Page Placement and Navigation

Insert the Challenge after the complete Call for Papers section and before the
organizer section. Paper submission and Challenge participation are separate
contribution paths and must remain visually and semantically distinct.

The primary order becomes:

1. Introduction
2. Workshop Schedule
3. Invited Speakers
4. Call for Papers
5. Challenge Track
6. Workshop Organizers and Challenge Organizers

Add `Challenge` to the primary navigation between `Call for Papers` and
`Organizers`. Update the section labels to `05 / Challenge Track` and
`06 / Team`. The existing compact navigation continues to handle small screens.

## Visual Direction

Use a light technical-field treatment for the Challenge section:

- Cool white to pale blue-gray background.
- Existing deep-navy typography, cyan data/evaluation accents, and orange
  PrimeBot/prize accents.
- Subtle technical grid, restrained thin rules, compact monospaced eyebrows,
  and the existing small corner radius.
- Clear contrast with the dark Call for Papers section immediately above it.
- No new visual language, decorative illustration, or competing hero image.

The light section establishes a new track while remaining part of the existing
site. The Prize Pool is the one dark, high-contrast stage inside the section.

## Challenge Header and Overview

The header contains:

- Eyebrow: `Challenge Track · IROS 2026`.
- Title: `Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge`.
- Sponsor line: `Designed and sponsored by PrimeBot`, with PrimeBot receiving
  the orange emphasis used elsewhere on the site.

Use this overview copy:

> Designed and sponsored by PrimeBot, this challenge focuses on real-world
> bimanual manipulation in household environments. Participants will train on
> thousands of hours of real-robot teleoperation and UMI data spanning diverse
> household tasks, with the freedom to design their own data mixtures and
> training strategies.

Follow it with three compact facts:

- `Thousands of hours` — Real-world demonstrations.
- `Teleoperation + UMI` — Two complementary data sources.
- `Up to 5 finalists` — Selected for real-world evaluation.

The facts communicate scale and progression; they must not be rendered as
decorative statistics without their explanatory labels.

## Evaluation Flow

Present a numbered three-stage flow that becomes a vertical sequence on mobile:

1. **Train** — Develop data mixtures and training strategies using the released
   datasets.
2. **Qualify Online** — Submit models through the online evaluation portal.
3. **Evaluate in the Real World** — Up to five top-performing entries advance
   to organized real-world evaluations.

Place the scoring statement directly after the flow:

> Final rankings will be determined by a combination of the online evaluation
> score and the final real-world evaluation score. Detailed scoring protocols
> will be announced before online evaluation opens.

Do not display an unconfirmed weighting formula. Do not imply that the first
real-world evaluation contributes to the final score.

## Household Tasks

Use four equal-emphasis task cards in a two-by-two desktop/tablet grid and a
single column on narrow screens:

1. **Open the Washer Door** — Use the gripper to fully open the washing machine
   door.
2. **Load the Washer** — Place two pieces of clothing into the washing machine.
3. **Close the Washer Door** — Use the gripper to close the washing machine door
   securely.
4. **Fold Clothing** — Unfold an item of clothing and fold it neatly.

The task cards use simple sequence markers and text only. They must remain
readable without task imagery.

## Challenge Prize Pool

The Prize Pool is a standalone, full-width, deep-navy showcase after the task
cards and before the timeline. It should be as prominent as the paper Awards
showcase while remaining clearly labeled as Challenge prizes.

The heading displays:

- `Challenge Prize Pool`.
- Large orange `USD 2,000`.
- Supporting text `in total prizes`.

Show three equal-width prize cards:

- `1st Place` — `USD 1,000` — `One winning team`.
- `2nd Place` — `USD 500` — `One winning team`.
- `3rd Place` — `USD 500` — `One winning team`.

The first-place card uses the stronger orange accent. Second and third place use
cyan accents, but all three columns retain equal width. Do not use multiplication
notation such as `×1` or `×2`. Stack the cards in rank order on mobile.

## Challenge Timeline and Resource Status

Place a separate timeline after the Prize Pool:

1. `Sample Data Release` — August 7, 2026 · 11:59 PM AOE.
2. `Full Dataset Release` — August 11, 2026 · 11:59 PM AOE.
3. `Online Evaluation Opens` — August 25, 2026 · 11:59 PM AOE.
4. `First Real-World Evaluation` — September 11, 2026.
5. `Final Real-World Evaluation` — September 21, 2026.

AOE is shown only for the three online release/opening milestones. Physical
evaluation events show dates only; their session time and participation details
will be announced separately.

Below the timeline, render two non-interactive status controls:

- `Dataset — Coming Soon`.
- `Evaluation Portal — Coming Soon`.

They must look deliberately unavailable and must not be anchors, disabled form
buttons, or keyboard focus targets. When real URLs are supplied, convert them to
the site's standard external CTA style without changing the surrounding layout.

## Organizers

Keep the current Workshop Organizer grid. Add a separated subsection after it:

- Heading: `Challenge Organizers`.
- Supporting copy: `The team coordinating the challenge, data release, and real-world evaluation.`
- Order: Kai Li, Ran Cheng, Yan Shen, Hao Dong.
- Display photos and names only; do not display affiliations.
- Use two cards per row on desktop/tablet and one per row on mobile.

Yan Shen and Hao Dong reuse the existing Workshop images. Add the supplied Kai
Li and Ran Cheng images as local assets. Kai Li's illustration-style portrait is
the final official image; preserve it rather than generating or retouching a
photographic replacement. All four images receive consistent cropping, size,
border, and card framing.

## Content and Component Boundaries

Keep mutable Challenge content in the typed Workshop data module rather than
hard-coding it throughout the page. Define focused types/data for:

- Challenge metadata and overview facts.
- Evaluation stages.
- Household tasks.
- Prize items.
- Timeline milestones with optional time-zone text.
- Resource statuses and future URLs.
- Challenge organizers, with affiliation omitted or optional.

Render the Challenge with small, semantically named components or sections so
that a future Challenge page can reuse the data and presentation units. Do not
introduce a router or create the future subpage in this release.

## Accessibility and Responsive Behavior

- Use a labelled top-level Challenge section and logical heading order.
- Represent the evaluation flow, task list, prizes, and timeline with semantic
  lists or grouped articles rather than visual-only containers.
- Provide descriptive image alternative text for all organizer portraits.
- Ensure all essential meaning is available without color.
- Preserve keyboard navigation, visible focus styles, and reduced-motion
  behavior.
- Prevent horizontal overflow at 1440 px, 768 px, and 390 px.
- Stack evaluation stages, tasks, prize cards, and organizer cards in a clear
  reading order when space is limited.

## Verification

- Confirm the navigation points to the Challenge section and closes correctly on
  mobile.
- Confirm all four tasks, three evaluation stages, three prizes, five milestones,
  and four Challenge Organizers render in the approved order.
- Confirm the total prize pool and individual amounts are exact.
- Confirm AOE appears on only the first three Challenge milestones.
- Confirm the two Coming Soon controls are non-interactive and absent from the
  tab order.
- Confirm original CFP Awards remain semantically and visually distinct from the
  Challenge Prize Pool.
- Confirm Kai Li and Ran Cheng use local assets and Yan Shen/Hao Dong reuse the
  existing local assets.
- Run automated tests, lint, and the production build.
- Inspect 1440 px, 768 px, and 390 px layouts for hierarchy, clipping, readable
  text, and horizontal overflow.

## Out of Scope for This Release

- A `/challenge/` subpage.
- Hugging Face dataset documentation or data upload.
- Evaluation-platform integration.
- Registration, model upload, or result APIs.
- Detailed scoring weights and tie-breaking rules.
- Live leaderboard, results, FAQs, or changelog.
