import { cli } from '@liangmi/vp-config'
import vue from '@vitejs/plugin-vue'

function createVuePlugins() {
  return [vue()] as never
}

const config = cli({
  staged: {
    '*': 'vp check --fix'
  },
  fmt: {
    ignorePatterns: ['./introduce.svg']
  },
  test: {
    environment: './tests/tui-node-environment.ts'
  },
  pack: {
    plugins: createVuePlugins(),
    entry: ['./src/index.ts']
  }
})

config.plugins = createVuePlugins()
config.lint!.plugins = config.lint?.plugins?.filter(e => e !== 'react')

export default config
