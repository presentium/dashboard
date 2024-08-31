<script setup lang="ts">
import type { TeacherRef } from '~/types/api'

const { data: teacherRefs } = useApi('/teachers', { query: { refs: '' } })

const selected = defineModel<TeacherRef>()
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="teacherRefs"
    searchable
    searchable-placeholder="Search a teacher..."
    :search-attributes="['name']"
    option-attribute="name"
    placeholder="Select a teacher"
  >
    <template #leading>
      <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
    </template>
  </USelectMenu>
</template>
