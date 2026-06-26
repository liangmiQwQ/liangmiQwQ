import { cleanup, render } from '@vue-tui/testing'
import { afterEach, describe, expect, it } from 'vite-plus/test'

import CardApp from '../src/card-app.vue'

afterEach(cleanup)

describe('card app', () => {
  it('renders the footer identity', async () => {
    const { lastFrame } = await render(CardApp)
    const output = lastFrame()

    expect(output).toContain('Liang')
    expect(output).toContain('liangmiQwQ')
  })
})
