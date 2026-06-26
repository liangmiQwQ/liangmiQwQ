import pc from 'picocolors'

const contentWidth = 78
const avatarWidth = 10
const gap = '  '

const avatar = ['  ▟██▙   ', ' ▟████▙  ', ' ██▛▜██  ', ' ██▙▟██  ', ' ▜████▛  ', '  LIANG  ']

const projects = ['mo', 'simple-introduce', '@liangmi/vp-config', 'vue-oxlint-toolkit']

const contributionRows = [
  [0, 0, 1, 2, 3, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0, 0],
  [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1]
]

const contributionShades = ['░', '░', '▒', '▓', '█']

const border = pc.gray
const accent = pc.cyan
const highlight = pc.magenta
const quiet = pc.dim

function line(content = '', styledContent = content) {
  const padding = ' '.repeat(Math.max(0, contentWidth - content.length))

  return `${border('│')} ${styledContent}${padding} ${border('│')}`
}

function row(avatarLine: string, content: string, styledContent = content) {
  const portrait = avatarLine.padEnd(avatarWidth)

  return line(`${portrait}${gap}${content}`, `${highlight(portrait)}${gap}${styledContent}`)
}

function badge(label: string) {
  return pc.bgCyan(pc.black(pc.bold(` ${label} `)))
}

function square(level: number) {
  if (level === 0) {
    return border('░')
  }
  if (level === 1) {
    return pc.green('░')
  }
  if (level === 2) {
    return pc.green('▒')
  }
  if (level === 3) {
    return pc.yellow('▓')
  }

  return pc.green(pc.bold('█'))
}

function contributionLine(label: string, value: number[]) {
  const plain = `${label}${value.map(level => contributionShades[level]).join(' ')}`
  const styled = `${quiet(label)}${value.map(square).join(' ')}`

  return row('', plain, styled)
}

console.log(
  [
    border(`╭${'─'.repeat(contentWidth + 2)}╮`),
    row(
      avatar[0],
      'Liang / liangmiQwQ                                      liangmi.dev',
      `${pc.bold(accent('Liang'))} ${quiet('/')} ${pc.bold('liangmiQwQ')}${' '.repeat(38)}${accent('liangmi.dev')}`
    ),
    row(
      avatar[1],
      'Vite+ Team Member  shaping Vite+ DX and OSS maintainer workflows',
      `${badge('Vite+ Team Member')} ${quiet('shaping Vite+ DX and OSS maintainer workflows')}`
    ),
    row(
      avatar[2],
      'Student developer in Hangzhou, China',
      quiet('Student developer in Hangzhou, China')
    ),
    row(
      avatar[3],
      'Rust · JavaScript · TypeScript · product UX · open source',
      `${accent('Rust')} ${quiet('·')} ${accent('JavaScript')} ${quiet('·')} ${accent('TypeScript')} ${quiet('· product UX · open source')}`
    ),
    row(
      avatar[4],
      'Designs developer products with good UX',
      quiet('Designs developer products with good UX')
    ),
    row(
      avatar[5],
      'GitHub / Twitter / Discord  @liangmiQwQ',
      `${quiet('GitHub / Twitter / Discord')}  ${accent('@liangmiQwQ')}`
    ),
    line(),
    ...contributionRows.map((value, index) =>
      contributionLine(index === 0 ? 'GitHub map  ' : '            ', value)
    ),
    line(),
    row(
      '',
      `Projects    ${projects.slice(0, 3).join(' · ')}`,
      `${quiet('Projects    ')}${projects.slice(0, 3).map(accent).join(quiet(' · '))}`
    ),
    row('', `            ${projects[3]}`, `${quiet('            ')}${accent(projects[3])}`),
    border(`╰${'─'.repeat(contentWidth + 2)}╯`)
  ].join('\n')
)
