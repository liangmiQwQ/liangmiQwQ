export type TerminalColorScheme = 'dark' | 'light'

interface ContributionMapTheme {
  readonly contributionColors: readonly [string, string, string, string, string]
  readonly skeletonColor: string
}

const contributionMapThemes = {
  dark: {
    contributionColors: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    skeletonColor: '#30363d'
  },
  light: {
    contributionColors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    skeletonColor: '#d0d7de'
  }
} as const satisfies Record<TerminalColorScheme, ContributionMapTheme>

const ansi16Luminance = [
  0, 0.21, 0.36, 0.57, 0.07, 0.28, 0.43, 0.75, 0.5, 0.5, 0.71, 0.93, 0.29, 0.5, 0.79, 1
] as const

export function getContributionMapTheme(env: NodeJS.ProcessEnv = process.env) {
  return contributionMapThemes[detectTerminalColorScheme(env)]
}

export function detectTerminalColorScheme(
  env: NodeJS.ProcessEnv = process.env
): TerminalColorScheme {
  const override = normalizeColorScheme(env.LIANGMIQWQ_COLOR_SCHEME)
  if (override) {
    return override
  }

  const backgroundColor = getColorFgBgBackgroundIndex(env.COLORFGBG)
  if (backgroundColor !== undefined) {
    return getAnsiColorScheme(backgroundColor)
  }

  return 'dark'
}

function normalizeColorScheme(value: string | undefined): TerminalColorScheme | undefined {
  const normalized = value?.toLowerCase()
  if (normalized === 'dark' || normalized === 'light') {
    return normalized
  }

  return undefined
}

function getColorFgBgBackgroundIndex(colorFgBg: string | undefined): number | undefined {
  const parts = colorFgBg?.split(';').filter(Boolean)
  const background = Number.parseInt(parts?.at(-1) ?? '', 10)

  if (Number.isNaN(background) || background < 0 || background > 15) {
    return undefined
  }

  return background
}

function getAnsiColorScheme(colorIndex: number): TerminalColorScheme {
  return ansi16Luminance[colorIndex] > 0.6 ? 'light' : 'dark'
}
