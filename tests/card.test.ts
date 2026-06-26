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
    expect(output).toContain('Student developer')
    expect(output).toContain('JavaScript')
    expect(output).toContain('A bird that yearns')
    expect(output).toContain('Vite+ Team Member')
    expect(output).toContain('Hangzhou, China')
    expect(output).toContain('Projects')
    expect(output).toContain('voidzero-dev/vite-plus')
    expect(output).toContain('liangmiQwQ/vp-config')
    expect(output).toContain('GitHub Contributions')
    expect(output).toContain('53 x 7 placeholder')
    expect(output).toContain('hi@liangmi.dev')
    expect(output).toContain('\u001B]8;;https://github.com/liangmiQwQ')
    expect(output).toContain('Feel free to reach me out')
    expect(output).toContain('Press q or Esc to exit.')
    expect(output).not.toContain('┌')
    expect(output).not.toContain('╭')
  })
})
