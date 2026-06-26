import { onMounted, readonly, shallowRef } from 'vue'

const placeholderContributionRows = [
  '..##...###....##....####...###.',
  '.####..####...###...#####..####',
  '.###....##.....##....###....###',
  '...##...###....####....##...##.',
  '..###..#####...###....####..###',
  '...##....###....##.....###...##'
] as const

export function useContributionMap() {
  const contributionRows = shallowRef<readonly string[]>(placeholderContributionRows)
  const contributionStatus = shallowRef('placeholder')

  onMounted(async () => {
    contributionRows.value = await fetchContributionRows()
    contributionStatus.value = 'loaded'
  })

  return {
    contributionRows: readonly(contributionRows),
    contributionStatus: readonly(contributionStatus)
  }
}

async function fetchContributionRows() {
  await Promise.resolve()
  return placeholderContributionRows
}
