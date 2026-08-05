# Challenge Coming Soon Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, directly addressable `/challenge/` Coming Soon page that can be shared before the full Challenge site is ready.

**Architecture:** Add a second Vite HTML entry at `challenge/index.html`, backed by a focused React component and stylesheet under `src/challenge/`. Configure Rollup with explicit root and Challenge HTML inputs so GitHub Pages receives a real `dist/challenge/index.html`, without adding client-side routing or changing the Workshop homepage.

**Tech Stack:** Vite 8, React 19, TypeScript, CSS, Vitest, Testing Library

---

## File Structure

- Create `challenge/index.html`: Challenge-specific metadata and React mount point.
- Create `src/challenge/ChallengeComingSoon.tsx`: semantic placeholder page component.
- Create `src/challenge/ChallengeComingSoon.css`: isolated, responsive page styling.
- Create `src/challenge/main.tsx`: Challenge React entry and shared font/global-style imports.
- Create `src/challenge/ChallengeComingSoon.test.tsx`: content, link, and accessibility regression tests.
- Modify `vite.config.ts`: declare both HTML build inputs.
- Modify `src/App.test.tsx`: verify build configuration source includes the second HTML entry without changing Workshop behavior.

### Task 1: Add the Tested Challenge Component

**Files:**
- Create: `src/challenge/ChallengeComingSoon.test.tsx`
- Create: `src/challenge/ChallengeComingSoon.tsx`

- [ ] **Step 1: Write the failing component test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ChallengeComingSoon from './ChallengeComingSoon'

describe('Challenge Coming Soon page', () => {
  it('presents the confirmed challenge identity and status', () => {
    render(<ChallengeComingSoon />)

    expect(screen.getByText('PRIMEBOT × IROS 2026')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Towards Bimanual Intelligence' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('A Real-World Household Manipulation Challenge'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Full challenge details are coming soon.'),
    ).toBeInTheDocument()
  })

  it('links back to the Workshop homepage', () => {
    render(<ChallengeComingSoon />)

    expect(screen.getByRole('link', { name: /back to workshop/i })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --run src/challenge/ChallengeComingSoon.test.tsx`

Expected: FAIL because `./ChallengeComingSoon` does not exist.

- [ ] **Step 3: Implement the minimal semantic component**

```tsx
import { ArrowLeft } from 'lucide-react'

const ChallengeComingSoon = () => (
  <main className="challenge-coming-soon">
    <div className="challenge-coming-soon__grid" aria-hidden="true" />
    <section className="challenge-coming-soon__content" aria-labelledby="challenge-title">
      <p className="challenge-coming-soon__eyebrow">PRIMEBOT × IROS 2026</p>
      <h1 id="challenge-title">Towards Bimanual Intelligence</h1>
      <p className="challenge-coming-soon__subtitle">
        A Real-World Household Manipulation Challenge
      </p>
      <p className="challenge-coming-soon__status">
        Full challenge details are coming soon.
      </p>
      <a className="challenge-coming-soon__back" href="/">
        <ArrowLeft aria-hidden="true" size={18} />
        Back to Workshop
      </a>
    </section>
  </main>
)

export default ChallengeComingSoon
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- --run src/challenge/ChallengeComingSoon.test.tsx`

Expected: 2 tests pass.

- [ ] **Step 5: Commit the component and tests**

```bash
git add src/challenge/ChallengeComingSoon.tsx src/challenge/ChallengeComingSoon.test.tsx
git commit -m "feat: add challenge coming soon content"
```

### Task 2: Style and Mount the Challenge Page

**Files:**
- Create: `src/challenge/ChallengeComingSoon.css`
- Create: `src/challenge/main.tsx`

- [ ] **Step 1: Add a failing stylesheet contract test**

Extend `ChallengeComingSoon.test.tsx` with a raw CSS import and assertions for the page shell, responsive breakpoint, focus state, and reduced-motion behavior:

```tsx
import challengeStyles from './ChallengeComingSoon.css?raw'

it('defines responsive, accessible presentation rules', () => {
  expect(challengeStyles).toContain('.challenge-coming-soon {')
  expect(challengeStyles).toContain('min-height: 100svh;')
  expect(challengeStyles).toContain('.challenge-coming-soon__back:focus-visible')
  expect(challengeStyles).toContain('@media (max-width: 600px)')
  expect(challengeStyles).toContain('@media (prefers-reduced-motion: reduce)')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --run src/challenge/ChallengeComingSoon.test.tsx`

Expected: FAIL because `ChallengeComingSoon.css` does not exist.

- [ ] **Step 3: Create the isolated responsive stylesheet**

Implement these exact visual contracts in `ChallengeComingSoon.css`:

```css
.challenge-coming-soon {
  position: relative;
  display: grid;
  min-height: 100svh;
  place-items: center;
  overflow: hidden;
  padding: 72px 24px;
  color: var(--paper);
  background:
    radial-gradient(circle at 78% 20%, rgba(82, 216, 230, 0.14), transparent 28rem),
    radial-gradient(circle at 18% 84%, rgba(255, 125, 79, 0.12), transparent 25rem),
    var(--ink-950);
}

.challenge-coming-soon__grid {
  position: absolute;
  inset: 0;
  opacity: 0.22;
  background-image:
    linear-gradient(var(--line-dark) 1px, transparent 1px),
    linear-gradient(90deg, var(--line-dark) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: linear-gradient(to bottom, black, transparent 88%);
  pointer-events: none;
}

.challenge-coming-soon__content {
  position: relative;
  width: min(880px, 100%);
  text-align: center;
}

.challenge-coming-soon__eyebrow {
  margin-bottom: 28px;
  color: var(--cyan);
  font: 500 0.9rem/1.4 var(--font-mono);
  letter-spacing: 0.16em;
}

.challenge-coming-soon h1 {
  max-width: 820px;
  margin: 0 auto;
  font: 600 clamp(3.5rem, 8vw, 7rem)/0.94 var(--font-display);
  letter-spacing: -0.055em;
}

.challenge-coming-soon h1::first-line {
  color: var(--paper);
}

.challenge-coming-soon__subtitle {
  margin: 24px auto 0;
  color: var(--orange);
  font: 500 clamp(1.25rem, 2.5vw, 1.75rem)/1.35 var(--font-display);
}

.challenge-coming-soon__status {
  margin: 42px auto 0;
  color: var(--slate-light-readable);
  font-size: clamp(1rem, 1.7vw, 1.2rem);
  line-height: 1.7;
}

.challenge-coming-soon__back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  padding: 14px 20px;
  border: 1px solid rgba(82, 216, 230, 0.42);
  color: var(--cyan);
  font: 500 0.84rem/1 var(--font-mono);
  letter-spacing: 0.08em;
  text-decoration: none;
  transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease;
}

.challenge-coming-soon__back:hover {
  border-color: var(--cyan);
  color: var(--ink-950);
  background: var(--cyan);
}

.challenge-coming-soon__back:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 5px;
}

@media (max-width: 600px) {
  .challenge-coming-soon {
    padding: 56px 18px;
  }

  .challenge-coming-soon h1 {
    font-size: clamp(2.8rem, 14vw, 4rem);
  }

  .challenge-coming-soon__eyebrow {
    margin-bottom: 22px;
    font-size: 0.76rem;
  }

  .challenge-coming-soon__status {
    margin-top: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .challenge-coming-soon__back {
    transition: none;
  }
}
```

- [ ] **Step 4: Add the dedicated React entry**

Create `src/challenge/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/dm-mono/500.css'
import '../index.css'
import './ChallengeComingSoon.css'
import ChallengeComingSoon from './ChallengeComingSoon'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChallengeComingSoon />
  </StrictMode>,
)
```

- [ ] **Step 5: Run focused tests and lint**

Run: `npm test -- --run src/challenge/ChallengeComingSoon.test.tsx && npm run lint`

Expected: all focused tests pass and lint exits 0.

- [ ] **Step 6: Commit styling and entry point**

```bash
git add src/challenge/ChallengeComingSoon.css src/challenge/main.tsx src/challenge/ChallengeComingSoon.test.tsx
git commit -m "style: design challenge coming soon page"
```

### Task 3: Add the Vite Multi-Page Entry and Metadata

**Files:**
- Create: `challenge/index.html`
- Modify: `vite.config.ts`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Write failing build-configuration assertions**

Add raw imports in `src/App.test.tsx`:

```tsx
import viteConfigSource from '../vite.config.ts?raw'
import challengeHtml from '../challenge/index.html?raw'
```

Add a test:

```tsx
it('configures a directly addressable Challenge page', () => {
  expect(viteConfigSource).toContain("challenge: resolve(__dirname, 'challenge/index.html')")
  expect(challengeHtml).toContain('<title>Towards Bimanual Intelligence | IROS 2026 Challenge</title>')
  expect(challengeHtml).toContain('https://bimanual-robot-learning.github.io/challenge/')
  expect(challengeHtml).toContain('/src/challenge/main.tsx')
})
```

- [ ] **Step 2: Run the new test and verify RED**

Run: `npm test -- --run src/App.test.tsx -t "configures a directly addressable Challenge page"`

Expected: FAIL because the Challenge HTML entry and Vite input do not exist.

- [ ] **Step 3: Add the Challenge HTML document**

Create `challenge/index.html` with this metadata and mount point:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Towards Bimanual Intelligence — an IROS 2026 real-world household manipulation challenge." />
    <meta name="theme-color" content="#07101d" />
    <meta name="robots" content="index, follow" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="canonical" href="https://bimanual-robot-learning.github.io/challenge/" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Bimanual Robot Learning Workshop" />
    <meta property="og:title" content="Towards Bimanual Intelligence | IROS 2026 Challenge" />
    <meta property="og:description" content="A real-world household manipulation challenge. Full details are coming soon." />
    <meta property="og:url" content="https://bimanual-robot-learning.github.io/challenge/" />
    <meta property="og:image" content="https://bimanual-robot-learning.github.io/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Towards Bimanual Intelligence | IROS 2026 Challenge" />
    <meta name="twitter:description" content="A real-world household manipulation challenge. Full details are coming soon." />
    <meta name="twitter:image" content="https://bimanual-robot-learning.github.io/og-image.jpg" />
    <title>Towards Bimanual Intelligence | IROS 2026 Challenge</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/challenge/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Configure explicit Vite inputs**

Update `vite.config.ts`:

```ts
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        workshop: resolve(__dirname, 'index.html'),
        challenge: resolve(__dirname, 'challenge/index.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `npm test -- --run src/App.test.tsx -t "configures a directly addressable Challenge page"`

Expected: the focused test passes.

- [ ] **Step 6: Build and confirm both HTML outputs**

Run: `npm run build && test -f dist/index.html && test -f dist/challenge/index.html`

Expected: Vite exits 0 and both file checks succeed.

- [ ] **Step 7: Commit multi-page configuration and metadata**

```bash
git add challenge/index.html vite.config.ts src/App.test.tsx
git commit -m "feat: add challenge multi-page entry"
```

### Task 4: Full Regression and Visual Validation

**Files:**
- Verify only; modify prior files only if a validated defect is found.

- [ ] **Step 1: Run the complete automated verification**

Run: `npm test -- --run && npm run lint && npm run build && git diff --check`

Expected: all tests pass, lint exits 0, build exits 0, and diff check is clean.

- [ ] **Step 2: Start the production preview**

Run: `npm run preview -- --host 127.0.0.1 --port 4180`

Expected: Vite reports a local preview URL.

- [ ] **Step 3: Verify direct routing**

Open `/challenge/` directly and confirm the Challenge page loads. Open `/` and confirm the Workshop homepage remains unchanged. Confirm `dist/challenge/index.html` is served instead of relying on a fallback.

- [ ] **Step 4: Check responsive and accessible presentation**

At 1440×900 and 390×844, verify:

- no horizontal overflow;
- title and subtitle wrap cleanly;
- Coming Soon message is readable;
- Back to Workshop has visible hover and keyboard-focus states;
- reduced-motion disables the link transition;
- browser console contains no errors.

- [ ] **Step 5: Commit any validation-only corrections**

If Step 3 or 4 finds a defect, first add or strengthen a regression test, then make the smallest correction and commit it with a focused message. If no defect is found, do not create an empty commit.
