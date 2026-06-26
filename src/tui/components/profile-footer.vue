<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'

import type { Contact } from '../profile.ts'

defineProps<{
  contacts: readonly Contact[]
  message: string
  exitHint: string
}>()

function createTerminalLink(text: string, href?: string) {
  if (!href) {
    return text
  }

  return `\u001B]8;;${href}\u0007${text}\u001B]8;;\u0007`
}
</script>

<template>
  <Box flex-direction="column" background-color="red">
    <Box flex-direction="row" :gap="2">
      <Box v-for="contact in contacts" :key="contact.label" flex-direction="row">
        <Text>{{ contact.label }}: </Text>
        <Text v-if="contact.href" underline>{{
          createTerminalLink(contact.value, contact.href)
        }}</Text>
        <Text v-else>{{ contact.value }}</Text>
      </Box>
    </Box>

    <Text color="green">{{ message }}</Text>
    <Text dim-color>{{ exitHint }}</Text>
  </Box>
</template>
