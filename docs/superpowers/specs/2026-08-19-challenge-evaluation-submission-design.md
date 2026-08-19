# Challenge Evaluation Submission Design

## Goal

Update the Challenge evaluation instructions so participants understand what to
submit for online evaluation, how finalists proceed to real-robot evaluation,
and where to access the Google Form and required base Docker image.

## Approved Content

### Online Evaluation

Submit action predictions for the validation set through the
[Google Form](https://docs.google.com/forms/d/e/1FAIpQLSdrc5k91kazH9BLEjY17xCQ1KqAPVjmwPp5y21TT0GXQgpyKw/viewform?usp=publish-editor).
Based on the online evaluation results, up to five top-performing teams will
advance to the real-robot evaluation.

### Real-Robot Evaluation

Shortlisted teams will submit a Docker image containing their trained model.
The image must be built from the base Docker image available in the
[Challenge Dataset repository](https://huggingface.co/datasets/challenge-2026/challenge_data).
PrimeBot will deploy and evaluate the submitted models on real robots across
the designated household manipulation tasks.

## Presentation

The workshop homepage and Challenge Hub both render the same typed evaluation
data. Both locations will show the complete approved wording, with `Google
Form` and `Challenge Dataset repository` as visually recognizable inline links.
Links open in a new tab with the site's existing safe external-link behavior and
focus treatment.

The homepage Challenge resource row will also replace the unavailable
`Evaluation Portal · Coming Soon` item with an available cyan primary action:

- Label: `Submit Predictions`
- Destination: the Google Form
- Status text: `Open`

The existing `Explore Challenge Details` and `View Dataset` resources remain
unchanged. The new submission resource receives the same available-state cyan
treatment as those actions.

## Timeline Semantics

Submissions are accepted now, while scoring begins on August 25. Therefore the
timeline milestone changes from `Online Evaluation Opens` to `Online Evaluation
Begins`, retaining the existing date and time:

```text
Online Evaluation Begins
August 25, 2026 · 11:59 PM AOE
```

The Challenge Hub continues to show the leaderboard as coming soon until online
evaluation begins. No other dates or ranking rules change.

## Data and Rendering Structure

Extend `ChallengeStage` from a single unstructured description string to typed
text segments. Each segment contains text and may contain one external URL.
Both page renderers iterate over the segments, producing plain text for normal
segments and safe anchors for linked segments. This keeps the wording and URLs
in one source of truth without embedding JSX inside configuration data.

The resource tile uses the existing `ChallengeResource` external available
variant; no new resource or button component is needed.

## Accessibility and Responsive Behavior

- Inline links use descriptive phrases rather than raw URLs or generic `here`.
- External links use `target="_blank"` and `rel="noreferrer"`.
- Existing keyboard focus styles and minimum touch targets remain unchanged.
- Long evaluation copy wraps naturally inside both existing layouts without
  horizontal overflow at 390px.
- The linked phrases remain distinguishable without relying on color alone,
  using the existing link underline or an equivalent visible affordance.

## Validation

- Data tests verify the exact copy, URLs, and revised timeline label.
- Component tests verify inline links on both the homepage and Challenge Hub,
  including safe external-link attributes.
- Homepage tests verify `Submit Predictions` is an available cyan resource and
  no Evaluation Portal `Coming Soon` placeholder remains.
- Run all tests, lint, production build, and `git diff --check`.
- Inspect both evaluation layouts at desktop and 390px widths for readability
  and absence of horizontal overflow.

## Non-Goals

- Do not change the evaluation formula, shortlist size, household task scope,
  prizes, other timeline dates, or leaderboard behavior.
- Do not duplicate prediction-file format or Docker build instructions that
  belong in the Hugging Face README.
- Do not redesign the overall homepage or Challenge Hub layouts.
