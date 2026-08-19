# Challenge Training Data Video Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive, accessible featured-player gallery for five Challenge training-data videos and make the final-ranking formula more compact on desktop.

**Architecture:** Keep video metadata in the existing typed workshop configuration, render it through a focused stateful `ChallengeVideoGallery` component, and place that component between Challenge participation and logistics. Store optimized MP4 and WebP assets locally under `public/`; use the browser-native player instead of adding a media dependency.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Vitest, Testing Library, CSS, FFmpeg, cwebp

---

## File Structure

- Create `src/components/ChallengeVideoGallery.tsx`: owns selected-video state and renders the featured native player plus playlist.
- Modify `src/components/ChallengeSection.tsx`: inserts the gallery between Participation and Logistics.
- Modify `src/data/workshop.ts`: defines `ChallengeVideo` and exports the five-item `challengeVideos` configuration.
- Modify `src/App.css`: adds gallery presentation/responsive rules and compacts the final-ranking formula.
- Modify `src/App.test.tsx`: verifies data, interaction, semantics, order, styling, responsive behavior, and local asset existence.
- Create `public/videos/challenge/*.mp4`: five optimized, fast-start H.264 assets.
- Create `public/images/challenge-videos/*.webp`: five reviewed mid-action posters.

The standalone files under `challenge/` and `src/challenge/` remain unchanged.

### Task 1: Define and test the typed video catalogue

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/data/workshop.ts`

- [ ] **Step 1: Write the failing catalogue test**

Extend the data import in `src/App.test.tsx`:

```tsx
import {
  challenge,
  challengeOrganizers,
  challengeVideos,
  workshopMeta,
} from './data/workshop'
```

Add this test next to the existing Challenge content tests:

```tsx
it('stores the approved Challenge training-data videos in order', () => {
  expect(challengeVideos).toEqual([
    {
      id: 'fold-clothing-teleoperation',
      title: 'Fold Clothing',
      sourceLabel: 'Real-robot teleoperation',
      durationLabel: '00:36',
      src: '/videos/challenge/fold-clothing-teleoperation.mp4',
      poster: '/images/challenge-videos/fold-clothing-teleoperation.webp',
      format: 'landscape',
    },
    {
      id: 'washer-retrieve-clothing-teleoperation',
      title: 'Open Washer Door → Retrieve Clothing → Close Washer Door',
      sourceLabel: 'Real-robot teleoperation',
      durationLabel: '00:40',
      src: '/videos/challenge/washer-retrieve-clothing-teleoperation.mp4',
      poster:
        '/images/challenge-videos/washer-retrieve-clothing-teleoperation.webp',
      format: 'landscape',
    },
    {
      id: 'washer-put-clothing-teleoperation',
      title: 'Open Washer Door → Put Clothing In → Close Washer Door',
      sourceLabel: 'Real-robot teleoperation',
      durationLabel: '00:52',
      src: '/videos/challenge/washer-put-clothing-teleoperation.mp4',
      poster: '/images/challenge-videos/washer-put-clothing-teleoperation.webp',
      format: 'landscape',
    },
    {
      id: 'fold-clothing-umi-left',
      title: 'Fold Clothing · Left View',
      sourceLabel: 'UMI demonstration',
      durationLabel: '00:24',
      src: '/videos/challenge/fold-clothing-umi-left.mp4',
      poster: '/images/challenge-videos/fold-clothing-umi-left.webp',
      format: 'square',
    },
    {
      id: 'fold-clothing-umi-right',
      title: 'Fold Clothing · Right View',
      sourceLabel: 'UMI demonstration',
      durationLabel: '00:24',
      src: '/videos/challenge/fold-clothing-umi-right.mp4',
      poster: '/images/challenge-videos/fold-clothing-umi-right.webp',
      format: 'square',
    },
  ])
})
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```bash
npm test -- -t 'stores the approved Challenge training-data videos in order'
```

Expected: FAIL because `challengeVideos` is not exported.

- [ ] **Step 3: Add the type and exact catalogue**

Add after `ChallengeMilestone` in `src/data/workshop.ts`:

```ts
export interface ChallengeVideo {
  id: string
  title: string
  sourceLabel: 'Real-robot teleoperation' | 'UMI demonstration'
  durationLabel: string
  src: `/videos/challenge/${string}.mp4`
  poster: `/images/challenge-videos/${string}.webp`
  format: 'landscape' | 'square'
}
```

Add after the `challenge` object:

```ts
export const challengeVideos: ChallengeVideo[] = [
  {
    id: 'fold-clothing-teleoperation',
    title: 'Fold Clothing',
    sourceLabel: 'Real-robot teleoperation',
    durationLabel: '00:36',
    src: '/videos/challenge/fold-clothing-teleoperation.mp4',
    poster: '/images/challenge-videos/fold-clothing-teleoperation.webp',
    format: 'landscape',
  },
  {
    id: 'washer-retrieve-clothing-teleoperation',
    title: 'Open Washer Door → Retrieve Clothing → Close Washer Door',
    sourceLabel: 'Real-robot teleoperation',
    durationLabel: '00:40',
    src: '/videos/challenge/washer-retrieve-clothing-teleoperation.mp4',
    poster:
      '/images/challenge-videos/washer-retrieve-clothing-teleoperation.webp',
    format: 'landscape',
  },
  {
    id: 'washer-put-clothing-teleoperation',
    title: 'Open Washer Door → Put Clothing In → Close Washer Door',
    sourceLabel: 'Real-robot teleoperation',
    durationLabel: '00:52',
    src: '/videos/challenge/washer-put-clothing-teleoperation.mp4',
    poster: '/images/challenge-videos/washer-put-clothing-teleoperation.webp',
    format: 'landscape',
  },
  {
    id: 'fold-clothing-umi-left',
    title: 'Fold Clothing · Left View',
    sourceLabel: 'UMI demonstration',
    durationLabel: '00:24',
    src: '/videos/challenge/fold-clothing-umi-left.mp4',
    poster: '/images/challenge-videos/fold-clothing-umi-left.webp',
    format: 'square',
  },
  {
    id: 'fold-clothing-umi-right',
    title: 'Fold Clothing · Right View',
    sourceLabel: 'UMI demonstration',
    durationLabel: '00:24',
    src: '/videos/challenge/fold-clothing-umi-right.mp4',
    poster: '/images/challenge-videos/fold-clothing-umi-right.webp',
    format: 'square',
  },
]
```

- [ ] **Step 4: Run the focused test and type-checking build**

Run:

```bash
npm test -- -t 'stores the approved Challenge training-data videos in order'
npm run build
```

Expected: the focused test passes and the build completes without TypeScript errors.

- [ ] **Step 5: Commit the catalogue**

```bash
git add src/data/workshop.ts src/App.test.tsx
git commit -m 'feat: define challenge training videos'
```

### Task 2: Produce local optimized video and poster assets

**Files:**
- Create: `public/videos/challenge/fold-clothing-teleoperation.mp4`
- Create: `public/videos/challenge/washer-retrieve-clothing-teleoperation.mp4`
- Create: `public/videos/challenge/washer-put-clothing-teleoperation.mp4`
- Create: `public/videos/challenge/fold-clothing-umi-left.mp4`
- Create: `public/videos/challenge/fold-clothing-umi-right.mp4`
- Create: `public/images/challenge-videos/fold-clothing-teleoperation.webp`
- Create: `public/images/challenge-videos/washer-retrieve-clothing-teleoperation.webp`
- Create: `public/images/challenge-videos/washer-put-clothing-teleoperation.webp`
- Create: `public/images/challenge-videos/fold-clothing-umi-left.webp`
- Create: `public/images/challenge-videos/fold-clothing-umi-right.webp`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write the failing local-asset test**

Add these imports to `src/App.test.tsx`:

```tsx
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
```

Add this test after the catalogue test:

```tsx
it('ships every Challenge video and poster as a local asset', () => {
  for (const video of challengeVideos) {
    expect(existsSync(resolve(process.cwd(), 'public', video.src.slice(1)))).toBe(
      true,
    )
    expect(
      existsSync(resolve(process.cwd(), 'public', video.poster.slice(1))),
    ).toBe(true)
  }
})
```

- [ ] **Step 2: Run the focused test and confirm the expected failure**

Run:

```bash
npm test -- -t 'ships every Challenge video and poster as a local asset'
```

Expected: FAIL because the ten local assets do not exist yet.

- [ ] **Step 3: Create output directories and transcode the five clips**

Run from the repository root:

```bash
mkdir -p public/videos/challenge public/images/challenge-videos /private/tmp/challenge-video-posters

ffmpeg -hide_banner -y -i '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/msg/file/2026-08/robot_data_video/web_2x/robot_data_fold_clothe_2x_web.mp4' -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -an -movflags +faststart public/videos/challenge/fold-clothing-teleoperation.mp4

ffmpeg -hide_banner -y -i '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/msg/file/2026-08/robot_data_video/web_2x/robot_data_open_door_extract_clothes_close_door_2x_web.mp4' -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -an -movflags +faststart public/videos/challenge/washer-retrieve-clothing-teleoperation.mp4

ffmpeg -hide_banner -y -i '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/msg/file/2026-08/robot_data_video/web_2x/robot_data_open_door_insert_clothes_close_door_2x_web.mp4' -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -an -movflags +faststart public/videos/challenge/washer-put-clothing-teleoperation.mp4

ffmpeg -hide_banner -y -i '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/msg/file/2026-08/robot_data_video/web_2x/umi_data_flod_clothes_left_view_2x_web.mp4' -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -an -movflags +faststart public/videos/challenge/fold-clothing-umi-left.mp4

ffmpeg -hide_banner -y -i '/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/msg/file/2026-08/robot_data_video/web_2x/umi_data_flod_clothes_right_view_2x_web.mp4' -c:v libx264 -preset medium -crf 27 -pix_fmt yuv420p -an -movflags +faststart public/videos/challenge/fold-clothing-umi-right.mp4
```

Expected: five H.264 MP4 files are created without errors.

- [ ] **Step 4: Extract reviewed frames and encode WebP posters**

Run:

```bash
ffmpeg -hide_banner -ss 00:00:28 -i public/videos/challenge/fold-clothing-teleoperation.mp4 -frames:v 1 -vf "scale='min(1280,iw)':-2" /private/tmp/challenge-video-posters/fold-clothing-teleoperation.png
cwebp -quiet -q 82 /private/tmp/challenge-video-posters/fold-clothing-teleoperation.png -o public/images/challenge-videos/fold-clothing-teleoperation.webp

ffmpeg -hide_banner -ss 00:00:20 -i public/videos/challenge/washer-retrieve-clothing-teleoperation.mp4 -frames:v 1 -vf "scale='min(1280,iw)':-2" /private/tmp/challenge-video-posters/washer-retrieve-clothing-teleoperation.png
cwebp -quiet -q 82 /private/tmp/challenge-video-posters/washer-retrieve-clothing-teleoperation.png -o public/images/challenge-videos/washer-retrieve-clothing-teleoperation.webp

ffmpeg -hide_banner -ss 00:00:20 -i public/videos/challenge/washer-put-clothing-teleoperation.mp4 -frames:v 1 -vf "scale='min(1280,iw)':-2" /private/tmp/challenge-video-posters/washer-put-clothing-teleoperation.png
cwebp -quiet -q 82 /private/tmp/challenge-video-posters/washer-put-clothing-teleoperation.png -o public/images/challenge-videos/washer-put-clothing-teleoperation.webp

ffmpeg -hide_banner -ss 00:00:12 -i public/videos/challenge/fold-clothing-umi-left.mp4 -frames:v 1 -vf "scale='min(1280,iw)':-2" /private/tmp/challenge-video-posters/fold-clothing-umi-left.png
cwebp -quiet -q 82 /private/tmp/challenge-video-posters/fold-clothing-umi-left.png -o public/images/challenge-videos/fold-clothing-umi-left.webp

ffmpeg -hide_banner -ss 00:00:12 -i public/videos/challenge/fold-clothing-umi-right.mp4 -frames:v 1 -vf "scale='min(1280,iw)':-2" /private/tmp/challenge-video-posters/fold-clothing-umi-right.png
cwebp -quiet -q 82 /private/tmp/challenge-video-posters/fold-clothing-umi-right.png -o public/images/challenge-videos/fold-clothing-umi-right.webp
```

Expected: five WebP posters are created at the configured paths.

- [ ] **Step 5: Verify formats, dimensions, fast-start output size, and test**

Run:

```bash
ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate -show_entries format=duration -of compact public/videos/challenge/*.mp4
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 public/videos/challenge/*.mp4
file public/images/challenge-videos/*.webp
du -ch public/videos/challenge/*.mp4
npm test -- -t 'ships every Challenge video and poster as a local asset'
```

Expected:

- all videos report H.264, 30 fps, and their original 1280 × 720 or 960 × 960 dimensions;
- the audio-stream probe prints no stream rows;
- all five posters are reported as WebP images;
- combined video size is 35–40 MB;
- the focused asset test passes.

If the output exceeds 40 MB, re-run all five transcodes with `-crf 28`, regenerate the posters, and repeat this verification. Do not reduce resolution or frame rate.

- [ ] **Step 6: Commit the local media**

```bash
git add public/videos/challenge public/images/challenge-videos src/App.test.tsx
git commit -m 'assets: add challenge training examples'
```

### Task 3: Build the accessible featured-player gallery

**Files:**
- Create: `src/components/ChallengeVideoGallery.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing rendering and interaction tests**

Add these tests to `src/App.test.tsx`:

```tsx
it('renders the first Challenge training video without autoplay', () => {
  render(<App />)

  const gallery = screen.getByRole('region', {
    name: 'Training Data Examples',
  })
  const selected = challengeVideos[0]
  const player = within(gallery).getByLabelText(`${selected.title} video`)
  const source = player.querySelector('source')

  expect(within(gallery).getByText('Real-world data')).toBeVisible()
  expect(
    within(gallery).getByRole('heading', {
      name: 'Training Data Examples',
      level: 3,
    }),
  ).toBeVisible()
  expect(gallery).toHaveTextContent(
    'A glimpse of the real-robot teleoperation and UMI demonstrations available to challenge participants.',
  )
  expect(player).toHaveAttribute('controls')
  expect(player).toHaveAttribute('playsinline')
  expect(player).toHaveAttribute('preload', 'metadata')
  expect(player).not.toHaveAttribute('autoplay')
  expect(player).not.toHaveAttribute('loop')
  expect(player).toHaveAttribute('poster', selected.poster)
  expect(player).toHaveAttribute('data-format', selected.format)
  expect(source).toHaveAttribute('src', selected.src)
  expect(source).toHaveAttribute('type', 'video/mp4')
  expect(within(gallery).getByTestId('challenge-video-caption')).toHaveTextContent(
    `${selected.title}${selected.sourceLabel}${selected.durationLabel}`,
  )
})

it('switches the featured Challenge video without starting playback', async () => {
  const user = userEvent.setup()
  render(<App />)

  const gallery = screen.getByRole('region', {
    name: 'Training Data Examples',
  })
  const target = challengeVideos[3]
  const targetButton = within(gallery).getByRole('button', {
    name: `${target.title}, ${target.sourceLabel}, ${target.durationLabel}`,
  })

  expect(
    within(gallery).getByRole('button', {
      name: `${challengeVideos[0].title}, ${challengeVideos[0].sourceLabel}, ${challengeVideos[0].durationLabel}`,
    }),
  ).toHaveAttribute('aria-pressed', 'true')
  expect(targetButton).toHaveAttribute('aria-pressed', 'false')

  await user.click(targetButton)

  const player = within(gallery).getByLabelText(`${target.title} video`)
  expect(targetButton).toHaveAttribute('aria-pressed', 'true')
  expect(player.querySelector('source')).toHaveAttribute('src', target.src)
  expect(player).toHaveAttribute('poster', target.poster)
  expect(player).not.toHaveAttribute('autoplay')
  expect(within(gallery).getByTestId('challenge-video-caption')).toHaveTextContent(
    `${target.title}${target.sourceLabel}${target.durationLabel}`,
  )
})

it('uses semantic playlist buttons and decorative thumbnails', () => {
  render(<App />)

  const gallery = screen.getByRole('region', {
    name: 'Training Data Examples',
  })
  const buttons = within(gallery).getAllByRole('button')

  expect(buttons).toHaveLength(challengeVideos.length)
  for (const [index, button] of buttons.entries()) {
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute(
      'aria-pressed',
      index === 0 ? 'true' : 'false',
    )
    expect(button.querySelector('img')).toHaveAttribute('alt', '')
  }
})
```

- [ ] **Step 2: Run the focused tests and confirm the expected failure**

Run:

```bash
npm test -- -t 'Challenge training video|featured Challenge video|semantic playlist'
```

Expected: FAIL because the gallery region and component do not exist.

- [ ] **Step 3: Implement the focused component**

Create `src/components/ChallengeVideoGallery.tsx`:

```tsx
import { useState } from 'react'
import { challengeVideos } from '../data/workshop'

function ChallengeVideoGallery() {
  const [selectedId, setSelectedId] = useState(challengeVideos[0].id)
  const selectedVideo =
    challengeVideos.find((video) => video.id === selectedId) ??
    challengeVideos[0]

  return (
    <section
      className="challenge-video-gallery"
      aria-labelledby="challenge-video-gallery-title"
      data-testid="challenge-video-gallery"
    >
      <header className="challenge-video-gallery__header">
        <p className="eyebrow">Real-world data</p>
        <h3 id="challenge-video-gallery-title">Training Data Examples</h3>
        <p>
          A glimpse of the real-robot teleoperation and UMI demonstrations
          available to challenge participants.
        </p>
      </header>

      <div className="challenge-video-gallery__layout">
        <article className="challenge-video-feature">
          <video
            aria-label={`${selectedVideo.title} video`}
            controls
            data-format={selectedVideo.format}
            key={selectedVideo.id}
            playsInline
            poster={selectedVideo.poster}
            preload="metadata"
          >
            <source src={selectedVideo.src} type="video/mp4" />
          </video>
          <div
            className="challenge-video-feature__caption"
            data-testid="challenge-video-caption"
          >
            <h4>{selectedVideo.title}</h4>
            <p>
              <span>{selectedVideo.sourceLabel}</span>
              <span>{selectedVideo.durationLabel}</span>
            </p>
          </div>
        </article>

        <div
          className="challenge-video-playlist"
          aria-label="Training data video playlist"
        >
          {challengeVideos.map((video) => (
            <button
              aria-label={`${video.title}, ${video.sourceLabel}, ${video.durationLabel}`}
              aria-pressed={video.id === selectedVideo.id}
              key={video.id}
              onClick={() => setSelectedId(video.id)}
              type="button"
            >
              <img alt="" src={video.poster} />
              <span className="challenge-video-playlist__copy">
                <strong>{video.title}</strong>
                <small>
                  <span>{video.sourceLabel}</span>
                  <span>{video.durationLabel}</span>
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChallengeVideoGallery
```

The keyed `<video>` intentionally remounts when selection changes, returning the player to its poster state without calling unsupported media APIs in JSDOM.

- [ ] **Step 4: Temporarily render the component in the Challenge section for the focused tests**

In `src/components/ChallengeSection.tsx`, add:

```tsx
import ChallengeVideoGallery from './ChallengeVideoGallery'
```

Then insert this immediately after the closing tag of `.challenge-participation` and before `.challenge-logistics`:

```tsx
<ChallengeVideoGallery />
```

- [ ] **Step 5: Run the focused tests**

Run:

```bash
npm test -- -t 'Challenge training video|featured Challenge video|semantic playlist'
```

Expected: all three focused tests pass.

- [ ] **Step 6: Commit the behavior**

```bash
git add src/components/ChallengeVideoGallery.tsx src/components/ChallengeSection.tsx src/App.test.tsx
git commit -m 'feat: add challenge video gallery behavior'
```

### Task 4: Integrate and style the gallery and ranking formula

**Files:**
- Modify: `src/App.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Extend the order test to require Participation → Gallery → Logistics**

Rename the existing order test to `places participation, training videos, and logistics in sequence`, then add these assertions after locating `participation` and `logistics`:

```tsx
const gallery = within(challengeSection).getByTestId('challenge-video-gallery')

expect((participation as Node).compareDocumentPosition(gallery)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
expect(gallery.compareDocumentPosition(logistics)).toBe(
  Node.DOCUMENT_POSITION_FOLLOWING,
)
```

Retain the existing Introduction → Participation and logistics-heading assertions.

- [ ] **Step 2: Add failing desktop and responsive CSS assertions**

Add these checks to `uses the redesigned Challenge visual system`:

```tsx
expect(styleFor('.challenge-video-gallery__layout').display).toBe('grid')
expect(
  styleFor('.challenge-video-gallery__layout').gridTemplateColumns,
).toBe('minmax(0, 1.55fr) minmax(320px, 0.85fr)')
expect(styleFor('.challenge-video-feature video').aspectRatio).toBe('16 / 9')
expect(styleFor('.challenge-video-feature video').objectFit).toBe('contain')
```

Add these rule-level checks to the CSS ownership test area:

```tsx
expectOwnedCssProperties(appStyles, '.challenge-video-gallery__layout', {
  display: 'grid',
  'grid-template-columns': 'minmax(0, 1.55fr) minmax(320px, 0.85fr)',
  gap: '16px',
  'align-items': 'start',
})
expectOwnedCssProperties(appStyles, '.challenge-video-feature video', {
  display: 'block',
  width: '100%',
  'aspect-ratio': '16 / 9',
  background: 'var(--ink-950)',
  'object-fit': 'contain',
})
expectOwnedCssProperties(
  appStyles,
  '.challenge-video-playlist button:focus-visible',
  {
    outline: '3px solid var(--cyan-deep)',
    'outline-offset': '3px',
  },
)
expectOwnedCssProperties(appStyles, '.challenge-final-ranking strong', {
  'font-size': 'clamp(1rem, 1.25vw, 1.15rem)',
  'white-space': 'nowrap',
})
```

Add these checks to `adapts the Challenge summary across tablet and mobile viewports` after `intermediateMedia` and `tabletMedia` are created:

```tsx
expectOwnedCssProperties(
  intermediateMedia,
  '.challenge-final-ranking strong',
  {
    'white-space': 'normal',
  },
)
expectOwnedCssProperties(tabletMedia, '.challenge-video-gallery__layout', {
  'grid-template-columns': '1fr',
})
expectOwnedCssProperties(tabletMedia, '.challenge-final-ranking strong', {
  'white-space': 'normal',
})
```

- [ ] **Step 3: Run the affected tests and confirm the expected CSS failures**

Run:

```bash
npm test -- -t 'redesigned Challenge visual system|adapts the Challenge summary|participation, training videos'
```

Expected: the order test passes; CSS assertions fail because gallery and formula rules are not implemented.

- [ ] **Step 4: Add the desktop gallery styles**

Insert the following block after `.challenge-resources` styles and before `.challenge-logistics` in `src/App.css`:

```css
.challenge-video-gallery {
  margin-bottom: 32px;
}

.challenge-video-gallery__header {
  display: grid;
  margin-bottom: 20px;
  align-items: end;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 28px;
}

.challenge-video-gallery__header .eyebrow {
  margin: 0 0 8px;
  color: var(--cyan-deep);
  grid-column: 1;
}

.challenge-video-gallery__header h3 {
  margin: 0;
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.2vw, 2.65rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 1.08;
  grid-column: 1;
}

.challenge-video-gallery__header > p:last-child {
  margin: 0;
  color: var(--slate-readable);
  font-size: 0.94rem;
  font-weight: 500;
  line-height: 1.62;
  grid-column: 2;
  grid-row: 1 / span 2;
}

.challenge-video-gallery__layout {
  display: grid;
  align-items: start;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.85fr);
  gap: 16px;
}

.challenge-video-feature {
  overflow: hidden;
  margin: 0;
  color: var(--white);
  background: var(--ink-950);
  border: 1px solid rgba(82, 216, 230, 0.2);
  border-radius: 8px;
}

.challenge-video-feature video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--ink-950);
  object-fit: contain;
}

.challenge-video-feature__caption {
  padding: 18px 20px 20px;
}

.challenge-video-feature__caption h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.12rem, 1.7vw, 1.35rem);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.28;
}

.challenge-video-feature__caption p,
.challenge-video-playlist small {
  display: flex;
  margin: 7px 0 0;
  justify-content: space-between;
  gap: 12px;
  color: rgba(231, 241, 244, 0.68);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.45;
}

.challenge-video-playlist {
  display: grid;
  gap: 8px;
}

.challenge-video-playlist button {
  display: grid;
  min-width: 0;
  padding: 8px;
  color: var(--ink-950);
  background: rgba(82, 216, 230, 0.045);
  border: 1px solid rgba(27, 132, 153, 0.17);
  border-radius: 6px;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.challenge-video-playlist button[aria-pressed='true'] {
  background: rgba(82, 216, 230, 0.13);
  border-color: var(--cyan-deep);
  box-shadow: inset 4px 0 0 var(--cyan-deep);
}

.challenge-video-playlist button:hover {
  border-color: rgba(27, 132, 153, 0.48);
}

.challenge-video-playlist button:focus-visible {
  outline: 3px solid var(--cyan-deep);
  outline-offset: 3px;
}

.challenge-video-playlist img {
  display: block;
  width: 112px;
  aspect-ratio: 16 / 9;
  background: var(--ink-950);
  border-radius: 4px;
  object-fit: cover;
}

.challenge-video-playlist__copy {
  display: flex;
  min-width: 0;
  padding: 3px 2px 2px 0;
  flex-direction: column;
  justify-content: space-between;
}

.challenge-video-playlist__copy strong {
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 650;
  letter-spacing: -0.015em;
  line-height: 1.3;
}

.challenge-video-playlist small {
  margin-top: 8px;
  color: var(--slate-readable);
  font-size: 0.61rem;
}
```

- [ ] **Step 5: Compact the ranking formula and add the intermediate-wrap and 920 px stack rules**

Replace the font-size declaration in `.challenge-final-ranking strong` and add `white-space`:

```css
.challenge-final-ranking strong {
  display: block;
  max-width: 880px;
  color: var(--ink-950);
  font-family: var(--font-display);
  font-size: clamp(1rem, 1.25vw, 1.15rem);
  font-weight: 650;
  letter-spacing: -0.03em;
  white-space: nowrap;
}
```

Add the overflow-safety override while the logistics layout remains two-column:

```css
@media (min-width: 921px) and (max-width: 1199px) {
  .challenge-final-ranking strong {
    white-space: normal;
  }
}
```

Add inside `@media (max-width: 920px)`:

```css
.challenge-video-gallery__header,
.challenge-video-gallery__layout {
  grid-template-columns: 1fr;
}

.challenge-video-gallery__header {
  align-items: start;
  gap: 10px;
}

.challenge-video-gallery__header > p:last-child {
  grid-column: 1;
  grid-row: auto;
}

.challenge-final-ranking strong {
  white-space: normal;
}
```

Add inside `@media (max-width: 480px)`:

```css
.challenge-video-feature__caption {
  padding: 16px;
}

.challenge-video-playlist button {
  grid-template-columns: 96px minmax(0, 1fr);
}

.challenge-video-playlist img {
  width: 96px;
}
```

- [ ] **Step 6: Run the Challenge tests and inspect failures**

Run:

```bash
npm test -- -t 'Challenge|challenge'
```

Expected: all Challenge-related tests pass. If JSDOM serializes `aspect-ratio` differently, keep the production rule and adjust only the computed-style assertion to the exact standards-compliant serialized value reported by JSDOM.

- [ ] **Step 7: Commit the integrated visual treatment**

```bash
git add src/App.css src/App.test.tsx
git commit -m 'style: integrate challenge training gallery'
```

### Task 5: Verify behavior, assets, responsiveness, and production output

**Files:**
- Modify only if verification finds a scoped defect: `src/components/ChallengeVideoGallery.tsx`, `src/components/ChallengeSection.tsx`, `src/data/workshop.ts`, `src/App.css`, `src/App.test.tsx`

- [ ] **Step 1: Run the complete automated verification suite**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: every test passes, lint reports no errors, the Vite production build completes, and `git diff --check` prints no output.

- [ ] **Step 2: Confirm the build contains both pages and all media**

Run:

```bash
find dist -maxdepth 4 -type f | sort
du -ch dist/videos/challenge/*.mp4
```

Expected:

- `dist/index.html` and `dist/challenge/index.html` both exist;
- all five MP4s and all five WebP posters are copied to `dist`;
- combined deployed MP4 size remains 35–40 MB.

- [ ] **Step 3: Start a production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite reports a local preview URL. Keep the process running for the visual checks.

- [ ] **Step 4: Verify the homepage at 1440 × 1000**

Open the homepage Challenge section and confirm:

- Participation is followed by Training Data Examples, then Evaluation/Timeline;
- player and playlist are two columns;
- the first poster is sharp and mid-action;
- each playlist selection updates poster, title, source, and duration without playback starting;
- landscape videos fill the canvas and square UMI clips remain centered with navy sidebars;
- keyboard focus is visible and `Tab`, `Enter`, and `Space` operate every playlist button;
- the final-ranking formula fits on one line;
- no horizontal overflow exists.

- [ ] **Step 5: Verify 1000 × 1000, 768 × 1000, and 390 × 844**

At 1000 × 1000, confirm the logistics panels remain in two columns and the ranking formula wraps without overlapping the Timeline panel or introducing horizontal overflow.

At 768 × 1000 and 390 × 844, confirm:

- player stacks above a single-column playlist;
- all long washer titles wrap without clipping;
- native controls remain reachable and do not overflow;
- captions and playlist metadata remain readable;
- the ranking formula wraps naturally;
- no horizontal overflow exists.

- [ ] **Step 6: Verify the standalone Challenge page is unchanged**

Open `/challenge/` and confirm its existing Coming Soon page has no new gallery markup, style regression, or broken asset path.

- [ ] **Step 7: Commit any verification-only fixes**

If verification required changes, run the complete suite again and commit only those scoped fixes:

```bash
git add src/components/ChallengeVideoGallery.tsx src/components/ChallengeSection.tsx src/data/workshop.ts src/App.css src/App.test.tsx
git commit -m 'fix: polish challenge video gallery'
```

If no files changed, do not create an empty commit.

- [ ] **Step 8: Report the preview URL and await visual approval**

Provide the local preview URL, summarize the five gallery items and optimized media size, and wait for explicit approval before pushing or publishing.
