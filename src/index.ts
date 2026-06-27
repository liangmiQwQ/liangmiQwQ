import { createApp, renderToString } from '@vue-tui/runtime'

import CardApp from './card-app.vue'
import { loadTerminalColorScheme } from './tui/terminal-theme.ts'
import { loadContributionCalendar } from './tui/use-contribution-map.ts'

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 5000)

  try {
    await loadContributionCalendar(controller.signal)
  } catch {
    // The preload stores an error state so renderToString can still complete.
  } finally {
    clearTimeout(timeout)
  }

  process.stdout.write(`${renderToString(CardApp)}\n`)
  process.exit(0)
}

await loadTerminalColorScheme()

const app = createApp(CardApp)

app.mount({
  alternateScreen: true,
  exitOnCtrlC: true,
  rawMode: 'always'
})

await app.waitUntilExit()
