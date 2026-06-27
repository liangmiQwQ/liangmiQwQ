const kittyEscapeStart = '\u001B_G'
const kittyEscapeEnd = '\u001B\\'
const kittyPlaceholder = String.fromCodePoint(1_109_742)
const defaultChunkSize = 4096
const pngFormat = 100

const rowColumnDiacritics = [
  '\u0305',
  '\u030D',
  '\u030E',
  '\u0310',
  '\u0312',
  '\u033D',
  '\u033E',
  '\u033F',
  '\u0346',
  '\u034A',
  '\u034B',
  '\u034C',
  '\u0350'
] as const

export interface KittyImageOptions {
  readonly imageId: number
  readonly columns: number
  readonly rows: number
  readonly chunkSize?: number
}

export function createKittyImageChunks(base64Data: string, options: KittyImageOptions) {
  const chunkSize = options.chunkSize ?? defaultChunkSize
  const chunks = splitBase64(base64Data, chunkSize)

  return chunks.map((chunk, index) => {
    const more = index === chunks.length - 1 ? 0 : 1
    const control =
      index === 0
        ? `a=T,f=${pngFormat},t=d,q=2,U=1,i=${options.imageId},c=${options.columns},r=${options.rows},m=${more}`
        : `m=${more}`

    return `${kittyEscapeStart}${control};${chunk}${kittyEscapeEnd}`
  })
}

export function createKittyImageTransfer(base64Data: string, options: KittyImageOptions) {
  return createKittyImageChunks(base64Data, options).join('')
}

export function createKittyDeleteImageCommand(imageId: number) {
  return `${kittyEscapeStart}a=d,d=I,q=2,i=${imageId}${kittyEscapeEnd}`
}

export function createKittyPlaceholderLines(options: Omit<KittyImageOptions, 'chunkSize'>) {
  const color = createTrueColor(options.imageId)

  return Array.from({ length: options.rows }, (_, row) => {
    const cells = Array.from({ length: options.columns }, (_, column) =>
      createPlaceholderCell(row, column)
    )

    return `${color}${cells.join('')}\u001B[39m`
  })
}

export function supportsKittyImageRendering(env: NodeJS.ProcessEnv = process.env) {
  return (
    env.KITTY_WINDOW_ID !== undefined ||
    env.TERM === 'xterm-kitty' ||
    env.TERM === 'xterm-ghostty' ||
    env.TERM_PROGRAM?.toLowerCase() === 'ghostty'
  )
}

function splitBase64(value: string, chunkSize: number) {
  if (value.length === 0) {
    return []
  }

  const chunks: string[] = []

  for (let index = 0; index < value.length; index += chunkSize) {
    chunks.push(value.slice(index, index + chunkSize))
  }

  return chunks
}

function createPlaceholderCell(row: number, column: number) {
  return `${kittyPlaceholder}${getDiacritic(row)}${getDiacritic(column)}`
}

function getDiacritic(value: number) {
  if (value < 0 || value >= rowColumnDiacritics.length) {
    throw new RangeError(`Kitty image placeholder index ${value} is not supported`)
  }

  return rowColumnDiacritics[value]
}

function createTrueColor(imageId: number) {
  const red = (imageId >> 16) & 255
  const green = (imageId >> 8) & 255
  const blue = imageId & 255

  return `\u001B[38;2;${red};${green};${blue}m`
}
