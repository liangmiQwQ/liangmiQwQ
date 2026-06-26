import { onMounted, readonly, shallowRef } from 'vue'

type ContributionRow = readonly number[]

const placeholderContributionRows = createPlaceholderContributionRows()

export function useContributionMap() {
  const contributionRows = shallowRef<readonly ContributionRow[]>(placeholderContributionRows)

  onMounted(async () => {
    contributionRows.value = await fetchContributionRows()
  })

  return {
    contributionRows: readonly(contributionRows)
  }
}

async function fetchContributionRows() {
  await Promise.resolve()
  return placeholderContributionRows
}

function createPlaceholderContributionRows() {
  return Array.from({ length: 7 }, (_, rowIndex) =>
    Array.from({ length: 53 }, (_, columnIndex) => getPlaceholderLevel(rowIndex, columnIndex))
  )
}

function getPlaceholderLevel(rowIndex: number, columnIndex: number) {
  const wave = (rowIndex + columnIndex) % 9
  if (wave === 0) {
    return 4
  }
  if (wave < 3) {
    return 3
  }
  if (wave < 6) {
    return 2
  }
  return 1
}
