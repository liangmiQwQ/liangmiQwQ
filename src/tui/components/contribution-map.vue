<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'
import { computed } from 'vue'

import { useContributionMap } from '../use-contribution-map.ts'

const { contributionRows } = useContributionMap()

const contributionCellText = '  '

const contributionCells = computed(() =>
  contributionRows.value.map(row =>
    Array.from(row, (level, column) => ({
      key: `${column}-${level}`,
      backgroundColor: contributionColors[level] ?? contributionColors[0]
    }))
  )
)

const contributionColors = ['blackBright', 'green', 'greenBright', 'green', 'greenBright'] as const
</script>

<template>
  <Box flex-direction="column">
    <Text bold color="green">GitHub Contributions</Text>
    <Text dim-color>53 x 7 placeholder</Text>

    <Box flex-direction="column" :margin-top="1" :gap="0">
      <Box
        v-for="(row, rowIndex) in contributionCells"
        :key="rowIndex"
        flex-direction="row"
        :gap="0"
      >
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
  </Box>
</template>
