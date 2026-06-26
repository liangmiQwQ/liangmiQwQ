import { cli } from '@liangmi/vp-config'
import vue from '@vitejs/plugin-vue'

function createPackVuePlugins() {
  return [vue()] as never
}

const config = cli({
  staged: {
    '*': 'vp check --fix'
  },
  fmt: {
    ignorePatterns: ['./introduce.svg']
  },
  pack: {
    plugins: createPackVuePlugins(),
    entry: ['./src/index.ts']
  }
})

config.lint!.plugins = config.lint?.plugins?.filter(e => e !== 'react')

export default config
