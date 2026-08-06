# Challenge Training Data Video Gallery Design

## Objective

Add a concise, bandwidth-aware gallery of five Challenge training-data examples to the homepage. The gallery should make the mixture of real-robot teleoperation and UMI data concrete without turning the page into a long grid of simultaneously loaded video players.

The confirmed direction is one fixed featured player with a five-item playlist.

## Placement and Information Order

The new section appears within the homepage Challenge section, immediately after the dark `Participate in the Challenge` module and before the paired `Evaluation Format` / `Challenge Timeline` logistics panels.

The resulting order is:

1. Challenge title, sponsor, and introduction
2. Participation destinations
3. Training Data Examples
4. Evaluation Format and Challenge Timeline
5. Household Manipulation Tasks
6. Challenge Prize Pool

This order lets visitors find participation links first, see concrete data examples second, and then read the evaluation process.

## Section Copy

- Eyebrow: `Real-world data`
- Heading: `Training Data Examples`
- Description: `A glimpse of the real-robot teleoperation and UMI demonstrations available to challenge participants.`

## Video Items

The playlist contains five items in this order:

1. `Fold Clothing`
   - Source: `Real-robot teleoperation`
   - Duration label: `00:36`
2. `Open Washer Door → Retrieve Clothing → Close Washer Door`
   - Source: `Real-robot teleoperation`
   - Duration label: `00:40`
3. `Open Washer Door → Put Clothing In → Close Washer Door`
   - Source: `Real-robot teleoperation`
   - Duration label: `00:52`
4. `Fold Clothing · Left View`
   - Source: `UMI demonstration`
   - Duration label: `00:24`
5. `Fold Clothing · Right View`
   - Source: `UMI demonstration`
   - Duration label: `00:24`

The arrows communicate that the washer clips contain ordered action sequences rather than separate task videos. `Washer` is included so that `Door` is not ambiguous.

## Featured Player Behavior

- The first item, `Fold Clothing`, is selected initially.
- Selecting a playlist item changes the player source, poster, visible title, source label, and duration.
- Selection does not start playback. The visitor explicitly starts playback using native video controls.
- Changing selection resets the featured video to its unloaded/poster state instead of continuing the previous clip.
- The video uses `controls`, `playsInline`, and `preload="metadata"`.
- The videos contain no audio track, so captions and mute controls are not required for content comprehension.
- Autoplay and looping are disabled.

The featured media canvas remains fixed at `16 / 9`. Landscape videos fill the canvas. Square UMI videos use `object-fit: contain` on a deep navy background, producing stable sidebars instead of resizing the page.

## Playlist Layout

On desktop, the featured player occupies the larger left column and the five-item playlist occupies the narrower right column. Each playlist entry contains:

- a local poster thumbnail;
- the full video title;
- source and duration metadata.

The selected entry uses the existing cyan/teal visual language and a clear active edge. Entries are semantic buttons, not links, because they update the featured player without navigation.

On tablet and mobile, the player becomes full width and the playlist moves below it. Playlist items use full-width compact rows so that the long washer-sequence titles wrap naturally without clipping.

## Accessibility

- The gallery is a semantic section labelled by `Training Data Examples`.
- Playlist items are buttons with `aria-pressed` reflecting the selected item.
- The selected state is conveyed by both color and a structural border/edge.
- Thumbnail images are decorative because the button already contains the complete title and metadata; use empty alternative text.
- The featured video has an accessible label derived from the selected title.
- Native video controls remain keyboard accessible.
- Focus stays on the selected playlist button when the active video changes.
- Visible `:focus-visible` styles use the existing cyan outline system.
- No action depends on hover.

## Data and Component Boundaries

Add a typed `ChallengeVideo` configuration in `src/data/workshop.ts` with:

- stable `id`;
- `title`;
- `sourceLabel`;
- `durationLabel`;
- local `src`;
- local `poster`;
- `format: 'landscape' | 'square'`.

Create a focused `ChallengeVideoGallery` React component responsible only for player selection and gallery rendering. `ChallengeSection` imports and places this component between Participation and Logistics. Video content remains configuration-driven.

## Asset Preparation

The source directory contains five H.264 MP4 files totaling approximately 66 MB:

- three 1280 × 720 teleoperation clips;
- two 960 × 960 UMI clips.

Do not modify the source files. Generate web-ready copies under `public/videos/challenge/` using:

- H.264 video through `libx264`;
- the `medium` encoder preset and constant-quality value `CRF 27`;
- the original dimensions and 30 fps frame rate;
- `yuv420p` pixel format;
- no audio track;
- `faststart` metadata for progressive playback.

This tested profile reduces the five-video set from approximately 66 MB to approximately 37 MB while preserving the gripper, garment, and washer-door motion needed for comprehension. The implementation accepts a combined result of 35–40 MB; if the exact encoder build produces more than 40 MB, increase `CRF` to `28` for all five clips and repeat visual QA.

Generate one WebP poster per clip under `public/images/challenge-videos/`. Use 1280 px as the maximum poster dimension, quality 82, and the following reviewed mid-action timestamps:

- `Fold Clothing`: `00:28`;
- `Open Washer Door → Retrieve Clothing → Close Washer Door`: `00:20`;
- `Open Washer Door → Put Clothing In → Close Washer Door`: `00:20`;
- `Fold Clothing · Left View`: `00:12`;
- `Fold Clothing · Right View`: `00:12`.

Use repository-friendly filenames:

- `fold-clothing-teleoperation.mp4`
- `washer-retrieve-clothing-teleoperation.mp4`
- `washer-put-clothing-teleoperation.mp4`
- `fold-clothing-umi-left.mp4`
- `fold-clothing-umi-right.mp4`

Poster filenames use the same stems with `.webp`.

## Styling

The gallery remains on the existing light Challenge background. The featured player uses the deep navy background already present in the participation module, while playlist cards remain light. The gallery should look like part of the current workshop visual system rather than a standalone media application.

No modal, carousel library, custom playback controls, autoplay observer, or synchronized multi-view playback is introduced.

## Final Ranking Typography

As part of the same visual update, reduce the `Online evaluation score + final real-robot evaluation score.` formula to a compact display size so it fits on one line in the desktop Evaluation panel.

- Desktop: use `font-size: clamp(1rem, 1.25vw, 1.15rem)`, moderate display weight, and `white-space: nowrap` while the two-column logistics layout is active.
- At the existing 920 px logistics stack breakpoint, restore `white-space: normal` before the text could overflow.
- The `Final ranking` label remains above the formula.
- The explanatory note remains unchanged.

## Responsive Behavior

- 1440 px: player and playlist use two columns; fixed 16:9 canvas; Evaluation formula remains one line.
- 768 px: player stacks above playlist; playlist rows use the available width; no video title or metadata clips.
- 390 px: player, metadata, and playlist form one column; long sequence titles wrap; native controls remain usable; Evaluation formula wraps normally.
- The page must not gain horizontal overflow at any tested width.

## Validation

Automated tests should verify:

- all five typed video items and exact copy;
- initial selected item;
- clicking each playlist button updates player source, poster, title, source label, duration, and `aria-pressed` state without autoplay;
- the player owns `controls`, `playsInline`, and `preload="metadata"`;
- playlist items are buttons and posters are decorative;
- gallery placement is Participation → Gallery → Logistics;
- fixed 16:9 canvas and `object-fit: contain` behavior;
- desktop and mobile layout rules;
- compact desktop ranking formula and mobile wrapping override;
- all local video and poster paths exist;
- the standalone `/challenge/` page remains unchanged.

Visual acceptance at 1440 × 1000, 768 × 1000, and 390 × 844 should confirm player stability, poster quality, title wrapping, native-control usability, active/focus states, and zero horizontal overflow.
