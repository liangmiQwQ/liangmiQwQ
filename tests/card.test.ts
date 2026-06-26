import { renderToString } from '@vue-tui/runtime'
import { describe, expect, it } from 'vitest'

import { CardApp } from '../src/card.ts'

describe('card app', () => {
  it('renders the footer identity', () => {
    const output = renderToString(CardApp)

    expect(output).toContain('Liang')
    expect(output).toContain('liangmiQwQ')
  })
})
