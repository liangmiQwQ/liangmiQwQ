<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'

import type { Profile } from '../profile.ts'

defineProps<{
  profile: Profile
}>()
</script>

<template>
  <Box border-style="round" flex-direction="column" :padding-x="2" :padding-y="1">
    <Box flex-direction="row" :gap="3">
      <Box flex-direction="column" :padding-top="1">
        <Text v-for="line in profile.avatar" :key="line" color="cyan">{{ line }}</Text>
      </Box>

      <Box flex-direction="column" :flex-grow="1">
        <Text v-for="line in profile.nameArt" :key="line" bold color="green">{{ line }}</Text>
      </Box>
    </Box>

    <Box flex-direction="row" :margin-top="1">
      <Text bold>{{ profile.name }}</Text>
      <Text dim-color> @{{ profile.handle }}</Text>
    </Box>

    <Text>{{ profile.description }}</Text>
    <Text dim-color>{{ profile.bio }}</Text>

    <Box flex-direction="row" :gap="2" :margin-top="1">
      <Text color="yellow">Title</Text>
      <Text>{{ profile.titles.join(', ') }}</Text>
    </Box>

    <Box flex-direction="row" :gap="2">
      <Text color="yellow">Location</Text>
      <Text>{{ profile.location }}</Text>
    </Box>
  </Box>
</template>
