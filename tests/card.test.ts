import { cleanup, render } from '@vue-tui/testing'
import { afterEach, describe, expect, it, vi } from 'vite-plus/test'

import CardApp from '../src/card-app.vue'
import { avatarPngBase64 } from '../src/tui/assets/avatar.ts'
import {
  createKittyImageChunks,
  createKittyImageTransfer,
  createKittyPlaceholderLines,
  supportsKittyImageRendering
} from '../src/tui/kitty-image.ts'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('card app', () => {
  it('renders the profile screen sections', async () => {
    let resolveFetch!: (response: Response) => void
    const fetchPromise = new Promise<Response>(resolve => {
      resolveFetch = resolve
    })
    const fetchMock = vi.fn<typeof fetch>(() => fetchPromise)

    vi.stubGlobal('fetch', fetchMock)

    const { lastFrame, waitUntilRenderFlush } = await render(CardApp)
    const loadingOutput = lastFrame()

    expect(loadingOutput).toContain('GitHub Contributions')
    expect(loadingOutput).toContain('Fetching contributions...')

    resolveFetch(
      new Response(createContributionCalendarHtml(), {
        status: 200
      })
    )
    await waitUntilRenderFlush()
    await waitUntilRenderFlush()

    const output = lastFrame()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://github.com/users/liangmiQwQ/contributions',
      expect.objectContaining({
        headers: {
          accept: 'text/html'
        }
      })
    )
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
    expect(output).toContain('12 contributions in the last year')
    expect(output).toContain('Less')
    expect(output).toContain('More')
    expect(output).toContain('hi@liangmi.dev')
    expect(output).toContain('\u001B]8;;https://github.com/liangmiQwQ')
    expect(output).toContain('Press q or Esc to exit.')
    expect(output).not.toContain('┌')
    expect(output).not.toContain('╭')
  })
})

function createContributionCalendarHtml() {
  const startDate = new Date(Date.UTC(2026, 5, 21))
  const levels = [0, 1, 2, 3, 4, 1, 0, 2, 3, 4, 0, 1, 2, 3]
  const days = levels
    .map((level, index) => {
      const date = new Date(startDate)
      date.setUTCDate(startDate.getUTCDate() + index)

      return `<td class="ContributionCalendar-day" data-date="${date.toISOString().slice(0, 10)}" data-level="${level}"></td>`
    })
    .join('')

  return `
    <h2 id="js-contribution-activity-description">
      12 contributions in the last year
    </h2>
    <table>${days}</table>
  `
}

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
