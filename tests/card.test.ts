import { cleanup, render } from '@vue-tui/testing'
import { afterEach, describe, expect, it } from 'vite-plus/test'

import CardApp from '../src/card-app.vue'

afterEach(cleanup)

describe('card app', () => {
  it('renders the profile screen sections', async () => {
    const { lastFrame } = await render(CardApp)
    const output = lastFrame()

    expect(output).toContain('Liang')
    expect(output).toContain('@liangmiQwQ')
    expect(output).toContain('Student developer, active in JavaScript ecosystem, love open source!')
    expect(output).toContain('A bird that yearns for freedom can never be caged.')
    expect(output).toContain('Vite+ Team Member')
    expect(output).toContain('Hangzhou, China')
    expect(output).toContain('Projects')
    expect(output).toContain('voidzero-dev/vite-plus')
    expect(output).toContain('liangmiQwQ/vp-config')
    expect(output).toContain('GitHub Contributions')
    expect(output).toContain('green wall placeholder')
    expect(output).toContain('hi@liangmi.dev')
    expect(output).toContain('Feel free to reach me out')
  })
})
