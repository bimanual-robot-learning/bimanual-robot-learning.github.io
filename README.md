# IROS 2026 Bimanual Robot Learning Workshop

The source for **Scaling vs. Structure? Rethinking Bimanual Manipulation Beyond Single-Arm Policies**, a half-day workshop at IROS 2026 in Pittsburgh.

The production site is intended for `https://bimanual-robot-learning.github.io/`. Until local review is complete, this project is not connected to a GitHub repository and the existing Google Site remains unchanged.

## Local development

```bash
npm install
npm run dev
```

Vite prints the local preview URL. The site is a React + TypeScript single page application with no backend or CMS.

## Editing workshop content

All frequently updated content is in [`src/data/workshop.ts`](src/data/workshop.ts):

- workshop title, date, time, venue, and external links;
- schedule rows and `confirmed`, `tentative`, or `pending` states;
- invited speakers and organizers;
- call-for-papers topics, submission details, awards, and important dates.

Portraits and workshop imagery are stored under `public/images/`. Keep root-relative paths such as `/images/speakers/name.jpg` so they continue to work on the organization-level GitHub Pages domain.

## Quality checks

```bash
npm test
npm run lint
npm run build
```

The tests cover primary sections, schedule data and status labels, person counts and image accessibility, external calls to action, and the compact navigation. The production output is written to `dist/`.

## GitHub Pages deployment

`.github/workflows/deploy.yml` builds and deploys the site through GitHub Actions whenever the default branch is updated. After the repository is created:

1. Push this project to the public `bimanual-robot-learning/bimanual-robot-learning.github.io` repository.
2. In **Settings → Pages**, select **GitHub Actions** as the source.
3. Confirm the workflow completes and verify `https://bimanual-robot-learning.github.io/`.

Do not configure the Google Site redirect until the new production URL has been reviewed and verified.
