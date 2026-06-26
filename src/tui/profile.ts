export interface Profile {
  readonly avatar: readonly string[]
  readonly nameArt: readonly string[]
  readonly name: string
  readonly handle: string
  readonly description: string
  readonly bio: string
  readonly titles: readonly string[]
  readonly location: string
}

export interface Project {
  readonly name: string
  readonly description: string
}

export interface Contact {
  readonly label: string
  readonly value: string
}

export const profile: Profile = {
  avatar: [
    '  ########  ',
    ' ##      ## ',
    '##  LM    ##',
    '##  QwQ   ##',
    ' ##      ## ',
    '  ########  '
  ],
  nameArt: [
    ' _     _                         ',
    '| |   (_)                        ',
    '| |    _  __ _ _ __   __ _       ',
    "| |   | |/ _` | '_ \\ / _` |      ",
    '| |___| | (_| | | | | (_| |      ',
    String.raw`\_____/_|\__, |_| |_|\__, |      `,
    '          __/ |       __/ |      ',
    '         |___/       |___/       '
  ],
  name: 'Liang',
  handle: 'liangmiQwQ',
  description: 'Student developer, active in JavaScript ecosystem, love open source!',
  bio: 'A bird that yearns for freedom can never be caged.',
  titles: ['Vite+ Team Member'],
  location: 'Hangzhou, China'
}

export const projects: readonly Project[] = [
  { name: 'voidzero-dev/vite-plus', description: '' },
  { name: 'liangmiQwQ/mo', description: '' },
  { name: 'liangmiQwQ/simple-introduce', description: '' },
  { name: 'liangmiQwQ/vue-oxlint-toolkit', description: '' },
  { name: 'liangmiQwQ/vp-config', description: '' }
]

export const contacts: readonly Contact[] = [
  { label: 'X', value: 'liangmiQwQ' },
  { label: 'GitHub', value: 'liangmiQwQ' },
  { label: 'Email', value: 'hi@liangmi.dev' }
]
