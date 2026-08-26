// @vitest-environment node

import { execFile } from 'node:child_process'
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'
import {
  importLeaderboard,
  parseLeaderboardCsv,
  renderGeneratedModule,
} from './import-leaderboard.mjs'

const execFileAsync = promisify(execFile)
const scriptPath = fileURLToPath(
  new URL('./import-leaderboard.mjs', import.meta.url),
)
const temporaryDirectories = []

const sampleCsv = `\ufeffrank,team_name,team_id,total_score,status
8,JustTry - Private Leader 08,T000017,17.26342222271593,valid
2,sota - Private Leader 02,T000012,61.89411995284824,valid
4,Horizon - Private Leader 04,T000011,45.316634329010284,valid
1,npu-eai - Private Leader 01,T000015,73.89246498024903,valid
9,Excluded - Private Leader 09,T000018,10.5,invalid
7,Nova - Private Leader 07,T000016,25.256173270406542,valid
3,Primotion - Private Leader 03,T000010,61.354957482506116,valid
6,Spark - Private Leader 06,T000014,32.23415088544078,valid
5,RoboDeamers - Private Leader 05,T000013,38.2048171454412,valid
`

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  )
})

async function makeTemporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'leaderboard-import-'))
  temporaryDirectories.push(directory)
  return directory
}

describe('parseLeaderboardCsv', () => {
  it('publishes the exact valid rows in ascending rank order', () => {
    const result = parseLeaderboardCsv(sampleCsv)

    expect(result.skippedRows).toBe(1)
    expect(result.entries).toEqual([
      {
        rank: 1,
        teamId: 'T000015',
        teamName: 'npu-eai',
        totalScore: 73.89246498024903,
      },
      {
        rank: 2,
        teamId: 'T000012',
        teamName: 'sota',
        totalScore: 61.89411995284824,
      },
      {
        rank: 3,
        teamId: 'T000010',
        teamName: 'Primotion',
        totalScore: 61.354957482506116,
      },
      {
        rank: 4,
        teamId: 'T000011',
        teamName: 'Horizon',
        totalScore: 45.316634329010284,
      },
      {
        rank: 5,
        teamId: 'T000013',
        teamName: 'RoboDeamers',
        totalScore: 38.2048171454412,
      },
      {
        rank: 6,
        teamId: 'T000014',
        teamName: 'Spark',
        totalScore: 32.23415088544078,
      },
      {
        rank: 7,
        teamId: 'T000016',
        teamName: 'Nova',
        totalScore: 25.256173270406542,
      },
      {
        rank: 8,
        teamId: 'T000017',
        teamName: 'JustTry',
        totalScore: 17.26342222271593,
      },
    ])
  })

  it('handles quoted commas, UTF-8, and escaped quotes with one privacy delimiter', () => {
    const result = parseLeaderboardCsv(
      'rank,team_name,team_id,total_score\n1,"研究, ""Robotics"" - Private Person",T009999,80.125\n',
    )

    expect(result.entries[0]).toEqual({
      rank: 1,
      teamId: 'T009999',
      teamName: '研究, "Robotics"',
      totalScore: 80.125,
    })
    expect(result.skippedRows).toBe(0)
  })

  it('rejects multiple privacy delimiters without exposing the raw team_name', () => {
    const csv =
      'rank,team_name,team_id,total_score\n1,Research Team - Lab - Private Person,T009999,80.125\n'

    expect(() => parseLeaderboardCsv(csv)).toThrow(
      'Row 2: team_name must contain exactly one privacy delimiter',
    )
    try {
      parseLeaderboardCsv(csv)
    } catch (error) {
      expect(String(error)).not.toContain('Research Team')
      expect(String(error)).not.toContain('Private Person')
    }
  })

  it.each([
    [
      'public header',
      'rank,team_name,team_id,total_score, rank \n1,Unsafe Raw Name,T1,10,1\n',
      'Duplicate CSV header: rank',
    ],
    [
      'status header',
      'rank,team_name,team_id,total_score,status,status\n1,Unsafe Raw Name,T1,10,valid,valid\n',
      'Duplicate CSV header: status',
    ],
  ])('rejects a duplicate normalized %s before parsing rows', (_, csv, message) => {
    expect(() => parseLeaderboardCsv(csv)).toThrow(message)
    try {
      parseLeaderboardCsv(csv)
    } catch (error) {
      expect(String(error)).not.toContain('Unsafe Raw Name')
    }
  })

  it('skips blank and non-valid statuses when the optional header is present', () => {
    const result = parseLeaderboardCsv(
      'rank,team_name,team_id,total_score,status\n1,A - Person,T1,10, VALID \n2,B - Person,T2,9,\n3,C - Person,T3,8,pending\n',
    )

    expect(result.entries).toEqual([
      { rank: 1, teamId: 'T1', teamName: 'A', totalScore: 10 },
    ])
    expect(result.skippedRows).toBe(2)
  })

  it.each([
    ['exponent notation', '1e2'],
    ['hex notation', '0x10'],
    ['decimal notation', '1.0'],
    ['explicit plus sign', '+1'],
    ['negative sign', '-1'],
    ['zero', '0'],
    ['unsafe integer', '9007199254740992'],
  ])('rejects rank in %s form', (_, rank) => {
    const csv = `rank,team_name,team_id,total_score\n${rank},Team - Person,T1,10\n`

    expect(() => parseLeaderboardCsv(csv)).toThrow(
      'Row 2: rank must be a positive integer',
    )
  })

  it('accepts signed integer and fractional decimal scores', () => {
    const result = parseLeaderboardCsv(
      'rank,team_name,team_id,total_score\n1,A - Person,T1,+10\n2,B - Person,T2,-0.25\n',
    )

    expect(result.entries.map(({ totalScore }) => totalScore)).toEqual([
      10, -0.25,
    ])
  })

  it.each([
    ['hex notation', '0x10'],
    ['exponent notation', '1e2'],
    ['positive infinity', 'Infinity'],
    ['negative infinity', '-Infinity'],
    ['not-a-number text', 'NaN'],
    ['blank text', ''],
  ])('rejects total_score in %s form', (_, totalScore) => {
    const csv = `rank,team_name,team_id,total_score\n1,Team - Person,T1,${totalScore}\n`

    expect(() => parseLeaderboardCsv(csv)).toThrow(
      'Row 2: total_score must be a finite number',
    )
  })

  it.each([
    [
      'missing header',
      'rank,team_name,team_id,status\n1,Team - Person,T1,valid\n',
      'Missing required CSV header: total_score',
    ],
    [
      'invalid rank',
      'rank,team_name,team_id,total_score,status\nzero,Team - Person,T1,10,valid\n',
      'Row 2: rank must be a positive integer',
    ],
    [
      'missing privacy delimiter',
      'rank,team_name,team_id,total_score,status\n1,Unsafe Raw Name,T1,10,valid\n',
      'Row 2: team_name must use the required privacy delimiter',
    ],
    [
      'empty sanitized name',
      'rank,team_name,team_id,total_score,status\n1," - Private Person",T1,10,valid\n',
      'Row 2: sanitized team name must not be empty',
    ],
    [
      'empty Team ID',
      'rank,team_name,team_id,total_score,status\n1,Team - Person,,10,valid\n',
      'Row 2: team_id must not be empty',
    ],
    [
      'duplicate Team ID',
      'rank,team_name,team_id,total_score,status\n1,A - Person,T1,10,valid\n2,B - Person,T1,9,valid\n',
      'Duplicate Team ID: T1',
    ],
    [
      'duplicate rank',
      'rank,team_name,team_id,total_score,status\n1,A - Person,T1,10,valid\n1,B - Person,T2,9,valid\n',
      'Duplicate rank: 1',
    ],
    [
      'invalid score',
      'rank,team_name,team_id,total_score,status\n1,A - Person,T1,not-a-number,valid\n',
      'Row 2: total_score must be a finite number',
    ],
    [
      'empty score',
      'rank,team_name,team_id,total_score,status\n1,A - Person,T1,,valid\n',
      'Row 2: total_score must be a finite number',
    ],
    [
      'no valid rows',
      'rank,team_name,team_id,total_score,status\n1,Private Raw Name,T1,10,invalid\n',
      'No valid leaderboard rows were found',
    ],
  ])('rejects %s without exposing private team_name content', (_, csv, message) => {
    expect(() => parseLeaderboardCsv(csv)).toThrow(message)

    try {
      parseLeaderboardCsv(csv)
    } catch (error) {
      expect(String(error)).not.toContain('Private Person')
      expect(String(error)).not.toContain('Private Raw Name')
      expect(String(error)).not.toContain('Unsafe Raw Name')
    }
  })

  it('wraps malformed CSV errors without exposing private field values', () => {
    const malformedCsv =
      'rank,team_name,team_id,total_score\n1,"Secret Team - Private Leader 01,T1,10\n'

    expect(() => parseLeaderboardCsv(malformedCsv)).toThrow(
      'Unable to parse leaderboard CSV',
    )
    try {
      parseLeaderboardCsv(malformedCsv)
    } catch (error) {
      expect(String(error)).not.toContain('Secret Team')
      expect(String(error)).not.toContain('Private Leader 01')
    }
  })
})

describe('renderGeneratedModule', () => {
  it('contains only public fields, safely serialized strings, and full score precision', () => {
    const output = renderGeneratedModule(parseLeaderboardCsv(sampleCsv).entries)

    expect(output).toContain('export interface ChallengeLeaderboardEntry')
    expect(output).toContain('teamName: "npu-eai"')
    expect(output).toContain('totalScore: 73.89246498024903')
    expect(output).toContain(
      'export const challengeLeaderboardEntries = [',
    )
    expect(output).not.toContain('Private Leader')
    expect(output).not.toContain('status')
    expect(output).not.toContain('leaderName')
  })

  it('round-trips hostile string content without executing it', async () => {
    const directory = await makeTemporaryDirectory()
    const modulePath = join(directory, 'generated.mjs')
    const executionMarker = '__leaderboardGeneratedCodeExecuted'
    const entry = {
      rank: 1,
      teamId: 'T"\\\n\u2028\u2029',
      teamName: `Quoted "team" \\ path
next\u2028line\u2029"}]; globalThis.${executionMarker} = true; //`,
      totalScore: 12.345678901234567,
    }
    delete globalThis[executionMarker]

    const output = renderGeneratedModule([entry])
    const executableModule = output
      .replace(
        /export interface ChallengeLeaderboardEntry \{[\s\S]*?\}\n\n/,
        '',
      )
      .replace(
        '] as const satisfies readonly ChallengeLeaderboardEntry[]',
        ']',
      )
    await writeFile(modulePath, executableModule)

    try {
      const importedModule = await import(
        `${pathToFileURL(modulePath).href}?test=${Date.now()}`
      )
      expect(importedModule.challengeLeaderboardEntries).toEqual([entry])
      expect(globalThis[executionMarker]).toBeUndefined()
    } finally {
      delete globalThis[executionMarker]
    }
  })
})

describe('importLeaderboard', () => {
  it('does not overwrite the generated module when validation fails', async () => {
    const directory = await makeTemporaryDirectory()
    const inputPath = join(directory, 'bad.csv')
    const outputPath = join(directory, 'challengeLeaderboard.generated.ts')
    await writeFile(
      inputPath,
      'rank,team_name,team_id,total_score,status\n1,Unsafe,T1,10,valid\n',
    )
    await writeFile(outputPath, 'existing generated content\n')

    await expect(importLeaderboard(inputPath, outputPath)).rejects.toThrow(
      'Row 2: team_name must use the required privacy delimiter',
    )
    await expect(readFile(outputPath, 'utf8')).resolves.toBe(
      'existing generated content\n',
    )
  })

  it('atomically writes valid output and reports successful counts', async () => {
    const directory = await makeTemporaryDirectory()
    const inputPath = join(directory, 'results.csv')
    const outputPath = join(directory, 'challengeLeaderboard.generated.ts')
    await writeFile(inputPath, sampleCsv)
    await writeFile(outputPath, 'old generated output\n')

    await expect(importLeaderboard(inputPath, outputPath)).resolves.toEqual({
      importedRows: 8,
      skippedRows: 1,
      failedRows: 0,
      outputPath,
    })
    await expect(readFile(outputPath, 'utf8')).resolves.toBe(
      renderGeneratedModule(parseLeaderboardCsv(sampleCsv).entries),
    )
    await expect(readdir(directory)).resolves.toEqual(
      expect.arrayContaining([
        'challengeLeaderboard.generated.ts',
        'results.csv',
      ]),
    )
    await expect(readdir(directory)).resolves.toHaveLength(2)
  })

  it('cleans the temporary file when atomic replacement fails', async () => {
    const directory = await makeTemporaryDirectory()
    const inputPath = join(directory, 'results.csv')
    const outputPath = join(directory, 'occupied-output')
    await writeFile(inputPath, sampleCsv)
    await mkdir(outputPath)

    await expect(importLeaderboard(inputPath, outputPath)).rejects.toThrow()
    await expect(readdir(directory)).resolves.toEqual(
      expect.arrayContaining(['occupied-output', 'results.csv']),
    )
    await expect(readdir(directory)).resolves.toHaveLength(2)
  })
})

describe('command line interface', () => {
  it('exits nonzero with usage when the input path is missing', async () => {
    await expect(execFileAsync(process.execPath, [scriptPath])).rejects.toMatchObject(
      {
        code: 1,
        stderr: expect.stringContaining(
          'Usage: npm run leaderboard:import -- /absolute/path/to/results.csv',
        ),
      },
    )
  })
})
