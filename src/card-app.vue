<script setup lang="ts">
import { Box, useApp, useInput } from '@vue-tui/runtime'

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
</script>

<template>
  <Box flex-direction="column" width="100%" height="100%">
    <ProfileHeader :profile="profile" />

    <Box flex-direction="column" :padding-y="1">
      <ProjectsSection :projects="projects" />
    </Box>

    <ProfileFooter
      :contacts="contacts"
      message="Feel free to reach me out"
      exit-hint="Press q or Esc to exit."
    />
  </Box>
</template>
