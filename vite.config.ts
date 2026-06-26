import { cli } from '@liangmi/vp-config'
import vue from '@vitejs/plugin-vue'
import type { PackUserConfig } from 'vite-plus/pack'

const config = cli({
  staged: {
    '*': 'vp check --fix'
  },
  fmt: {
    ignorePatterns: ['./introduce.svg']
  },
  pack: {
    plugins: [vue()] as unknown as PackUserConfig['plugins'],
    entry: ['./src/index.ts']
  }
})

config.lint!.plugins = config.lint?.plugins?.filter(e => e !== 'react')

export default config
