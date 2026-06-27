export type TerminalColorScheme = 'dark' | 'light'

interface TerminalColorInput {
  readonly isTTY?: boolean
  readonly isRaw?: boolean
  readonly off: (event: 'data', listener: (chunk: Buffer | string) => void) => unknown
  readonly on: (event: 'data', listener: (chunk: Buffer | string) => void) => unknown
  readonly setEncoding?: (encoding: BufferEncoding) => unknown
  readonly setRawMode?: (mode: boolean) => unknown
}

interface TerminalColorOutput {
  readonly isTTY?: boolean
  readonly write: (data: string) => unknown
}

interface LoadTerminalColorSchemeOptions {
  readonly env?: NodeJS.ProcessEnv
  readonly stdin?: TerminalColorInput
  readonly stdout?: TerminalColorOutput
  readonly timeoutMs?: number
}

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

const terminalEscape = '\u001B'
const terminalBackgroundColorQuery = '\u001B]11;?\u0007'
const terminalBackgroundColorResponse = new RegExp(
  `${terminalEscape}]11;rgb:([0-9a-f]{1,4})/([0-9a-f]{1,4})/([0-9a-f]{1,4})(?:\\u0007|${terminalEscape}\\\\)`,
  'i'
)

let queriedTerminalColorScheme: TerminalColorScheme | undefined

export function getContributionMapTheme(env: NodeJS.ProcessEnv = process.env) {
  return contributionMapThemes[detectTerminalColorScheme(env)]
}

export async function loadTerminalColorScheme(options: LoadTerminalColorSchemeOptions = {}) {
  const env = options.env ?? process.env
  const envColorScheme = detectTerminalColorSchemeFromEnv(env)
  if (envColorScheme) {
    queriedTerminalColorScheme = envColorScheme
    return envColorScheme
  }

  const queriedColorScheme = await queryTerminalColorScheme({
    stdin: options.stdin ?? process.stdin,
    stdout: options.stdout ?? process.stdout,
    timeoutMs: options.timeoutMs ?? 120
  })

  queriedTerminalColorScheme = queriedColorScheme
  return detectTerminalColorScheme(env)
}

export function detectTerminalColorScheme(
  env: NodeJS.ProcessEnv = process.env
): TerminalColorScheme {
  return detectTerminalColorSchemeFromEnv(env) ?? queriedTerminalColorScheme ?? 'dark'
}

function detectTerminalColorSchemeFromEnv(env: NodeJS.ProcessEnv): TerminalColorScheme | undefined {
  const overrideColorScheme = normalizeColorScheme(env.LIANGMIQWQ_COLOR_SCHEME)
  if (overrideColorScheme) {
    return overrideColorScheme
  }

  const backgroundColor = getColorFgBgBackgroundIndex(env.COLORFGBG)
  if (backgroundColor !== undefined) {
    return getAnsiColorScheme(backgroundColor)
  }

  return undefined
}

async function queryTerminalColorScheme(options: {
  readonly stdin: TerminalColorInput
  readonly stdout: TerminalColorOutput
  readonly timeoutMs: number
}): Promise<TerminalColorScheme | undefined> {
  if (!options.stdin.isTTY || !options.stdout.isTTY) {
    return undefined
  }

  const wasRaw = options.stdin.isRaw === true
  const chunks: string[] = []
  let timeout: NodeJS.Timeout | undefined
  let onData!: (chunk: Buffer | string) => void

  const response = new Promise<TerminalColorScheme | undefined>(resolve => {
    onData = (chunk: Buffer | string) => {
      chunks.push(String(chunk))

      const colorScheme = parseTerminalBackgroundColorScheme(chunks.join(''))
      if (colorScheme) {
        resolve(colorScheme)
      }
    }
  })
  const timeoutResponse = new Promise<void>(resolve => {
    timeout = setTimeout(() => {
      resolve()
    }, options.timeoutMs)
  })

  try {
    options.stdin.setEncoding?.('utf8')
    options.stdin.setRawMode?.(true)
    options.stdin.on('data', onData)
    options.stdout.write(terminalBackgroundColorQuery)

    const colorScheme = await Promise.race([response, timeoutResponse])
    return colorScheme ?? undefined
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }

    options.stdin.off('data', onData)

    if (!wasRaw) {
      options.stdin.setRawMode?.(false)
    }
  }
}

function parseTerminalBackgroundColorScheme(response: string): TerminalColorScheme | undefined {
  const match = terminalBackgroundColorResponse.exec(response)
  if (!match) {
    return undefined
  }

  return getRgbColorScheme(
    normalizeHexColorComponent(match[1]),
    normalizeHexColorComponent(match[2]),
    normalizeHexColorComponent(match[3])
  )
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

function getRgbColorScheme(red: number, green: number, blue: number): TerminalColorScheme {
  const luminance = getRelativeLuminance(red, green, blue)
  return luminance > 0.5 ? 'light' : 'dark'
}

function normalizeHexColorComponent(component: string) {
  const max = 16 ** component.length - 1
  return Number.parseInt(component, 16) / max
}

function getRelativeLuminance(red: number, green: number, blue: number) {
  const [linearRed, linearGreen, linearBlue] = [red, green, blue].map(toLinearRgb)
  return 0.2126 * linearRed + 0.7152 * linearGreen + 0.0722 * linearBlue
}

function toLinearRgb(value: number) {
  if (value <= 0.039_28) {
    return value / 12.92
  }

  return ((value + 0.055) / 1.055) ** 2.4
}
