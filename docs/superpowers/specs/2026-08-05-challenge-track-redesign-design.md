# Challenge Track Visual and Information Redesign

## Purpose

Refine the Challenge Track so that it reads as a first-class academic workshop
section rather than a visually separate microsite. The redesign must improve
the long title, promote the Challenge introduction from secondary copy to core
content, simplify the evaluation explanation, clarify the prize structure, and
separate the two organizer teams.

This specification supersedes the visual layout and wording decisions for the
Challenge section in the August 4 Challenge Track specification. Challenge
facts, dates, prize amounts, organizer identities, resource architecture, and
the future Challenge subpage strategy remain unchanged unless explicitly
revised below.

## Page Structure

The main page order becomes:

1. Introduction
2. Workshop Schedule
3. Invited Speakers
4. Call for Papers
5. Challenge Track
6. Workshop Organizers
7. Challenge Organizers
8. Footer

The navigation continues to use a single `Organizers` item targeting Workshop
Organizers. Challenge Organizers follow directly as a separate section, so no
additional navigation item is required.

## Shared Visual Foundation

- Give the Challenge Track the same cool-white background used by Introduction
  and Invited Speakers.
- Remove the full-section pale-blue treatment and full-section technical grid.
- Retain the site's navy typography, cyan structural accents, orange sponsor and
  prize accents, fine rules, small corner radii, and restrained technical labels.
- Use spacing, typography, and local surfaces to establish hierarchy instead of
  introducing a second hero or a competing visual language.

## Challenge Header

Retain the section index `05 / Challenge Track` and remove the redundant
`Challenge Track · IROS 2026` eyebrow above the title.

Use the official title unchanged:

> Towards Bimanual Intelligence: A Real-World Household Manipulation Challenge

The title receives a wider content measure and a desktop font size roughly
15–20% smaller than the current implementation. It should occupy approximately
two lines on large desktop screens and no more than three lines on medium
desktop screens. Mobile wrapping may be longer when needed for readability.

Place the sponsor line directly after the title:

> Designed and sponsored by PrimeBot

Keep PrimeBot as a safe external link and use the established orange emphasis.

## Challenge Introduction

Render the introduction as full-width primary content rather than muted helper
text or one half of a split panel:

> This challenge focuses on real-world bimanual manipulation in household
> environments. Participants will train on thousands of hours of real-robot
> teleoperation and UMI data spanning diverse household tasks, with the freedom
> to design their own data mixtures and training strategies.

Use a full-width typographic block with normal readable body text, a dark
foreground color, a comfortable line length, and one subtle cyan rule on the
left. Do not surround it with another card. It must not appear optional,
footnote-like, or visually subordinate to the facts that follow it.

## Challenge Facts

Place three equal-width facts in a full-width row matching the width of the
content modules below it:

1. `Thousands of hours` — `Real-world demonstrations`
2. `Teleoperation + UMI` — `Complementary data sources`
3. `4 household tasks` — `Real-robot evaluation`

The value is the primary line and the explanation is the secondary line. Stack
the facts vertically on narrow screens. Do not substitute the prize pool for the
third fact because the prize receives dedicated emphasis later in the section.

## Evaluation Format

Remove the current three-stage Evaluation Pipeline and its `Train` stage.
Training is participant preparation, not part of the evaluation process.

Use one unified `Evaluation Format` module containing two stages:

1. **Online Evaluation** — Submit trained models through the online evaluation
   portal.
2. **Real-Robot Evaluation** — Up to five top-performing entries advance to
   household task evaluation.

Show the two stages horizontally with a directional arrow on desktop and
vertically with a downward arrow on mobile.

Keep Final Ranking inside the same module, without a horizontal divider or a
separate nested card:

- Label: `Final Ranking`
- Primary statement: `Online evaluation score + final real-robot evaluation score`
- Supporting statement: `Detailed scoring protocols will be announced before
  online evaluation opens.`

Use spacing and typography to distinguish the Final Ranking explanation from
the two stages. Do not imply an unconfirmed weighting or present Final Ranking
as a third evaluation stage.

## Household Tasks

Keep four equal-emphasis task blocks in a two-by-two desktop and tablet grid and
a single mobile column. Remove any unnecessary outer card that creates a
card-within-card appearance.

Use the following task names and descriptions:

1. **Open the Washer Door** — Use the gripper to fully open the washing machine
   door.
2. **Put Clothing in the Washer** — Put two pieces of clothing into the washing
   machine.
3. **Close the Washer Door** — Use the gripper to close the washing machine door
   securely.
4. **Fold Clothing** — Unfold an item of clothing and fold it neatly.

## Challenge Prize Pool

Replace the current deep-navy block with a light warm-accented region that
integrates naturally with the cool-white section.

The header contains:

- `Challenge Prize Pool`
- `USD 2,000 Total`

Below the header, divide one shared surface into three equal-width columns using
thin vertical rules rather than three nested cards:

1. `1st Place` — `USD 1,000`
2. `2nd Place` — `USD 500`
3. `3rd Place` — `USD 500`

Make the rank labels visibly larger than in the current implementation. Use
orange emphasis for the monetary values and a stronger orange accent for first
place. Remove all three instances of `One winning team`. Stack the columns in
rank order with horizontal separators on mobile.

## Timeline and Resources

Retain the approved five milestones and dates:

1. Sample Data Release — August 7, 2026 · 11:59 PM AOE
2. Full Dataset Release — August 11, 2026 · 11:59 PM AOE
3. Online Evaluation Opens — August 25, 2026 · 11:59 PM AOE
4. First Real-World Evaluation — September 11, 2026
5. Final Real-World Evaluation — September 21, 2026

Render five columns on large desktops, a three-plus-two layout on tablets, and
a single vertical sequence on mobile. AOE remains exclusive to the first three
online milestones.

Keep `Dataset — Coming Soon` and `Evaluation Portal — Coming Soon` below the
timeline. They remain non-interactive until URLs are supplied, then convert to
safe external CTAs using the existing typed resource model.

## Workshop and Challenge Organizers

Make Workshop Organizers and Challenge Organizers two independent top-level
sections on the same cool-white background:

- `06 / Workshop Team` — Workshop Organizers
- `07 / Challenge Team` — Challenge Organizers

Separate them with generous vertical space and a fine rule rather than a
background-color change.

Workshop Organizers keep their existing two-column wide cards and institutions.

Challenge Organizers keep the approved order and omit affiliations:

1. Kai Li
2. Ran Cheng
3. Yan Shen
4. Hao Dong

Use compact horizontal cards with square portraits and names. Display all four
cards in one row on large desktops, two per row on tablets, and one per row on
mobile. Preserve the approved local images and consistent square cropping.

## Responsive and Accessibility Requirements

- Prevent horizontal overflow at 1440 px, 768 px, and 390 px.
- Preserve logical heading order after splitting the two organizer sections.
- Keep all essential meaning independent of color.
- Keep the Challenge introduction and scoring explanation at normal readable
  body sizes and contrast.
- Maintain visible keyboard focus, safe external-link behavior, descriptive
  portrait alt text, and reduced-motion support.
- Preserve semantic lists or grouped articles for evaluation stages, tasks,
  prizes, and timeline entries.

## Verification

- Confirm the Challenge background matches Introduction and Invited Speakers.
- Confirm the redundant eyebrow and the Train stage are absent.
- Confirm the official title and introduction copy are exact.
- Confirm the three facts use the approved values and labels.
- Confirm Evaluation Format contains two stages and a unified Final Ranking
  explanation without a dividing rule.
- Confirm the second task is `Put Clothing in the Washer`.
- Confirm the Prize Pool is light, totals USD 2,000, retains equal columns, and
  contains no `One winning team` text.
- Confirm Workshop and Challenge Organizers are independent sections and the
  Challenge team uses a 4/2/1 responsive grid.
- Run the full test suite, lint, production build, and browser checks at 1440,
  768, and 390 px.

## Out of Scope

- A dedicated `/challenge/` page.
- Dataset hosting or Hugging Face documentation changes.
- Evaluation portal integration.
- Detailed scoring weights, eligibility rules, leaderboard, FAQ, or results.
- Changes to Challenge dates, prize amounts, or organizer membership.
