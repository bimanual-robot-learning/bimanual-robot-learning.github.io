# Challenge Hub Design

**Date:** 2026-08-08  
**Status:** Approved for specification review  
**Scope:** Replace the minimal `/challenge/` coming-soon page with a participant-facing challenge hub. This specification does not authorize implementation until the user reviews it.

## Goal

Create a standalone page that lets a new visitor understand the Real-World Household Bimanual Manipulation Challenge, see the real-robot task demonstrations, understand the high-level participation and evaluation flow, and reach the canonical dataset documentation.

The challenge hub must complement the workshop home page rather than duplicate it. It should be concise enough to browse on a phone, visually connected to the workshop site, and designed to grow into a leaderboard without becoming a dataset manual.

## Information ownership

| Surface | Owns |
| --- | --- |
| `/challenge/` | Challenge overview, visual demos, concise participation and evaluation rules, prize pool, dates, organizers, updates, and future leaderboard access. |
| [Hugging Face dataset](https://huggingface.co/datasets/challenge-2026/challenge_data) | Downloads, Dataset Card, data fields, file layout, sample files, dependency versions, loading code, and detailed technical documentation. |
| GitHub repository | Website source, deployment configuration, and any future baseline code. |

The challenge hub must link to Hugging Face rather than reproducing detailed field tables or loading instructions. This avoids inconsistent documentation as the dataset evolves.

## Visual direction

- Reuse the workshop palette: deep navy, cold white, cyan blue, and warm orange.
- Use the deep navy grid treatment in the hero; use cold-white content sections for long-form reading and dates.
- Use orange sparingly for the word `Challenge`, the prize pool, and the primary action. Use cyan for dataset and status links.
- Use an existing real-robot washer-task video poster or a muted short playback in the hero, rather than a generic robot illustration.
- Preserve reduced-motion support. Video must show a poster and never rely on autoplay to convey required information.

## Page architecture

### Sticky navigation

```
BRL / CHALLENGE 2026       Overview · Tasks · Evaluation · Prizes · Updates      VIEW DATASET ↗
```

The navigation items are same-page anchors. `VIEW DATASET ↗` opens the Hugging Face dataset in a new tab.

### Hero

The hero provides the primary orientation and two actions.

```
BIMANUAL ROBOT LEARNING WORKSHOP · IROS 2026

REAL-WORLD HOUSEHOLD
BIMANUAL MANIPULATION
CHALLENGE

Designed and sponsored by PrimeBot
Train from real demonstrations. Evaluate on real robots.

[ VIEW DATASET ↗ ]   [ WATCH TASK DEMOS ↓ ]
```

On desktop, text occupies the left side and a selected task video/poster occupies the right side. On mobile, text precedes the poster/video so the title and primary action remain immediately visible.

### Challenge at a Glance

A compact fact rail directly below the hero, not a competing collection of large cards:

```
12+ household tasks / Teleoperation + UMI data / Online + real-robot evaluation / USD 2,000 prize pool
```

### About and Dataset Access

A cold-white two-column section.

The left column carries the concise purpose statement: the challenge concerns real-world bimanual household manipulation; teams may choose their own data mixtures and training strategies.

The right column is a bordered `Dataset Access` panel:

```
Real-robot teleoperation data
UMI demonstrations
LeRobot V2.1 format
Sample data available

[ EXPLORE ON HUGGING FACE ↗ ]
```

It closes with: “Complete dataset documentation, field definitions, sample files, and loading examples are maintained on Hugging Face.”

### Task Demonstrations

Use the existing five videos as the page’s main evidence of the real-world setting.

- One selected, large playable video.
- Four playlist entries with poster, title, source label, and duration.
- Selecting an entry replaces the main video without a full page reload.

Video titles:

1. Fold Clothing
2. Open Washer Door → Retrieve Clothing → Close Washer Door
3. Open Washer Door → Put Clothing → Close Washer Door
4. Fold Clothing · Left View
5. Fold Clothing · Right View

### How to Participate

Three concise text steps, independent of unfinalized technical submission details:

1. **Access the data** — Explore sample data and documentation on Hugging Face.
2. **Train your policy** — Choose a data mixture and training strategy.
3. **Submit for evaluation** — Enter online evaluation; top entries may advance to real-robot testing.

### Evaluation Format and Timeline

Place these sections in a two-column desktop layout and vertically stack them on mobile.

Evaluation format:

1. **Online Evaluation** — Submit a trained policy for online assessment.
2. **Real-Robot Evaluation** — Top-performing entries are tested in household settings.
3. **Final Ranking** — Online evaluation score + final real-robot evaluation score.

The task scope is a single supporting sentence: “Real-robot evaluation covers up to four household tasks, including washer manipulation and clothing folding.”

The timeline is the established five-milestone challenge timeline: sample data release, full dataset release, online evaluation opening, first real-world evaluation, and final real-world evaluation.

### Prize Pool

Use the established pale-orange prize presentation, after Evaluation and Timeline:

```
USD 2,000
CHALLENGE PRIZE POOL

1st Place   USD 1,000
2nd Place   USD 500
3rd Place   USD 500
```

### Leaderboard and Updates

Before online evaluation opens, this remains a compact forward-looking section rather than an empty standalone page:

```
LEADERBOARD
Opens with online evaluation. Coming soon.

UPDATES
Dataset releases, evaluation notices, and rule changes will be posted here.
```

Once results exist, add `/challenge/leaderboard/`, with rank, team, method, online score, real-robot score, and final score. The final scoring field is optional until its public definition is fixed.

### Organizers and footer

Retain the two-column Challenge Organizers grid and affiliations. The footer contains Back to Workshop, Dataset on Hugging Face, and a future GitHub baseline link when that resource exists. Do not add a contact channel until an official one is supplied.

## Initial route scope

Only `/challenge/` is required for the first release. Navigation uses anchors plus the external Hugging Face link. Do not create empty dataset, updates, or leaderboard pages.

Later extensions:

- `/challenge/leaderboard/` once results can be published.
- A concise evaluation guide only if the rules no longer fit clearly on the hub.
- An updates route only if announcements become frequent enough that an on-page list is insufficient.

## Content model and verification

- Store the challenge copy, facts, timeline, prize data, videos, organizers, and external Hugging Face URL in typed data modules rather than scattering strings through components.
- Existing workshop page challenge data may be shared where the wording is identical; challenge-hub-only metadata belongs in a dedicated challenge page data module.
- Treat Hugging Face as an external link and use `target="_blank"` with safe `rel` attributes.
- Test semantic headings, navigation targets, primary Hugging Face action, five video entries, timeline count, prize count, organizer count, and coming-soon leaderboard state.
- Verify desktop, tablet, and phone layouts; keyboard control for the video playlist; visible focus styles; accessible video captions/labels; and reduced-motion behavior.

## Exclusions

- No copied dataset-field documentation, file listings, or loading code.
- No live leaderboard or submission backend in the initial release.
- No registration form, authentication, email collection, or user accounts.
- No unverified scoring details, Docker instructions, or contact channel.
