import { createApp, renderToString } from '@vue-tui/runtime'

import CardApp from './card-app.vue'

if (!process.stdin.isTTY || !process.stdout.isTTY) {
  process.stdout.write(`${renderToString(CardApp)}\n`)
  process.exit(0)
}

const app = createApp(CardApp)

app.mount({
  alternateScreen: true,
  exitOnCtrlC: true,
  rawMode: 'always'
})

await app.waitUntilExit()
