import { cleanup, render } from '@vue-tui/testing'
import { afterEach, describe, expect, it } from 'vite-plus/test'

import CardApp from '../src/card-app.vue'
import { avatarPngBase64 } from '../src/tui/assets/avatar.ts'
import {
  createKittyImageChunks,
  createKittyImageTransfer,
  createKittyPlaceholderLines,
  supportsKittyImageRendering
} from '../src/tui/kitty-image.ts'

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
    expect(output).toContain('Hangzhou, China')
    expect(output).toContain('Time')
    expect(output).toContain('UTC+8')
    expect(output).toMatch(/\d{2}:\d{2}/)
    expect(output).not.toMatch(/\d{2}:\d{2}:\d{2}/)
    expect(output).toContain('Projects')
    expect(output).toContain('voidzero-dev/vite-plus')
    expect(output).toContain('liangmiQwQ/vp-config')
    expect(output).toContain('GitHub Contributions')
    expect(output).toContain('53 x 7 placeholder')
    expect(output).toContain('hi@liangmi.dev')
    expect(output).toContain('\u001B]8;;https://github.com/liangmiQwQ')
    expect(output).toContain('Press q or Esc to exit.')
    expect(output).not.toContain('┌')
    expect(output).not.toContain('╭')
  })
})

describe('kitty image rendering', () => {
  it('builds chunked PNG transfer commands for virtual placements', () => {
    const chunks = createKittyImageChunks('a'.repeat(5000), {
      imageId: 0x12_34_56,
      columns: 2,
      rows: 2,
      chunkSize: 4000
    })

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toContain('\u001B_Ga=T,f=100,t=d,q=2,U=1,i=1193046,c=2,r=2,m=1;')
    expect(chunks[1]).toContain('\u001B_Gm=0;')
  })

  it('builds a single uninterrupted Kitty transfer for multi-chunk images', () => {
    const transfer = createKittyImageTransfer('a'.repeat(9000), {
      imageId: 0x12_34_56,
      columns: 2,
      rows: 2,
      chunkSize: 4000
    })

    expect(transfer).toContain('\u001B_Ga=T,f=100,t=d,q=2,U=1,i=1193046,c=2,r=2,m=1;')
    expect(transfer).toContain('\u001B_Gm=1;')
    expect(transfer).toContain('\u001B_Gm=0;')
    expect(transfer).not.toContain('\n')
  })

  it('builds Kitty placeholder cells with the image id encoded as truecolor', () => {
    const lines = createKittyPlaceholderLines({
      imageId: 0x12_34_56,
      columns: 2,
      rows: 2
    })

    expect(lines).toHaveLength(2)
    expect(lines[0]).toContain('\u001B[38;2;18;52;86m')
    expect(lines[0]).toContain(String.fromCodePoint(1_109_742))
    expect(lines[0]).toContain('\u0305')
    expect(lines[1]).toContain('\u030D')
  })

  it('encodes placeholder column 13 for the larger avatar size', () => {
    const [line] = createKittyPlaceholderLines({
      imageId: 0x12_34_56,
      columns: 13,
      rows: 1
    })

    expect(line).toContain('\u0350')
  })

  it('only enables runtime image transfer for Kitty terminals', () => {
    expect(supportsKittyImageRendering({ KITTY_WINDOW_ID: '1' })).toBeTruthy()
    expect(supportsKittyImageRendering({ TERM: 'xterm-kitty' })).toBeTruthy()
    expect(supportsKittyImageRendering({ TERM: 'xterm-ghostty' })).toBeTruthy()
    expect(supportsKittyImageRendering({ TERM_PROGRAM: 'ghostty' })).toBeTruthy()
    expect(supportsKittyImageRendering({ TERM: 'xterm-256color' })).toBeFalsy()
  })

  it('uses a bundled PNG avatar payload', () => {
    const bytes = Buffer.from(avatarPngBase64, 'base64')

    expect(bytes.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  })
})
