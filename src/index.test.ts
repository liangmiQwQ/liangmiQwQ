import { expect, it, vi } from 'vitest'

it('renders the personal CLI card', async () => {
  vi.resetModules()

  const messages: unknown[][] = []
  const log = vi.spyOn(console, 'log').mockImplementation((...message) => {
    messages.push(message)
  })
  vi.stubEnv('NO_COLOR', '1')

  try {
    await import('./index')

    expect(messages).toHaveLength(1)

    const output = String(messages[0]?.[0])

    expect(output).toContain('Liang / liangmiQwQ')
    expect(output).toContain('Vite+ Team Member')
    expect(output).toContain('shaping Vite+ DX')
    expect(output).toContain('liangmi.dev')
    expect(output).toContain('GitHub map')
    expect(output).toContain('vue-oxlint-toolkit')
  } finally {
    vi.unstubAllEnvs()
    log.mockRestore()
  }
})
