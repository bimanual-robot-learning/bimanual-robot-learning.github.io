# Challenge Leaderboard CSV Import Design

**Date:** 2026-08-26  
**Status:** Implemented, pending local visual acceptance

## Goal

Publish verified challenge results from the organizers' recurring CSV export while keeping the public leaderboard concise, privacy-safe, and visually consistent across the workshop homepage and the challenge subpage.

The public table will contain exactly four columns:

1. Rank
2. Team ID
3. Team Name
4. Total Score

Both pages will render the same generated dataset through the existing shared leaderboard component. The source CSV itself will remain local and will never be committed.

## Non-goals

- Do not publish leader names, submission paths, error fields, per-metric scores, or other internal CSV columns.
- Do not add a CMS, database, server-side upload endpoint, or public CSV download.
- Do not automatically deploy immediately after importing a file. The existing review, preview, and explicit push workflow remains in place.

## Input Contract and Privacy

The importer will read fields by header name rather than column position. This is important because the current CSV orders `team_name` before `team_id`, despite the conceptual public order being Team ID followed by Team Name.

The supported feed contains these publication fields:

- `rank`
- `team_id`
- `team_name`
- `total_score`

The current export also contains `status`. When present, only rows whose normalized status is `valid` will be published; other rows will be skipped and included in the import summary.

The source `team_name` value follows this private combined format:

```text
[team name] - [leader name]
```

The importer will require exactly one occurrence of the exact delimiter ` - ` and publish only the portion before it. Team names may contain ordinary hyphens, but not another occurrence of the spaced privacy delimiter. To prevent accidental disclosure when the private/public boundary is ambiguous, an otherwise publishable row with zero or multiple occurrences will fail validation rather than publishing any portion of the raw value.

## Import Architecture

Add a repeatable command such as:

```bash
npm run leaderboard:import -- "/absolute/path/to/results.csv"
```

The command will invoke a Node script in `scripts/` and use a standards-compliant CSV parser so quoted commas, UTF-8 team names, and escaped values are handled safely.

The importer will:

1. Parse the CSV by header name.
2. Filter out rows whose optional `status` is not `valid`.
3. Sanitize the combined team/leader field.
4. Validate the full publishable dataset before changing any tracked file.
5. Sort entries by ascending rank.
6. Generate a typed data module containing only the four public fields.
7. Print imported, skipped, and failed row counts.

The generated module will use this shape:

```ts
export interface ChallengeLeaderboardEntry {
  rank: number
  teamId: string
  teamName: string
  totalScore: number
}
```

Scores will remain numeric at full source precision in the generated file. The interface will format them to two decimal places for display.

The current CSV should produce eight entries in this order:

| Rank | Team ID | Team Name | Display Score |
| ---: | --- | --- | ---: |
| 1 | T000015 | npu-eai | 73.89 |
| 2 | T000012 | sota | 61.89 |
| 3 | T000010 | Primotion | 61.35 |
| 4 | T000011 | Horizon | 45.32 |
| 5 | T000013 | RoboDeamers | 38.20 |
| 6 | T000014 | Spark | 32.23 |
| 7 | T000016 | Nova | 25.26 |
| 8 | T000017 | JustTry | 17.26 |

## Validation and Failure Behavior

Before overwriting the generated data module, the importer will verify:

- all four publication headers are present;
- every rank uses ordinary base-10 positive integer text and is a JavaScript safe integer;
- every Team ID is non-empty and unique;
- every rank is unique;
- every publishable combined team name contains exactly one privacy delimiter;
- every sanitized team name is non-empty;
- every total score matches the signed decimal grammar `[+-]?[0-9]+(?:\.[0-9]+)?`, excludes exponent notation, and is finite;
- at least one valid row is available for publication.

Any validation error will exit with a non-zero status and leave the existing generated leaderboard unchanged. The command will identify the row and reason without printing private leader names. Output replacement will occur only after the complete dataset passes validation.

## Leaderboard Presentation

Use the approved focused-table design rather than a podium layout:

- a dark, rounded leaderboard card consistent with the workshop visual system;
- a semantic table with the four approved headers;
- subtle gold, silver, and bronze rank accents for positions 1–3;
- cyan, higher-weight total scores aligned to the right with tabular numerals;
- ordinary but clearly readable styling for all remaining ranks;
- a compact verified-results label and team count in the header;
- no opening-date banner, placeholder rank rows, or legacy real-robot/final-score/status columns.

The exact fallback text for an empty dataset is:

> Verified online evaluation results will be published here as submissions are evaluated.

The previous date-specific phrases, including “Online evaluation begins August 25, 2026” and “Leaderboard opens August 25, 2026,” will be removed.

The shared component will be used on both the workshop homepage and `/challenge/`, ensuring both pages always display the same entries and styling. On narrow screens, the table will scroll horizontally inside its card without causing page-level overflow. The scroll container will remain keyboard-focusable, headers will use proper scope attributes, and the table will include an accessible caption.

## Verification

Automated coverage will verify that:

- importing the supplied sample produces exactly eight entries in rank order;
- Team IDs, sanitized team names, and full numeric scores match the CSV;
- no leader name appears in the generated module or rendered pages;
- invalid input exits unsuccessfully and does not overwrite existing generated data;
- both pages render the same eight entries and the same four headers;
- displayed scores use exactly two decimal places;
- the removed date copy and legacy leaderboard columns are absent;
- table semantics and the focusable mobile scroll container remain present.

Before handoff, run the full test suite, lint checks, production build, and desktop/mobile visual checks.

## Recurring Update Workflow

For each future CSV update:

1. Receive the new local CSV file from the organizers.
2. Run the import command.
3. Review the import summary and the generated-data diff.
4. Run tests, lint, and the production build.
5. Start a local preview for visual confirmation.
6. Commit and push only after the user explicitly approves the preview.

This keeps repeated updates fast while preserving a reviewable Git history and preventing private CSV content from entering the repository.
