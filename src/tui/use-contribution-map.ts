import { onMounted, onScopeDispose, readonly, shallowRef } from 'vue'

type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  readonly date: string
  readonly level: ContributionLevel
}

interface ContributionCalendar {
  readonly rows: readonly (readonly ContributionDay[])[]
  readonly monthLabelLine: string
  readonly totalText: string
}

const githubContributionsUrl = 'https://github.com/users/liangmiQwQ/contributions'
const cellWidth = 2
const rowLabelWidth = 4
const weekdayCount = 7

let cachedContributionCalendar: ContributionCalendar | undefined
let cachedErrorMessage = ''

const emptyContributionCalendar = createContributionCalendar([], '')

export async function loadContributionCalendar(signal?: AbortSignal) {
  try {
    cachedContributionCalendar = await fetchContributionCalendar(signal)
    cachedErrorMessage = ''
  } catch (error) {
    cachedErrorMessage = getContributionErrorMessage(error)
    throw error
  }
}

export function useContributionMap() {
  const contributionCalendar = shallowRef<ContributionCalendar>(
    cachedContributionCalendar ?? emptyContributionCalendar
  )
  const isLoading = shallowRef(
    cachedContributionCalendar === undefined && cachedErrorMessage === ''
  )
  const errorMessage = shallowRef(cachedErrorMessage)

  let controller: AbortController | undefined

  onMounted(async () => {
    if (cachedContributionCalendar || cachedErrorMessage) {
      return
    }

    controller = new AbortController()

    try {
      const calendar = await fetchContributionCalendar(controller.signal)
      cachedContributionCalendar = calendar
      contributionCalendar.value = calendar
    } catch (error) {
      if (controller.signal.aborted) {
        return
      }

      errorMessage.value = getContributionErrorMessage(error)
    } finally {
      if (!controller.signal.aborted) {
        isLoading.value = false
      }
    }
  })

  onScopeDispose(() => {
    controller?.abort()
  })

  return {
    contributionCalendar: readonly(contributionCalendar),
    errorMessage: readonly(errorMessage),
    isLoading: readonly(isLoading)
  }
}

async function fetchContributionCalendar(signal?: AbortSignal) {
  const response = await fetch(githubContributionsUrl, {
    headers: {
      accept: 'text/html'
    },
    signal
  })

  if (!response.ok) {
    throw new Error('Unable to load contributions')
  }

  return parseContributionCalendar(await response.text())
}

function getContributionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === 'Unable to load contributions') {
    return error.message
  }

  return 'Unable to load contributions'
}

function parseContributionCalendar(html: string) {
  const days = [...html.matchAll(/<td\b(?=[^>]*\bContributionCalendar-day\b)([^>]*)>/g)]
    .map(match => parseContributionDay(match[1]))
    .filter((day): day is ContributionDay => day !== undefined)

  return createContributionCalendar(days, parseTotalText(html))
}

function parseContributionDay(attributes: string): ContributionDay | undefined {
  const date = matchAttribute(attributes, 'data-date')
  if (!date) {
    return undefined
  }

  return {
    date,
    level: toContributionLevel(Number.parseInt(matchAttribute(attributes, 'data-level') ?? '0', 10))
  } satisfies ContributionDay
}

function matchAttribute(attributes: string, name: string) {
  const match = new RegExp(`\\b${name}="([^"]*)"`).exec(attributes)
  return match?.[1]
}

function parseTotalText(html: string) {
  const heading = /<h2\b[^>]*id="js-contribution-activity-description"[^>]*>([\s\S]*?)<\/h2>/.exec(
    html
  )?.[1]
  const text = heading
    ?.replaceAll(/<[^>]+>/g, ' ')
    .replaceAll(/\s+/g, ' ')
    .trim()
  return text ?? ''
}

function createContributionCalendar(days: readonly ContributionDay[], totalText: string) {
  if (days.length === 0) {
    const rows = createEmptyRows(53, getRecentCalendarStartDate())

    return {
      rows,
      monthLabelLine: createMonthLabelLine(rows),
      totalText
    } satisfies ContributionCalendar
  }

  const sortedDays = [...days].toSorted((a, b) => a.date.localeCompare(b.date))
  const startDate = startOfWeek(createUtcDate(sortedDays[0].date))
  const endDate = endOfWeek(createUtcDate(sortedDays.at(-1)!.date))
  const weekCount = Math.max(1, differenceInWeeks(startDate, endDate) + 1)
  const rows = createEmptyRows(weekCount, startDate)

  for (const day of sortedDays) {
    const date = createUtcDate(day.date)
    const rowIndex = date.getUTCDay()
    const columnIndex = differenceInWeeks(startDate, date)
    rows[rowIndex][columnIndex] = day
  }

  return {
    rows,
    monthLabelLine: createMonthLabelLine(rows),
    totalText
  } satisfies ContributionCalendar
}

function createEmptyRows(weekCount: number, startDate: Date): ContributionDay[][] {
  return Array.from({ length: weekdayCount }, (_, rowIndex) =>
    Array.from({ length: weekCount }, (_, columnIndex) => ({
      date: formatGithubDate(addDays(startDate, columnIndex * weekdayCount + rowIndex)),
      level: 0 as const
    }))
  )
}

function getRecentCalendarStartDate() {
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  return addDays(endOfWeek(today), -(53 * weekdayCount - 1))
}

function createMonthLabelLine(rows: readonly (readonly ContributionDay[])[]) {
  const weekCount = rows[0]?.length ?? 0
  const chars = Array.from({ length: rowLabelWidth + weekCount * cellWidth + 3 }, () => ' ')
  let lastLabelEnd = 0
  let previousMonthKey = ''

  for (let columnIndex = 0; columnIndex < weekCount; columnIndex += 1) {
    const labelDate = getMonthLabelDate(rows, columnIndex)
    if (!labelDate) {
      continue
    }

    const monthKey = `${labelDate.getUTCFullYear()}-${labelDate.getUTCMonth()}`
    if (monthKey === previousMonthKey) {
      continue
    }

    const labelStart = rowLabelWidth + columnIndex * cellWidth
    const label = labelDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })

    if (labelStart <= lastLabelEnd) {
      continue
    }

    for (let offset = 0; offset < label.length; offset += 1) {
      chars[labelStart + offset] = label[offset]
    }

    previousMonthKey = monthKey
    lastLabelEnd = labelStart + label.length
  }

  return chars.join('').trimEnd()
}

function getMonthLabelDate(rows: readonly (readonly ContributionDay[])[], columnIndex: number) {
  const dates = rows.map(row => createUtcDate(row[columnIndex].date))

  if (columnIndex === 0) {
    return dates[0]
  }

  return dates.find(date => date.getUTCDate() <= weekdayCount)
}

function startOfWeek(date: Date) {
  return addDays(date, -date.getUTCDay())
}

function endOfWeek(date: Date) {
  return addDays(date, weekdayCount - date.getUTCDay() - 1)
}

function differenceInWeeks(startDate: Date, endDate: Date) {
  return Math.floor(differenceInDays(startDate, endDate) / weekdayCount)
}

function differenceInDays(startDate: Date, endDate: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.floor((endDate.getTime() - startDate.getTime()) / millisecondsPerDay)
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date)
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

function createUtcDate(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function formatGithubDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function toContributionLevel(level: number): ContributionLevel {
  if (level <= 0 || Number.isNaN(level)) {
    return 0
  }

  if (level >= 4) {
    return 4
  }

  return level as ContributionLevel
}
