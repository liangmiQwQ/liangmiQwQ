<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'

import type { Contact } from '../profile.ts'

defineProps<{
  contacts: readonly Contact[]
  message: string
}>()
</script>

<template>
  <Box border-style="single" border-dim-color flex-direction="column" :padding-x="2" :padding-y="1">
    <Box flex-direction="row" :gap="2">
      <Box v-for="contact in contacts" :key="contact.label" flex-direction="row">
        <Text>{{ contact.label }}: {{ contact.value }}</Text>
      </Box>
    </Box>

    <Text color="green">{{ message }}</Text>
  </Box>
</template>
