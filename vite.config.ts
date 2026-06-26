import { cli } from '@liangmi/vp-config'
import vue from '@vitejs/plugin-vue'
import type { PackUserConfig } from 'vite-plus/pack'

export default cli({
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
