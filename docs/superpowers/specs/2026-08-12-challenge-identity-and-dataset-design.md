# Challenge Identity and Dataset Access Design

## Goal

Make the public Challenge Hub immediately recognizable as a dedicated competition
experience, rather than a second view of the workshop homepage. At the same
time, replace the workshop homepage's obsolete dataset placeholder with the
now-public Hugging Face dataset link.

## Scope

Two focused changes:

1. Refine only the Challenge Hub hero (`/challenge/`) to establish an
   independent Challenge identity.
2. Update only the Challenge resource item on the workshop homepage from
   `Dataset · Coming soon` to an external, available Hugging Face link.

The Challenge content, task demonstrations, evaluation format, prizes,
timeline, organizers, navigation structure, and workshop homepage hero remain
unchanged.

## Visual Direction

The workshop homepage continues to be the academic, deep-navy parent page. The
Challenge Hub keeps the same typography, grid discipline, and interaction
patterns, but its hero becomes a warm competition surface:

- Deep brown-to-warm-orange hero background with restrained technical grid and
  glow treatment.
- A small parent label, `BIMANUAL ROBOT LEARNING WORKSHOP`, establishes the
  relationship without competing with the Challenge title.
- A secondary eyebrow, `CHALLENGE TRACK · PRIMEBOT`, makes the page's purpose
  clear at first glance.
- The existing two-line title remains compact: `Household Bimanual` / `Manipulation
  Challenge`, with `Challenge` in the established orange accent.
- The existing sponsor line and dataset / demo actions remain in place, with
  contrast retuned for the warmer surface.

Only the hero changes color family. All subsequent Challenge Hub sections stay
within the existing navy, paper, cyan, and pale-orange information system. This
creates a distinct arrival experience without making the page look detached
from the workshop brand.

## Dataset Access on the Workshop Homepage

The Challenge resource list is configuration-driven. Change its Dataset item
to an available external resource:

- Label: `View Dataset`
- URL: `https://huggingface.co/datasets/challenge-2026/challenge_data`
- Opens in a new tab with the existing safe external-link behavior.
- The resource tile shows the existing available/action affordance, not
  `COMING SOON`.

`Evaluation Portal · Coming soon` remains unchanged.

## Accessibility and Responsive Behavior

- Preserve the already-tested 44px action targets, keyboard focus styles, safe
  external-link attributes, and reduced-motion behavior.
- Maintain two intentional hero title lines on desktop and narrow mobile
  widths; no word-by-word wrapping or horizontal overflow.
- Preserve readable contrast over the new warm hero background.
- Keep parent and Challenge identity labels as text, rather than image-only
  decoration, so their relationship is available to assistive technology.

## Validation

- Add a targeted component/data test for the available Hugging Face Dataset
  resource and safe external-link behavior.
- Add source-level CSS contracts for the warm hero identity and two-line
  responsive title treatment.
- Run the full test suite, lint, production build, and `git diff --check`.
- Inspect `/` and `/challenge/` at desktop and 390px mobile widths, checking
  hero differentiation, title wrapping, dataset link visibility, and absence
  of horizontal overflow.

## Non-Goals

- Do not add dataset metadata or duplicate Hugging Face documentation on the
  website.
- Do not change the Hugging Face content, evaluation portal status, prizes,
  dates, or Challenge Hub information architecture.
- Do not redesign the workshop homepage hero or global brand system.
