import { liangmi } from '@liangmi/vp-config'
import vue from '@vitejs/plugin-vue'

function createVuePlugins() {
  return [vue()] as never
}

const config = await liangmi({
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

export default config
