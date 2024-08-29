<script setup lang="ts">
import type { TeacherRef } from '~/types/api'

const { data: studentRefs } = useApi('/students', { query: { refs: '' } })

const selected = defineModel<TeacherRef>()
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="studentRefs"
    searchable
    searchable-placeholder="Search a student..."
    :search-attributes="['name']"
    option-attribute="name"
    placeholder="Select a student"
  >
    <template #leading>
      <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
    </template>
  </USelectMenu>
</template>
