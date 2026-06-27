<script setup lang="ts">
import { Box, Text, useWindowSize } from '@vue-tui/runtime'
import { computed } from 'vue'

import type { Project } from '../profile.ts'
import ContributionMap from './contribution-map.vue'

const { projects } = defineProps<{
  projects: readonly Project[]
}>()

const projectColumnGap = 4
const { columns } = useWindowSize()

const projectColumns = computed(() => {
  const midpoint = Math.ceil(projects.length / 2)
  return [projects.slice(0, midpoint), projects.slice(midpoint)]
})

const projectColumnWidth = computed(() =>
  Math.max(20, Math.floor((columns.value - projectColumnGap) / 2))
)
</script>

<template>
  <Box flex-direction="column" :gap="1">
    <Box flex-direction="column">
      <Text bold color="green">Projects</Text>
      <Text dim-color
        >Developer tools and infrastructure projects I create, maintain, or contribute to.</Text
      >
    </Box>

    <Box flex-direction="row" :gap="projectColumnGap">
      <Box
        v-for="(column, index) in projectColumns"
        :key="index"
        flex-direction="column"
        :width="projectColumnWidth"
      >
        <Box
          v-for="project in column"
          :key="project.name"
          flex-direction="column"
          :margin-bottom="1"
        >
          <Text bold>{{ project.name }}</Text>
          <Text dim-color>{{ project.description }}</Text>
        </Box>
      </Box>
    </Box>
  </Box>

  <Box :margin-top="1">
    <ContributionMap />
  </Box>
</template>
