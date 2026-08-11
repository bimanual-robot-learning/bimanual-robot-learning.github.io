# Challenge Hub Refinement Design

## Goal

Refine the participant-facing `/challenge/` page so its title, sponsor, prize pool,
timeline, and future leaderboard are easier to scan while preserving the existing
workshop visual language.

## Scope

Only the Challenge Hub page changes. The workshop landing page, Call for Papers
awards, dataset schema details, and organizer roster stay unchanged.

## Hero

- Remove the hero image so the title has a full-width text field.
- Render the title in exactly two desktop lines: `Household Bimanual` and
  `Manipulation Challenge`; `Challenge` remains warm orange.
- Keep the original deep-navy precision-grid hero treatment.
- Render `Designed and sponsored by` at a stronger readable size and make
  `PrimeBot` a visible external link to `https://www.primebot.cn/`.

## Facts and hierarchy

- Replace `12+ household tasks` with `1,500+ hours` and the label
  `Real-robot demonstrations`.
- Increase heading scale and contrast for `Your path to entry.`,
  `Evaluation Format`, and `Challenge Timeline` without enlarging body copy.
- Remove the `Sample Data Release` milestone from the rendered Challenge Hub
  timeline; retain the underlying workshop data for other consumers.

## Prize pool

- Keep the existing pale-orange prize surface, USD 3,000 total, and 2,000 / 500 /
  500 amounts.
- Remove cyan from this surface; use deep warm-brown/orange text and rules only.
- Enlarge the `Challenge Prize Pool` label and show a secondary, linked PrimeBot
  sponsor credit within the prize header.

## Leaderboard

- Replace the two-column `Leaderboard + Updates` placeholder with one full-width
  leaderboard empty-state card.
- Rename the existing navigation item from `Updates` to `Leaderboard` while
  preserving its `#updates` anchor target.
- Do not show `Updates`, `Get updates`, or an implied subscription action.
- Show: `Leaderboard`, `Coming soon`, `Leaderboard opens with online evaluation.`,
  the August 25, 2026 opening date, and the three eventual score stages: Online
  score, Real-robot score, Final ranking.

## Validation

- Update component and content tests for the two-line hero, sponsor link,
  1,500+ hours fact, four visible timeline rows, sponsor-aware prize header, and
  single leaderboard card.
- Run the full test suite, linter, production build, and targeted desktop/mobile
  visual inspection.
