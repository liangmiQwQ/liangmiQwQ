<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'
import { computed } from 'vue'

import { useContributionMap } from '../use-contribution-map.ts'

const { contributionCalendar, errorMessage, isLoading } = useContributionMap()

const contributionCellText = '  '
const skeletonWeekCount = 53

const weekdayLabels = ['    ', 'Mon ', '    ', 'Wed ', '    ', 'Fri ', '    '] as const
const contributionColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'] as const
const skeletonColor = '#30363d'

const skeletonRows = Array.from({ length: 7 }, (_, rowIndex) =>
  Array.from({ length: skeletonWeekCount }, (_, columnIndex) => ({
    date: `skeleton-${rowIndex}-${columnIndex}`,
    level: 0 as const
  }))
)

const visibleRows = computed(() =>
  isLoading.value ? skeletonRows : contributionCalendar.value.rows
)

const statusText = computed(() => {
  if (isLoading.value) {
    return 'Fetching contributions...'
  }

  if (errorMessage.value) {
    return errorMessage.value
  }

  return contributionCalendar.value.totalText || 'Contributions in the last year'
})

const monthLabelLine = computed(() => {
  if (isLoading.value) {
    return '    Loading calendar'
  }

  return contributionCalendar.value.monthLabelLine
})

const contributionCells = computed(() =>
  visibleRows.value.map(row =>
    row.map(day => ({
      key: day.date,
      backgroundColor: isLoading.value ? skeletonColor : contributionColors[day.level]
    }))
  )
)
</script>

<template>
  <Box flex-direction="column">
    <Text bold color="green">GitHub Contributions</Text>
    <Text dim-color>{{ statusText }}</Text>

    <Box flex-direction="column" :margin-top="1" :gap="0">
      <Text dim-color>{{ monthLabelLine }}</Text>

      <Box
        v-for="(row, rowIndex) in contributionCells"
        :key="rowIndex"
        flex-direction="row"
        :gap="0"
      >
        <Text dim-color>{{ weekdayLabels[rowIndex] }}</Text>
        <Text
          v-for="cell in row"
          :key="cell.key"
          :background-color="cell.backgroundColor"
          aria-label="contribution cell"
        >
          {{ contributionCellText }}
        </Text>
      </Box>
    </Box>

    <Box flex-direction="row" :margin-top="1">
      <Text dim-color>Less </Text>
      <Text
        v-for="color in contributionColors"
        :key="color"
        :background-color="color"
        aria-label="contribution legend level"
      >
        {{ contributionCellText }}
      </Text>
      <Text dim-color> More</Text>
    </Box>
  </Box>
</template>
