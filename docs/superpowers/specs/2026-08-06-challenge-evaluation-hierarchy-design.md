# Challenge Evaluation Information Hierarchy Design

## Objective

Simplify the lower half of the homepage Challenge section so that visitors can understand the incentive, evaluation sequence, real-robot task scope, and dates without moving through several visually equal card groups.

This change does not modify the video gallery, participation links, Challenge organizers, standalone `/challenge/` page, dates, prize amounts, evaluation facts, or task requirements.

## Confirmed Content Changes

### Introduction Emphasis

In the first sentence, emphasize the first occurrence of `challenge`:

> This **challenge** focuses on real-world bimanual manipulation in household environments.

The existing emphasis on `thousands of hours` and `teleoperation and UMI data` remains. No other introduction copy changes.

### Section Order

The Challenge content order becomes:

1. Challenge title, sponsor, and introduction
2. Participate in the Challenge
3. Training Data Examples
4. Challenge Prize Pool
5. Evaluation Format and Challenge Timeline

The separate `Household Manipulation Tasks` section is removed. Its factual content moves into `02 Real-Robot Evaluation`.

### Three-Step Evaluation Format

The Evaluation panel presents three numbered steps:

```text
01  Online Evaluation
    Submit trained models through the online evaluation portal.

02  Real-Robot Evaluation
    Up to five top-performing entries advance to household task evaluation.

    Real-Robot Evaluation Scope
    Open the Washer Door
    Fully open the door with the gripper.

    Put Clothing in the Washer
    Put two pieces of clothing into the washer.

    Close the Washer Door
    Close the door securely with the gripper.

    Fold Clothing
    Unfold the clothing and fold it neatly.

03  Final Ranking
    Online evaluation score + final real-robot evaluation score.
```

The sentence `Detailed scoring protocols will be announced before online evaluation opens.` is removed from the website and configuration.

## Task-Scope Presentation

The four tasks appear as a nested subsection of `02 Real-Robot Evaluation`, not as a fourth main step and not as independent cards.

- Subheading: `Real-Robot Evaluation Scope`
- Desktop: a compact 2 × 2 text list within the Evaluation panel
- Each item: task title followed by one short factual description
- Treatment: no filled card background, no large sequence number, and no independent section heading
- Separation: restrained hairline dividers and spacing consistent with the current light Evaluation panel
- At 920 px and below: one-column text list to protect title and description readability

This makes the hierarchy explicit: the tasks define the scope of Step 02, while Step 03 describes how the final result is calculated.

## Prize-Pool Placement

`Challenge Prize Pool` moves from the end of the Challenge section to immediately after `Training Data Examples` and before the Evaluation/Timeline pair.

Its existing full-width design, `USD 2,000 Total`, prize amounts, and three-place structure remain unchanged. Moving it earlier gives the incentive clear visual priority without redesigning the award component.

## Component and Data Changes

- `ChallengeSection` reorders the existing prize-pool section and removes the standalone task section.
- `challenge.tasks` remains the single typed source for all four task titles and descriptions.
- During rendering of `02 Real-Robot Evaluation`, the task configuration is inserted as a nested semantic list.
- The existing `challenge.finalRanking` object renders as the third numbered flow item rather than a visually separate note block.
- `ChallengeFinalRanking.label` becomes `Final Ranking`.
- `ChallengeFinalRanking.note` is removed from the interface and data.

The structure remains configuration-driven without introducing a new component or generalized workflow schema for this static three-step process.

## Styling

- Preserve the equal-width Evaluation Format / Challenge Timeline pair.
- Keep the current pale cyan panel treatment.
- The three main steps retain their numbered flow styling and thin separators.
- The task scope is visually subordinate to `02 Real-Robot Evaluation` through smaller type, reduced spacing, and hairline separators.
- `03 Final Ranking` uses the same main-step title scale as Steps 01 and 02; its formula uses the existing compact formula typography.
- At 1200 px and above, the formula remains on one line when space permits.
- At narrower widths, the formula wraps naturally without overlap.
- The prize-pool appearance is unchanged; only its location changes.

## Accessibility

- Evaluation remains a labelled semantic section.
- The three main steps remain an ordered list.
- The four real-robot tasks become a nested list under Step 02.
- Decorative step numerals remain hidden from assistive technology.
- Task titles and descriptions remain normal text; information is not conveyed by layout or color alone.
- Removing the standalone task section must not create duplicate task content elsewhere.

## Responsive Acceptance

- 1440 px: Prize Pool spans the full content width before Logistics; Evaluation and Timeline remain equal columns; task scope is 2 × 2; the ranking formula is one line.
- 1000 px: Evaluation and Timeline remain two columns; task scope may remain 2 × 2; task copy and ranking formula may wrap but cannot overlap or clip.
- 768 px: task scope becomes one column; all four items remain readable inside the Evaluation panel; no horizontal overflow.
- 390 px: Evaluation and Timeline stack; the three steps and four nested tasks read in one continuous vertical sequence.

## Validation

Automated tests verify:

- the first `challenge` is emphasized alongside the two existing emphasized phrases;
- Challenge order is Participation → Gallery → Prize Pool → Logistics;
- no standalone `Household Manipulation Tasks` region remains;
- the Evaluation ordered list contains exactly three top-level steps in order;
- Step 02 owns all four task titles and descriptions as a nested list;
- Step 03 owns the exact final-ranking formula;
- the removed scoring-protocol sentence is absent from configuration and rendered output;
- desktop task scope uses two columns and the 920 px rule switches it to one column;
- all existing prize amounts, timeline dates, video interactions, and standalone `/challenge/` assertions continue to pass.

Visual QA at 1440 × 1000, 1000 × 1000, 768 × 1000, and 390 × 844 confirms hierarchy, balanced panel heights, readable task wrapping, unchanged prize styling, and zero horizontal overflow.
