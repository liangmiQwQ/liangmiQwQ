import type { Environment } from 'vite-plus/test/environments'

const tuiNodeEnvironment = {
  name: 'tui-node',
  viteEnvironment: 'client',
  setup() {
    return {
      teardown: () => Promise.resolve()
    }
  }
} satisfies Environment

// Vitest custom environments are loaded through a default export.
// oxlint-disable-next-line import/no-default-export
export default tuiNodeEnvironment
