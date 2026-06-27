<script setup lang="ts">
import { Box, Text } from '@vue-tui/runtime'
import { computed, onMounted, onUnmounted, shallowRef } from 'vue'

import type { Profile } from '../profile.ts'
import KittyImage from './kitty-image.vue'

defineProps<{
  profile: Profile
}>()

const utcPlusEightOffsetMinutes = 8 * 60
const now = shallowRef(new Date())
const utcPlusEightFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Shanghai'
})

let clockTimer: ReturnType<typeof setTimeout> | undefined

const utcPlusEightTime = computed(() => `${utcPlusEightFormatter.format(now.value)}`)

const localTimeComparison = computed(() => {
  const localOffsetMinutes = -now.value.getTimezoneOffset()
  const differenceMinutes = utcPlusEightOffsetMinutes - localOffsetMinutes

  if (differenceMinutes === 0) {
    return '(UTC+8)'
  }

  const direction = differenceMinutes > 0 ? '+' : '-'
  return `(UTC+8 ${direction}${formatMinuteDifference(differenceMinutes)})`
})

onMounted(scheduleClockUpdate)

onUnmounted(() => {
  if (clockTimer) {
    clearTimeout(clockTimer)
  }
})

function scheduleClockUpdate() {
  now.value = new Date()
  const delayToNextMinute = 60_000 - (now.value.getSeconds() * 1000 + now.value.getMilliseconds())

  clockTimer = setTimeout(scheduleClockUpdate, delayToNextMinute)
}

function formatMinuteDifference(minutes: number) {
  const absoluteMinutes = Math.abs(minutes)
  const hours = Math.floor(absoluteMinutes / 60)
  const remainingMinutes = absoluteMinutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}m`
}
</script>

<template>
  <Box flex-direction="row" :gap="1">
    <KittyImage
      :margin-top="-1"
      :png-base64="profile.avatarPngBase64"
      :image-id="0x51_41_51"
      :columns="13"
      :rows="8"
    >
    </KittyImage>

    <Box :flex-grow="1" flex-direction="column">
      <Box flex-direction="row">
        <Text bold>{{ profile.name }}</Text>
        <Text dim-color> @{{ profile.handle }}</Text>
      </Box>

      <Text wrap="wrap">{{ profile.description }}</Text>
      <Text dim-color wrap="wrap">{{ profile.bio }}</Text>

      <Box flex-direction="row" :margin-y="1" :gap="3">
        <Box flex-direction="column">
          <Text color="yellow">Location</Text>
          <Text>{{ profile.location }}</Text>
        </Box>
        <Box flex-direction="column">
          <Text color="yellow">Time</Text>
          <Box flex-direction="row" :gap="1">
            <Text>{{ utcPlusEightTime }}</Text>
            <Text dim-color>{{ localTimeComparison }}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
    <Box flex-direction="row" :padding-right="6" :gap="2">
      <Box flex-direction="column">
        <Box v-for="birdLine in profile.bird" :key="birdLine" flex-direction="column">
          <Text>{{ birdLine }}</Text>
        </Box>
      </Box>
    </Box>
  </Box>
</template>
