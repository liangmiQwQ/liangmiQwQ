<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'

import type { Profile } from '../profile.ts'

defineProps<{
  profile: Profile
}>()
</script>

<template>
  <Box flex-direction="row" :gap="1">
    <Box flex-direction="column">
      <Box flex-direction="column" :padding-top="1">
        <Text v-for="line in profile.avatar" :key="line" color="cyan">{{ line }}</Text>
      </Box>
    </Box>

    <Box flex-direction="row" :gap="1" :flex-grow="1">
      <Box flex-direction="column">
        <Text v-for="line in profile.nameArt" :key="line" bold color="green">{{ line }}</Text>
      </Box>

      <Box flex-direction="column" width="26">
        <Box flex-direction="row">
          <Text bold>{{ profile.name }}</Text>
          <Text dim-color> @{{ profile.handle }}</Text>
        </Box>

        <Text wrap="wrap">{{ profile.description }}</Text>
        <Text dim-color wrap="wrap">{{ profile.bio }}</Text>

        <Box :margin-top="1">
          <Text color="yellow">Title</Text>
        </Box>
        <Text>{{ profile.titles.join(', ') }}</Text>
        <Text color="yellow">Location</Text>
        <Text>{{ profile.location }}</Text>
      </Box>
    </Box>
  </Box>
</template>
