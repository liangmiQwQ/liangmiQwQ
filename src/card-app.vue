<script setup lang="ts">
import { Box, Text, useApp, useInput } from '@vue-tui/runtime'

const app = useApp()

useInput((input, key) => {
  if (key.escape || input === 'q') {
    app.exit()
  }
})
</script>

<template>
  <Box border-style="round" flex-direction="column" :padding-x="2" :padding-y="1" :width="36">
    <Box :height="3" />
    <Box
      :border-bottom="false"
      :border-left="false"
      :border-right="false"
      border-style="single"
      flex-direction="row"
      :padding-top="1"
    >
      <Text bold> Liang </Text>
      <Text dim-color> (liangmiQwQ) </Text>
    </Box>
  </Box>
</template>
