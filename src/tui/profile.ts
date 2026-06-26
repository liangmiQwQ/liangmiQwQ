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
  readonly href?: string
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
    'LL       III     AAA    NN   NN   GGGG',
    'LL        I     A   A   NNN  NN  GG   ',
    'LL        I    AAAAAAA  NN N NN  GG GGG',
    'LL        I    AA   AA  NN  NNN  GG  GG',
    'LLLLLL   III   AA   AA  NN   NN   GGGG'
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
  { label: 'X', value: 'liangmiQwQ', href: 'https://x.com/liangmiQwQ' },
  { label: 'GitHub', value: 'liangmiQwQ', href: 'https://github.com/liangmiQwQ' },
  { label: 'Email', value: 'hi@liangmi.dev' }
]
