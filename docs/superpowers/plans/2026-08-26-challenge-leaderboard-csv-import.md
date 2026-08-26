# Challenge Leaderboard CSV Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import verified challenge rankings from the organizers' recurring CSV export, remove private leader names, and publish the same polished four-column leaderboard on the workshop homepage and challenge subpage.

**Architecture:** A Node-only import script will parse and validate the private CSV, then atomically generate a TypeScript module containing only public fields. The existing `challengeHub` data object will consume that generated module, and the existing shared React leaderboard component will render it on both pages. Import behavior, data integration, rendering, responsive styling, and privacy guarantees will be covered by focused tests.

**Tech Stack:** Node.js ESM, `csv-parse`, TypeScript, React 19, Vitest, Testing Library, CSS, Vite

---

## File Structure

- Create `scripts/import-leaderboard.mjs`: parse, sanitize, validate, sort, generate, and atomically write public leaderboard data.
- Create `scripts/import-leaderboard.test.mjs`: Node-environment tests for CSV parsing, privacy, validation, filtering, sorting, and no-overwrite failures.
- Create `src/data/challengeLeaderboard.generated.ts`: generated public data and its exported entry type.
- Create `src/data/challengeLeaderboard.generated.test.ts`: verify the imported public records without storing the private CSV.
- Modify `package.json`: add `csv-parse` and the repeatable `leaderboard:import` command.
- Modify `package-lock.json`: lock the parser dependency.
- Modify `src/data/challengeHub.ts`: remove the obsolete multi-stage score model and consume the generated entries.
- Modify `src/data/challengeHub.test.ts`: verify the public leaderboard data contract and removal of date-specific metadata.
- Modify `src/challenge/ChallengeLeaderboard.tsx`: render exactly Rank, Team ID, Team Name, and Total Score.
- Modify `src/challenge/ChallengeLeaderboard.css`: apply the approved focused-table design, top-three accents, numeric alignment, and contained mobile scrolling.
- Modify `src/challenge/ChallengeLeaderboard.test.tsx`: verify headings, formatting, privacy-safe data, empty copy, semantics, and style hooks.
- Modify `src/components/ChallengeSection.tsx`: show verified team count and remove the opening-date prop on the workshop homepage.
- Modify `src/challenge/ChallengeHub.tsx`: show verified team count and remove the opening-date prop on the challenge page.
- Modify `src/App.test.tsx`: verify the homepage renders all eight public entries and no old copy or columns.
- Modify `src/challenge/ChallengeHub.test.tsx`: verify the challenge page renders the same eight entries and no old copy or columns.
- Modify `src/App.css`: style the homepage leaderboard summary without date-specific selectors.
- Modify `src/challenge/ChallengeHub.css`: style the challenge-page leaderboard summary without date-specific selectors.
- Modify `README.md`: document the recurring import, verification, preview, and approval workflow.

### Task 1: Build the privacy-safe CSV importer

**Files:**
- Create: `scripts/import-leaderboard.mjs`
- Create: `scripts/import-leaderboard.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install the standards-compliant CSV parser**

Run:

```bash
npm install --save-dev csv-parse
```

Expected: `csv-parse` appears in `devDependencies`, and `package-lock.json` records the installed version.

- [ ] **Step 2: Add the repeatable npm command**

Add this entry to `package.json` under `scripts`:

```json
"leaderboard:import": "node scripts/import-leaderboard.mjs"
```

- [ ] **Step 3: Write importer tests before the importer exists**

Create `scripts/import-leaderboard.test.mjs`:

```js
// @vitest-environment node

import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  importLeaderboard,
  parseLeaderboardCsv,
  renderGeneratedModule,
} from './import-leaderboard.mjs'

const temporaryDirectories = []

const sampleCsv = `rank,team_name,team_id,total_score,status
2,sota - Private Leader 02,T000012,61.89411995284824,valid
1,npu-eai - Private Leader 01,T000015,73.89246498024903,valid
3,Primotion - Private Leader 03,T000010,61.354957482506116,valid
4,Horizon - Private Leader 04,T000011,45.316634329010284,valid
5,RoboDeamers - Private Leader 05,T000013,38.2048171454412,valid
6,Spark - Private Leader 06,T000014,32.23415088544078,valid
7,Nova - Private Leader 07,T000016,25.256173270406542,valid
8,JustTry - Private Leader 08,T000017,17.26342222271593,valid
9,Excluded - Private Leader 09,T000018,10.5,invalid
`

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  )
})

describe('parseLeaderboardCsv', () => {
  it('publishes only valid rows, strips leader names, and sorts by rank', () => {
    const result = parseLeaderboardCsv(sampleCsv)

    expect(result.skippedRows).toBe(1)
    expect(result.entries).toEqual([
      { rank: 1, teamId: 'T000015', teamName: 'npu-eai', totalScore: 73.89246498024903 },
      { rank: 2, teamId: 'T000012', teamName: 'sota', totalScore: 61.89411995284824 },
      { rank: 3, teamId: 'T000010', teamName: 'Primotion', totalScore: 61.354957482506116 },
      { rank: 4, teamId: 'T000011', teamName: 'Horizon', totalScore: 45.316634329010284 },
      { rank: 5, teamId: 'T000013', teamName: 'RoboDeamers', totalScore: 38.2048171454412 },
      { rank: 6, teamId: 'T000014', teamName: 'Spark', totalScore: 32.23415088544078 },
      { rank: 7, teamId: 'T000016', teamName: 'Nova', totalScore: 25.256173270406542 },
      { rank: 8, teamId: 'T000017', teamName: 'JustTry', totalScore: 17.26342222271593 },
    ])
  })

  it('handles quoted commas with exactly one privacy delimiter', () => {
    const result = parseLeaderboardCsv(
      'rank,team_name,team_id,total_score,status\n1,"Research, Robotics - Private Person",T009999,80,valid\n',
    )

    expect(result.entries[0]).toEqual({
      rank: 1,
      teamId: 'T009999',
      teamName: 'Research, Robotics',
      totalScore: 80,
    })
  })

  it('rejects an ambiguous privacy delimiter without exposing raw content', () => {
    const csv = 'rank,team_name,team_id,total_score,status\n1,Research Team - Lab - Private Person,T009999,80,valid\n'

    expect(() => parseLeaderboardCsv(csv)).toThrow(
      'Row 2: team_name must contain exactly one privacy delimiter',
    )
  })

  it.each([
    ['missing header', 'rank,team_name,team_id,status\n1,Team - Person,T1,valid\n', 'Missing required CSV header: total_score'],
    ['invalid rank', 'rank,team_name,team_id,total_score,status\nzero,Team - Person,T1,10,valid\n', 'Row 2: rank must be a positive integer'],
    ['missing privacy delimiter', 'rank,team_name,team_id,total_score,status\n1,Unsafe Raw Name,T1,10,valid\n', 'Row 2: team_name must use the required privacy delimiter'],
    ['duplicate Team ID', 'rank,team_name,team_id,total_score,status\n1,A - Person,T1,10,valid\n2,B - Person,T1,9,valid\n', 'Duplicate Team ID: T1'],
    ['duplicate rank', 'rank,team_name,team_id,total_score,status\n1,A - Person,T1,10,valid\n1,B - Person,T2,9,valid\n', 'Duplicate rank: 1'],
    ['invalid score', 'rank,team_name,team_id,total_score,status\n1,A - Person,T1,not-a-number,valid\n', 'Row 2: total_score must be a finite number'],
  ])('rejects %s without exposing raw team_name content', (_, csv, message) => {
    expect(() => parseLeaderboardCsv(csv)).toThrow(message)
    try {
      parseLeaderboardCsv(csv)
    } catch (error) {
      expect(String(error)).not.toContain('Private Person')
    }
  })
})

describe('renderGeneratedModule', () => {
  it('contains only public fields and no private leader labels', () => {
    const output = renderGeneratedModule(parseLeaderboardCsv(sampleCsv).entries)

    expect(output).toContain('teamName: "npu-eai"')
    expect(output).toContain('totalScore: 73.89246498024903')
    expect(output).not.toContain('Private Leader')
    expect(output).not.toContain('status')
  })
})

describe('importLeaderboard', () => {
  it('does not overwrite the generated module when validation fails', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'leaderboard-import-'))
    temporaryDirectories.push(directory)
    const inputPath = join(directory, 'bad.csv')
    const outputPath = join(directory, 'challengeLeaderboard.generated.ts')
    await writeFile(inputPath, 'rank,team_name,team_id,total_score,status\n1,Unsafe,T1,10,valid\n')
    await writeFile(outputPath, 'existing generated content\n')

    await expect(importLeaderboard(inputPath, outputPath)).rejects.toThrow(
      'Row 2: team_name must use the required privacy delimiter',
    )
    await expect(readFile(outputPath, 'utf8')).resolves.toBe(
      'existing generated content\n',
    )
  })
})
```

- [ ] **Step 4: Run the importer tests and confirm the missing implementation failure**

Run:

```bash
npm test -- scripts/import-leaderboard.test.mjs
```

Expected: FAIL because `scripts/import-leaderboard.mjs` does not exist.

- [ ] **Step 5: Implement parsing, validation, generation, and atomic replacement**

Create `scripts/import-leaderboard.mjs`:

```js
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'

const requiredHeaders = ['rank', 'team_name', 'team_id', 'total_score']
const privacyDelimiter = ' - '
const defaultOutputPath = fileURLToPath(
  new URL('../src/data/challengeLeaderboard.generated.ts', import.meta.url),
)

const fail = (message) => {
  throw new Error(message)
}

export function parseLeaderboardCsv(source) {
  let headers = []
  const rows = parse(source, {
    bom: true,
    columns: (values) => {
      headers = values.map((value) => value.trim())
      return headers
    },
    skip_empty_lines: true,
    trim: true,
  })

  for (const header of requiredHeaders) {
    if (!headers.includes(header)) fail(`Missing required CSV header: ${header}`)
  }

  const entries = []
  let skippedRows = 0

  rows.forEach((row, index) => {
    const rowNumber = index + 2
    if (row.status && row.status.trim().toLowerCase() !== 'valid') {
      skippedRows += 1
      return
    }

    const rank = Number(row.rank)
    if (!Number.isInteger(rank) || rank <= 0) {
      fail(`Row ${rowNumber}: rank must be a positive integer`)
    }

    const teamId = String(row.team_id ?? '').trim()
    if (!teamId) fail(`Row ${rowNumber}: team_id must not be empty`)

    const combinedTeamName = String(row.team_name ?? '')
    const delimiterIndex = combinedTeamName.indexOf(privacyDelimiter)
    if (delimiterIndex < 0) {
      fail(`Row ${rowNumber}: team_name must use the required privacy delimiter`)
    }
    if (delimiterIndex !== combinedTeamName.lastIndexOf(privacyDelimiter)) {
      fail(`Row ${rowNumber}: team_name must contain exactly one privacy delimiter`)
    }
    const teamName = combinedTeamName.slice(0, delimiterIndex).trim()
    if (!teamName) fail(`Row ${rowNumber}: sanitized team name must not be empty`)

    const totalScore = Number(row.total_score)
    if (!Number.isFinite(totalScore)) {
      fail(`Row ${rowNumber}: total_score must be a finite number`)
    }

    entries.push({ rank, teamId, teamName, totalScore })
  })

  if (entries.length === 0) fail('No valid leaderboard rows were found')

  const teamIds = new Set()
  const ranks = new Set()
  for (const entry of entries) {
    if (teamIds.has(entry.teamId)) fail(`Duplicate Team ID: ${entry.teamId}`)
    if (ranks.has(entry.rank)) fail(`Duplicate rank: ${entry.rank}`)
    teamIds.add(entry.teamId)
    ranks.add(entry.rank)
  }

  entries.sort((left, right) => left.rank - right.rank)
  return { entries, skippedRows }
}

export function renderGeneratedModule(entries) {
  const rows = entries
    .map(
      (entry) => `  {
    rank: ${entry.rank},
    teamId: ${JSON.stringify(entry.teamId)},
    teamName: ${JSON.stringify(entry.teamName)},
    totalScore: ${entry.totalScore},
  },`,
    )
    .join('\n')

  return `// Generated by scripts/import-leaderboard.mjs. Do not edit manually.

export interface ChallengeLeaderboardEntry {
  rank: number
  teamId: string
  teamName: string
  totalScore: number
}

export const challengeLeaderboardEntries = [
${rows}
] as const satisfies readonly ChallengeLeaderboardEntry[]
`
}

export async function importLeaderboard(inputPath, outputPath = defaultOutputPath) {
  const source = await readFile(inputPath, 'utf8')
  const { entries, skippedRows } = parseLeaderboardCsv(source)
  const output = renderGeneratedModule(entries)
  const temporaryPath = `${outputPath}.${process.pid}.tmp`

  await mkdir(dirname(outputPath), { recursive: true })
  try {
    await writeFile(temporaryPath, output, 'utf8')
    await rename(temporaryPath, outputPath)
  } catch (error) {
    await rm(temporaryPath, { force: true })
    throw error
  }

  return { importedRows: entries.length, skippedRows, failedRows: 0, outputPath }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : ''
if (invokedPath === fileURLToPath(import.meta.url)) {
  const inputPath = process.argv[2]
  if (!inputPath) {
    console.error('Usage: npm run leaderboard:import -- /absolute/path/to/results.csv')
    process.exitCode = 1
  } else {
    try {
      const result = await importLeaderboard(resolve(inputPath))
      console.log(
        `Imported ${result.importedRows} rows; skipped ${result.skippedRows}; failed ${result.failedRows}; wrote ${result.outputPath}`,
      )
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }
}
```

- [ ] **Step 6: Run focused tests and lint the script**

Run:

```bash
npm test -- scripts/import-leaderboard.test.mjs
npm run lint
```

Expected: importer tests PASS; lint reports no errors.

- [ ] **Step 7: Commit the importer**

```bash
git add package.json package-lock.json scripts/import-leaderboard.mjs scripts/import-leaderboard.test.mjs
git commit -m "feat: add privacy-safe leaderboard importer"
```

### Task 2: Generate and verify the current public leaderboard data

**Files:**
- Create: `src/data/challengeLeaderboard.generated.ts`
- Create: `src/data/challengeLeaderboard.generated.test.ts`

- [ ] **Step 1: Import the supplied CSV into the generated public module**

Run:

```bash
npm run leaderboard:import -- "/Users/littlemac/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_lixlmrsxnlrs11_9a65/temp/drag/leaderboard(2).csv"
```

Expected:

```text
Imported 8 rows; skipped 0; failed 0; wrote .../src/data/challengeLeaderboard.generated.ts
```

- [ ] **Step 2: Inspect the generated file for the public-field boundary**

Run:

```bash
sed -n '1,220p' src/data/challengeLeaderboard.generated.ts
rg -n "teamName: [\"'].* - .*[\"']|leaderName|submission|error|onlineScore|realRobotScore|finalScore|status" src/data/challengeLeaderboard.generated.ts
```

Expected: the file contains eight records with only `rank`, `teamId`, `teamName`, and `totalScore`; `rg` returns no matches.

- [ ] **Step 3: Write the generated-data regression test**

Create `src/data/challengeLeaderboard.generated.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { challengeLeaderboardEntries } from './challengeLeaderboard.generated'

describe('generated challenge leaderboard data', () => {
  it('contains the eight verified public records in rank order', () => {
    expect(challengeLeaderboardEntries).toHaveLength(8)
    expect(challengeLeaderboardEntries.map(({ rank }) => rank)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ])
    expect(challengeLeaderboardEntries[0]).toEqual({
      rank: 1,
      teamId: 'T000015',
      teamName: 'npu-eai',
      totalScore: 73.89246498024903,
    })
    expect(challengeLeaderboardEntries.at(-1)).toEqual({
      rank: 8,
      teamId: 'T000017',
      teamName: 'JustTry',
      totalScore: 17.26342222271593,
    })
  })

  it('contains only the four approved public keys', () => {
    for (const entry of challengeLeaderboardEntries) {
      expect(Object.keys(entry)).toEqual([
        'rank',
        'teamId',
        'teamName',
        'totalScore',
      ])
      expect(entry.teamName).not.toContain(' - ')
    }
  })
})
```

- [ ] **Step 4: Run the generated-data test and production build**

Run:

```bash
npm test -- src/data/challengeLeaderboard.generated.test.ts
npm run build
```

Expected: the data test passes and the unchanged application still builds because the new generated module is not connected yet.

- [ ] **Step 5: Commit only the sanitized generated data and its test**

```bash
git add src/data/challengeLeaderboard.generated.ts src/data/challengeLeaderboard.generated.test.ts
git commit -m "data: add verified challenge rankings"
```

### Task 3: Migrate both pages to the shared four-column leaderboard

**Files:**
- Modify: `src/data/challengeHub.ts`
- Modify: `src/data/challengeHub.test.ts`
- Modify: `src/challenge/ChallengeLeaderboard.tsx`
- Modify: `src/challenge/ChallengeLeaderboard.css`
- Modify: `src/challenge/ChallengeLeaderboard.test.tsx`
- Modify: `src/components/ChallengeSection.tsx`
- Modify: `src/challenge/ChallengeHub.tsx`
- Modify: `src/App.test.tsx`
- Modify: `src/challenge/ChallengeHub.test.tsx`
- Modify: `src/App.css`
- Modify: `src/challenge/ChallengeHub.css`

- [ ] **Step 1: Rewrite the shared component tests for the approved contract**

Replace `src/challenge/ChallengeLeaderboard.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import leaderboardStyles from './ChallengeLeaderboard.css?raw'
import ChallengeLeaderboard from './ChallengeLeaderboard'

const entries: readonly ChallengeLeaderboardEntry[] = [
  { rank: 1, teamId: 'T000015', teamName: 'npu-eai', totalScore: 73.89246498024903 },
  { rank: 2, teamId: 'T000012', teamName: 'sota', totalScore: 61.89411995284824 },
  { rank: 3, teamId: 'T000010', teamName: 'Primotion', totalScore: 61.354957482506116 },
  { rank: 4, teamId: 'T000011', teamName: 'Horizon', totalScore: 45.316634329010284 },
]

describe('ChallengeLeaderboard', () => {
  it('renders the four public columns with two-decimal scores', () => {
    render(<ChallengeLeaderboard entries={entries} />)

    expect(
      screen.getAllByRole('columnheader').map((header) => header.textContent),
    ).toEqual(['Rank', 'Team ID', 'Team Name', 'Total Score'])
    expect(screen.getAllByTestId('challenge-leaderboard-entry')).toHaveLength(4)
    expect(screen.getByRole('row', { name: '1 T000015 npu-eai 73.89' })).toBeVisible()
    expect(screen.getByRole('row', { name: '2 T000012 sota 61.89' })).toBeVisible()
    expect(screen.queryByText('Online Score')).not.toBeInTheDocument()
    expect(screen.queryByText('Real-Robot Score')).not.toBeInTheDocument()
    expect(screen.queryByText('Final Score')).not.toBeInTheDocument()
    expect(screen.queryByText('Status')).not.toBeInTheDocument()
  })

  it('marks the first three ranks without turning the table into a podium', () => {
    render(<ChallengeLeaderboard entries={entries} />)

    expect(screen.getByRole('row', { name: /1 T000015/ })).toHaveAttribute('data-rank-accent', 'gold')
    expect(screen.getByRole('row', { name: /2 T000012/ })).toHaveAttribute('data-rank-accent', 'silver')
    expect(screen.getByRole('row', { name: /3 T000010/ })).toHaveAttribute('data-rank-accent', 'bronze')
    expect(screen.getByRole('row', { name: /4 T000011/ })).not.toHaveAttribute('data-rank-accent')
  })

  it('renders only the approved publication sentence when empty', () => {
    render(<ChallengeLeaderboard entries={[]} />)

    expect(
      screen.getByText(
        'Verified online evaluation results will be published here as submissions are evaluated.',
      ),
    ).toBeVisible()
    expect(screen.queryByText(/August 25, 2026/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Leaderboard opens/i)).not.toBeInTheDocument()
  })

  it('keeps the table accessible and horizontally contained', () => {
    render(<ChallengeLeaderboard entries={entries} />)

    expect(
      screen.getByRole('table', {
        name: 'Household Bimanual Manipulation Challenge rankings',
      }),
    ).toBeVisible()
    expect(screen.getByLabelText(/scroll horizontally/i)).toHaveAttribute('tabindex', '0')
    expect(leaderboardStyles).toMatch(
      /\.challenge-leaderboard__viewport\s*\{[^}]*overflow-x:\s*auto;/,
    )
    expect(leaderboardStyles).toContain('font-variant-numeric: tabular-nums')
    expect(leaderboardStyles).toContain('[data-rank-accent=\'gold\']')
    expect(leaderboardStyles).toContain('[data-rank-accent=\'silver\']')
    expect(leaderboardStyles).toContain('[data-rank-accent=\'bronze\']')
  })
})
```

- [ ] **Step 2: Run the shared-component tests and confirm they fail**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: FAIL because the component still requires `openingDate` and renders six legacy columns.

- [ ] **Step 3: Implement the four-column component**

Replace `src/challenge/ChallengeLeaderboard.tsx` with:

```tsx
import type { ChallengeLeaderboardEntry } from '../data/challengeHub'
import './ChallengeLeaderboard.css'

interface ChallengeLeaderboardProps {
  entries: readonly ChallengeLeaderboardEntry[]
}

const rankAccent = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  return undefined
}

const formatScore = (score: number) =>
  score.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

function ChallengeLeaderboard({ entries }: ChallengeLeaderboardProps) {
  return (
    <div
      aria-label="Challenge leaderboard table; scroll horizontally to view all columns"
      className="challenge-leaderboard__viewport"
      tabIndex={0}
    >
      <table className="challenge-leaderboard__table">
        <caption className="sr-only">
          Household Bimanual Manipulation Challenge rankings
        </caption>
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Team ID</th>
            <th scope="col">Team Name</th>
            <th scope="col">Total Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr className="challenge-leaderboard__empty">
              <td colSpan={4}>
                Verified online evaluation results will be published here as submissions are evaluated.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr
                data-rank-accent={rankAccent(entry.rank)}
                data-testid="challenge-leaderboard-entry"
                key={entry.teamId}
              >
                <td className="challenge-leaderboard__rank">{entry.rank}</td>
                <td className="challenge-leaderboard__team-id">{entry.teamId}</td>
                <th scope="row">{entry.teamName}</th>
                <td className="challenge-leaderboard__score">
                  {formatScore(entry.totalScore)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ChallengeLeaderboard
```

- [ ] **Step 4: Replace the table styles with the focused-table treatment**

Update `src/challenge/ChallengeLeaderboard.css` so these complete rules replace the legacy score/status and empty-date styles:

```css
.challenge-leaderboard__viewport {
  max-width: 100%;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  border: 1px solid rgba(183, 220, 230, 0.18);
  border-radius: 6px;
  scrollbar-width: thin;
}

.challenge-leaderboard__viewport::-webkit-scrollbar {
  height: 8px;
}

.challenge-leaderboard__viewport::-webkit-scrollbar-thumb {
  background: rgba(183, 220, 230, 0.42);
  border-radius: 999px;
}

.challenge-leaderboard__viewport:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 4px;
}

.challenge-leaderboard__table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  color: var(--paper);
}

.challenge-leaderboard__table th,
.challenge-leaderboard__table td {
  padding: 18px clamp(14px, 2.4vw, 28px);
  text-align: left;
  border-bottom: 1px solid rgba(183, 220, 230, 0.14);
}

.challenge-leaderboard__table thead {
  background: rgba(82, 216, 230, 0.07);
}

.challenge-leaderboard__table thead th {
  color: rgba(230, 241, 243, 0.8);
  font: 700 0.72rem/1.35 var(--font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.challenge-leaderboard__table tbody tr:last-child > * {
  border-bottom: 0;
}

.challenge-leaderboard__table tbody th,
.challenge-leaderboard__table tbody td {
  font-size: 0.96rem;
}

.challenge-leaderboard__table tbody th {
  color: #fff;
  font-weight: 650;
}

.challenge-leaderboard__rank,
.challenge-leaderboard__team-id,
.challenge-leaderboard__score {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.challenge-leaderboard__rank {
  width: 88px;
  color: rgba(230, 241, 243, 0.72);
  font-weight: 750;
}

.challenge-leaderboard__team-id {
  color: var(--slate-light-readable);
}

.challenge-leaderboard__score,
.challenge-leaderboard__table thead th:last-child {
  text-align: right;
}

.challenge-leaderboard__score {
  color: var(--cyan);
  font-size: 1rem;
  font-weight: 800;
}

.challenge-leaderboard__table tr[data-rank-accent='gold'] .challenge-leaderboard__rank {
  color: #f1c75b;
}

.challenge-leaderboard__table tr[data-rank-accent='silver'] .challenge-leaderboard__rank {
  color: #c7d2d9;
}

.challenge-leaderboard__table tr[data-rank-accent='bronze'] .challenge-leaderboard__rank {
  color: #d99568;
}

.challenge-leaderboard__empty td {
  padding: clamp(38px, 5vw, 58px) clamp(18px, 3vw, 32px);
  color: var(--slate-light-readable);
  font-size: 0.94rem;
  line-height: 1.65;
  text-align: left;
}
```

- [ ] **Step 5: Run the component tests**

Run:

```bash
npm test -- src/challenge/ChallengeLeaderboard.test.tsx
```

Expected: all shared leaderboard tests PASS.

- [ ] **Step 6: Update the data-model test for generated entries**

In `src/data/challengeHub.test.ts`, replace the old leaderboard equality assertion with:

```ts
expect(challengeHub.leaderboard.status).toBe('Verified results')
expect(challengeHub.leaderboard).not.toHaveProperty('openingDate')
expect(challengeHub.leaderboard.entries).toHaveLength(8)
expect(challengeHub.leaderboard.entries[0]).toEqual({
  rank: 1,
  teamId: 'T000015',
  teamName: 'npu-eai',
  totalScore: 73.89246498024903,
})
```

- [ ] **Step 7: Update the homepage integration assertions**

In the existing homepage challenge-section test in `src/App.test.tsx`, replace the six-column and opening-date assertions with:

```ts
expect(
  within(homepageLeaderboard)
    .getAllByRole('columnheader')
    .map((header) => header.textContent),
).toEqual(['Rank', 'Team ID', 'Team Name', 'Total Score'])
expect(
  within(homepageLeaderboard).getAllByTestId('challenge-leaderboard-entry'),
).toHaveLength(8)
expect(within(homepageLeaderboard).getByText('8 verified teams')).toBeVisible()
expect(
  within(homepageLeaderboard).getByRole('row', {
    name: '1 T000015 npu-eai 73.89',
  }),
).toBeVisible()
expect(within(homepageLeaderboard).queryByText(/August 25, 2026/i)).not.toBeInTheDocument()
expect(within(homepageLeaderboard).queryByText(/Leaderboard opens/i)).not.toBeInTheDocument()
```

- [ ] **Step 8: Update the challenge-page integration assertions**

In the leaderboard section of `src/challenge/ChallengeHub.test.tsx`, replace the pending/date assertions with:

```ts
expect(within(leaderboard).getByText('Verified results')).toBeVisible()
expect(within(leaderboard).getByText('8 verified teams')).toBeVisible()
expect(
  within(leaderboard)
    .getAllByRole('columnheader')
    .map((header) => header.textContent),
).toEqual(['Rank', 'Team ID', 'Team Name', 'Total Score'])
expect(
  within(leaderboard).getAllByTestId('challenge-leaderboard-entry'),
).toHaveLength(8)
expect(
  within(leaderboard).getByRole('row', {
    name: '1 T000015 npu-eai 73.89',
  }),
).toBeVisible()
expect(within(leaderboard).queryByText(/August 25, 2026/i)).not.toBeInTheDocument()
expect(within(leaderboard).queryByText(/Leaderboard opens/i)).not.toBeInTheDocument()
```

In the existing presentation test in the same file, update the table-width assertion to:

```ts
expect(leaderboardStyles).toMatch(
  /\.challenge-leaderboard__table\s*\{[^}]*min-width:\s*620px;/,
)
```

- [ ] **Step 9: Run all migrated-contract tests and confirm they fail**

Run:

```bash
npm test -- src/data/challengeHub.test.ts src/challenge/ChallengeLeaderboard.test.tsx src/App.test.tsx src/challenge/ChallengeHub.test.tsx
```

Expected: FAIL because the data model and both page consumers still use the pending six-column contract.

- [ ] **Step 10: Connect `challengeHub` to the generated module**

At the top of `src/data/challengeHub.ts`, import the generated data and type:

```ts
import {
  challengeLeaderboardEntries,
  type ChallengeLeaderboardEntry,
} from './challengeLeaderboard.generated'
import { challengeDatasetUrl } from './workshop'

export type { ChallengeLeaderboardEntry }
```

Delete `ChallengeLeaderboardStatus` and the old `ChallengeLeaderboardEntry` interface. Replace `ChallengeHubLeaderboard` with:

```ts
export interface ChallengeHubLeaderboard {
  status: 'Verified results'
  entries: readonly ChallengeLeaderboardEntry[]
}
```

Replace the `leaderboard` object with:

```ts
leaderboard: {
  status: 'Verified results',
  entries: challengeLeaderboardEntries,
} satisfies ChallengeHubLeaderboard,
```

- [ ] **Step 11: Update both React consumers**

In `src/components/ChallengeSection.tsx`, replace the date paragraph and component invocation with:

```tsx
<p className="challenge-leaderboard__summary">
  {challengeHub.leaderboard.entries.length} verified{' '}
  {challengeHub.leaderboard.entries.length === 1 ? 'team' : 'teams'}
</p>
```

```tsx
<ChallengeLeaderboard entries={challengeHub.leaderboard.entries} />
```

Make the same replacement in `src/challenge/ChallengeHub.tsx`.

- [ ] **Step 12: Rename the page-level summary selectors**

In `src/App.css`, change `.challenge-home-leaderboard__header > p` to:

```css
.challenge-home-leaderboard__header > .challenge-leaderboard__summary {
  margin: 0;
  color: var(--cyan);
  font: 700 0.76rem/1.5 var(--font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}
```

In `src/challenge/ChallengeHub.css`, change `.challenge-hub__leaderboard-header > p` to:

```css
.challenge-hub__leaderboard-header > .challenge-leaderboard__summary {
  max-width: 280px;
  margin: 0;
  color: var(--cyan);
  font: 700 0.76rem/1.5 var(--font-mono);
  letter-spacing: 0.06em;
  text-align: right;
  text-transform: uppercase;
  white-space: nowrap;
}
```

In the existing `@media (max-width: 760px)` block in `src/challenge/ChallengeHub.css`, replace the generic paragraph selector with:

```css
.challenge-hub__leaderboard-header > .challenge-leaderboard__summary {
  max-width: none;
  text-align: left;
}
```

The existing mobile column layout in `src/App.css` remains unchanged. Do not force a minimum page width; the table viewport owns horizontal scrolling.

- [ ] **Step 13: Run all leaderboard tests, lint, and the build**

Run:

```bash
npm test -- scripts/import-leaderboard.test.mjs src/data/challengeLeaderboard.generated.test.ts src/data/challengeHub.test.ts src/challenge/ChallengeLeaderboard.test.tsx src/App.test.tsx src/challenge/ChallengeHub.test.tsx
npm run lint
npm run build
```

Expected: all focused tests pass, lint reports no errors, and the production build succeeds.

- [ ] **Step 14: Commit the atomic model, component, and page migration**

```bash
git add src/data/challengeHub.ts src/data/challengeHub.test.ts src/challenge/ChallengeLeaderboard.tsx src/challenge/ChallengeLeaderboard.css src/challenge/ChallengeLeaderboard.test.tsx src/components/ChallengeSection.tsx src/challenge/ChallengeHub.tsx src/App.test.tsx src/challenge/ChallengeHub.test.tsx src/App.css src/challenge/ChallengeHub.css
git commit -m "feat: publish verified rankings across challenge pages"
```

### Task 4: Document updates and verify the complete release candidate

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document the recurring organizer workflow**

Add this section to `README.md`:

````markdown
## Updating the Challenge Leaderboard

Keep organizer CSV exports outside this repository. Import a verified export with:

```bash
npm run leaderboard:import -- "/absolute/path/to/leaderboard.csv"
```

The importer reads fields by header name, publishes only valid rows when a `status` column is present, removes the leader-name suffix from `team_name`, validates duplicate ranks and Team IDs, and writes only public fields to `src/data/challengeLeaderboard.generated.ts`.

After every import:

1. Review the generated-data diff.
2. Run `npm test`, `npm run lint`, and `npm run build`.
3. Run `npm run preview -- --host 127.0.0.1` and inspect `/` and `/challenge/`.
4. Commit and push only after the preview is approved.
````

- [ ] **Step 2: Run the complete automated verification**

Run:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: every command exits successfully with no test, lint, TypeScript, build, or whitespace errors.

- [ ] **Step 3: Confirm private leader names and old leaderboard fields are absent**

Run:

```bash
rg -n "teamName: [\"'].* - .*[\"']|leaderName|Leaderboard opens|Online evaluation begins August 25|Real-Robot Score|Final Score" src README.md
```

Expected: no matches from the leaderboard implementation or generated data. If the general challenge timeline legitimately contains “Online Evaluation Begins,” inspect that match and confirm it is unrelated to the removed leaderboard date banner.

- [ ] **Step 4: Start the local production preview**

Run:

```bash
npm run preview -- --host 127.0.0.1
```

Expected: Vite prints a local URL such as `http://127.0.0.1:4173/`.

- [ ] **Step 5: Perform desktop and mobile visual checks**

Inspect both `/` at `#challenge` and `/challenge/` at these viewport widths:

- 1440px: four columns fill the card cleanly; Rank and Total Score are visually easy to scan.
- 768px: the header and team-count summary remain balanced without awkward single-word wrapping.
- 390px: horizontal movement is contained inside the leaderboard card and the page itself does not overflow.

Also confirm keyboard focus is visible on the table viewport and reduced-motion settings do not affect leaderboard readability.

- [ ] **Step 6: Commit documentation after verification**

```bash
git add README.md
git commit -m "docs: explain leaderboard update workflow"
```

- [ ] **Step 7: Present the preview and wait for explicit publication approval**

Report the local URLs, imported team count, verification results, and current commit hashes. Do not push until the user explicitly approves the rendered pages.
