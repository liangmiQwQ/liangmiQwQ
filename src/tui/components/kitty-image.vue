<script setup lang="ts">
import { Box, Text, useStdout } from '@vue-tui/runtime'
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'

import {
  createKittyDeleteImageCommand,
  createKittyImageTransfer,
  createKittyPlaceholderLines,
  supportsKittyImageRendering
} from '../kitty-image.ts'

const { pngBase64, imageId, columns, rows } = defineProps<{
  pngBase64: string
  imageId: number
  columns: number
  rows: number
}>()

const { write } = useStdout()
const isReady = shallowRef(false)
const hasTransmitted = shallowRef(false)

const placeholderLines = computed(() =>
  createKittyPlaceholderLines({
    imageId,
    columns,
    rows
  })
)

onMounted(() => {
  if (!supportsKittyImageRendering() || process.env.NODE_ENV === 'test') {
    return
  }

  try {
    write(createKittyImageTransfer(pngBase64, { imageId, columns, rows }))

    hasTransmitted.value = true
    isReady.value = true
  } catch {
    isReady.value = false
  }
})

onUnmounted(() => {
  if (hasTransmitted.value) {
    write(createKittyDeleteImageCommand(imageId))
  }
})
</script>

<template>
  <Box flex-direction="column" :width="columns" :height="rows">
    <Text v-for="line in isReady ? placeholderLines : []" :key="line" aria-hidden>{{ line }}</Text>
    <slot v-if="!isReady" />
  </Box>
</template>
