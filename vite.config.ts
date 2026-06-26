import { cli } from '@liangmi/vp-config'

export default cli({
  staged: {
    '*': 'vp check --fix'
  },
  fmt: {
    ignorePatterns: ['./introduce.svg']
  },
  pack: {
    entry: ['./src/index.ts']
  }
})
