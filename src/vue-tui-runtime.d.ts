declare module '@vue-tui/runtime' {
  import type { Component } from 'vue'

  export interface Key {
    escape: boolean
    ctrl: boolean
  }

  export interface MountOptions {
    alternateScreen?: boolean
    exitOnCtrlC?: boolean
    rawMode?: 'always' | 'auto'
  }

  export interface TuiApp {
    mount: (options?: MountOptions) => unknown
    waitUntilExit: () => Promise<unknown>
  }

  export const Box: Component
  export const Text: Component

  export const createApp: (root: Component) => TuiApp
  export const renderToString: (component: Component) => string
  export const useApp: () => {
    exit: (errorOrResult?: unknown) => void
  }
  export const useInput: (handler: (input: string, key: Key) => void) => void
}
