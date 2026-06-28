import { avatarPngBase64 } from './assets/avatar.ts'

export interface Profile {
  readonly bird: readonly string[]
  readonly avatarPngBase64: string
  readonly name: string
  readonly handle: string
  readonly description: string
  readonly bio: string
  readonly location: string
}

export interface Project {
  readonly name: string
  readonly description: string
}

export interface Contact {
  readonly label: string
  readonly value: string
  readonly href?: string
}

export const profile: Profile = {
  bird: [
    '  .`.   _ _ ',
    '__;_ \\ /,//`',
    '--, `._) (  ',
    " '//,,,  |  ",
    '      )_/   ',
    '     /_|    '
  ],
  avatarPngBase64,
  name: 'Liang',
  handle: 'liangmiQwQ',
  description: 'Student developer, active in JavaScript ecosystem, love open source!',
  bio: 'A bird that yearns for freedom can never be caged.',
  location: 'Hangzhou, China'
}

export const projects: readonly Project[] = [
  {
    name: 'voidzero-dev/vite-plus',
    description: 'The united toolchain of JavaScript development. '
  },
  {
    name: 'liangmiQwQ/mo',
    description: 'Project manager for opensource developers using Github. '
  },
  {
    name: 'liangmiQwQ/simple-introduce',
    description: 'A useful tools to create Github profile image with animations. '
  },
  {
    name: 'liangmiQwQ/vue-oxlint-toolkit',
    description: `An experimental toolkit about Oxlint and Vue. `
  },
  {
    name: 'liangmiQwQ/vp-config',
    description: `Liang's united Vite+ config presets for JavaScript development. `
  }
]

export const contacts: readonly Contact[] = [
  { label: 'X', value: 'liangmiQwQ', href: 'https://x.com/liangmiQwQ' },
  { label: 'GitHub', value: 'liangmiQwQ', href: 'https://github.com/liangmiQwQ' },
  { label: 'Email', value: 'hi@liangmi.dev' }
]
