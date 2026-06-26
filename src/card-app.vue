<script setup lang="ts">
import { Box, useApp, useInput, useWindowSize } from '@vue-tui/runtime'

import ProfileFooter from './tui/components/profile-footer.vue'
import ProfileHeader from './tui/components/profile-header.vue'
import ProjectsSection from './tui/components/projects-section.vue'
import { contacts, profile, projects } from './tui/profile.ts'

const app = useApp()

useInput((input, key) => {
  if (key.escape || input === 'q') {
    app.exit()
  }
})

const { columns, rows } = useWindowSize()
</script>

<template>
  <Box
    flex-direction="column"
    :padding="1"
    :height="rows"
    :width="columns"
    justify-content="space-between"
  >
    <ProfileHeader :profile="profile" />

    <Box flex-direction="column" :flex-grow="1" :margin-y="2" background-color="blue" height="fit">
      <ProjectsSection :projects="projects" />
    </Box>

    <ProfileFooter
      :contacts="contacts"
      message="Feel free to reach me out"
      exit-hint="Press q or Esc to exit."
    />
  </Box>
</template>
