import pc from 'picocolors'

const width = 64

const projects = [
  ['mo', 'manage open source projects'],
  ['simple-introduce', 'fancy SVG intros for GitHub profiles'],
  ['@liangmi/vp-config', 'shared config for the Vite+ toolchain'],
  ['vue-oxlint-toolkit', 'experimental Oxlint + Vue toolkit']
] as const

const border = pc.gray
const accent = pc.cyan
const quiet = pc.dim

function line(content = '', styledContent = content) {
  const padding = ' '.repeat(Math.max(0, width - content.length))

  return `${border('|')} ${styledContent}${padding} ${border('|')}`
}

function projectLine(name: string, description: string) {
  const label = name.padEnd(20)

  return line(`${label}${description}`, `${accent(label)}${quiet(description)}`)
}

console.log(
  [
    border(`+${'-'.repeat(width + 2)}+`),
    line(
      'Liang / liangmiQwQ',
      `${pc.bold(accent('Liang'))} ${quiet('/')} ${pc.bold('liangmiQwQ')}`
    ),
    line(
      'Vite+ Team Member | student developer | JavaScript ecosystem',
      quiet('Vite+ Team Member | student developer | JavaScript ecosystem')
    ),
    line(),
    line('Hangzhou, China'),
    line('UX-minded OSS builder across Rust and JavaScript/TypeScript'),
    line(),
    line('Projects', pc.bold('Projects')),
    ...projects.map(([name, description]) => projectLine(name, description)),
    line(),
    line(
      'GitHub / Twitter / Discord @liangmiQwQ',
      `${quiet('GitHub / Twitter / Discord')} ${accent('@liangmiQwQ')}`
    ),
    border(`+${'-'.repeat(width + 2)}+`)
  ].join('\n')
)
