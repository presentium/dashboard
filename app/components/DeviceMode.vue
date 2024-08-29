<script lang="ts" setup>
import type { DeviceMode } from '~/types/api'

const props = defineProps<{
  mode: DeviceMode | null
}>()

const color = computed(() => {
  switch (props.mode) {
    case 'IDLE':
      return 'gray'
    case 'PRESENCE_CHECK':
      return 'blue'
    case 'STUDENT_ENROLL':
      return 'indigo'
    default:
      return 'gray'
  }
})

const text = computed(() => {
  switch (props.mode) {
    case 'IDLE':
      return 'idle'
    case 'PRESENCE_CHECK':
      return 'presence check'
    case 'STUDENT_ENROLL':
      return 'student enrollment'
    default:
      return 'unknown'
  }
})
</script>

<template>
  <UBadge :color="color" :label="text" variant="subtle" />
</template>
