# Challenge Coming Soon Page Design

## Goal

Create a stable placeholder page at `/challenge/` so the Challenge URL can be shared on Hugging Face before the complete Challenge website is ready. The page must look intentional and consistent with the Workshop website rather than appearing empty or unfinished.

## Scope

The change adds a second Vite HTML entry and a dedicated React entry point for the Challenge page. It does not change the existing Workshop homepage, its navigation, or the current Challenge Track section. It does not publish or push the branch.

## URL and Deployment Behavior

- Canonical public URL: `https://bimanual-robot-learning.github.io/challenge/`
- The production build must emit `dist/challenge/index.html` so GitHub Pages can serve the page directly without SPA fallback logic.
- Both `/challenge` and `/challenge/` should resolve through normal static-host directory behavior; the canonical metadata URL uses the trailing slash.
- Root-level assets must use paths that work on the organization Pages domain.

## Architecture

Use Vite's multi-page application support:

- Keep the existing root `index.html` and Workshop React entry unchanged.
- Add `challenge/index.html` as a second HTML entry.
- Add a small, independent React entry and stylesheet for the placeholder page.
- Configure the Vite production build with explicit root and Challenge HTML inputs.

The Challenge page remains isolated from the large Workshop `App` component. This makes the placeholder reliable now and gives the future detailed Challenge site a clean expansion point.

## Page Content

The page displays only confirmed identity and status information:

1. Small label: `PRIMEBOT × IROS 2026`
2. Primary title: `Towards Bimanual Intelligence`
3. Subtitle: `A Real-World Household Manipulation Challenge`
4. Status message: `Full challenge details are coming soon.`
5. A `Back to Workshop` link pointing to `/`

The page must not include tentative dates, dataset links, registration links, evaluation details, or prize details.

## Visual Design

- Use the Workshop site's deep navy, cyan-blue, warm orange, and cool-white palette.
- Present a restrained, centered hero composition with ample whitespace.
- Use subtle grid or line details consistent with the main site, without introducing large imagery or complex animation.
- Use orange and cyan accents to connect the placeholder to the Workshop's scale/structure visual language.
- Support keyboard focus, readable contrast, responsive typography, and `prefers-reduced-motion`.

## Metadata

The Challenge HTML entry includes:

- A specific document title.
- A concise description identifying the IROS 2026 real-world household manipulation challenge.
- Canonical URL for `/challenge/`.
- Open Graph title, description, URL, and image using the existing Workshop share image unless a Challenge-specific image is added later.
- Existing favicon.

## Validation

- Automated tests verify the Challenge page's title, subtitle, coming-soon message, and Workshop return link.
- Production build succeeds and emits both `dist/index.html` and `dist/challenge/index.html`.
- Direct preview access to `/challenge/` returns the Challenge page rather than the Workshop homepage or a 404.
- Check desktop and compact mobile widths for overflow, readable title wrapping, focus visibility, and correct link behavior.
- Confirm the root Workshop page remains unchanged.

## Future Extension

The dedicated Challenge React entry will later host dataset documentation, detailed evaluation rules, participation instructions, and leaderboard links. Those additions are explicitly outside this placeholder change.
