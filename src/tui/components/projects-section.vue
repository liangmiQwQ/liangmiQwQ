<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'

import type { Project } from '../profile.ts'
import ContributionMap from './contribution-map.vue'

defineProps<{
  projects: readonly Project[]
}>()
</script>

<template>
  <Box flex-direction="column">
    <Text bold color="green">Projects</Text>

    <Box v-for="project in projects" :key="project.name" flex-direction="column" :margin-top="1">
      <Text bold>{{ project.name }}</Text>
      <Text v-if="project.description" dim-color>{{ project.description }}</Text>
      <Text v-else dim-color>description placeholder</Text>
    </Box>

    <Box :margin-top="1">
      <ContributionMap />
    </Box>
  </Box>
</template>
