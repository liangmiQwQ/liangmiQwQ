<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'

import { useContributionMap } from '../use-contribution-map.ts'

const { contributionRows, contributionStatus } = useContributionMap()
</script>

<template>
  <Box flex-direction="column" :min-width="34">
    <Text bold color="green">GitHub Contributions</Text>
    <Text dim-color>green wall placeholder</Text>

    <Box flex-direction="column" :margin-top="1">
      <Text v-for="row in contributionRows" :key="row" color="green">{{ row }}</Text>
    </Box>

    <Text dim-color>{{ contributionStatus }}</Text>
  </Box>
</template>
