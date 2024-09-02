<script setup lang="ts">
import type { StudentRef } from '~/types/api'

const { data: studentRefs } = useApi('/students', { query: { refs: '' } })
const defaultOption = { id: undefined, name: 'All students' }
const studentOptions = computed(() => [defaultOption, ...(studentRefs?.value ?? [])])

const studentId = defineModel<string>()
const selectedStudent = ref<StudentRef>(defaultOption)
watchEffect(() => {
  studentId.value = selectedStudent.value?.id
})
</script>

<template>
  <USelectMenu
    v-slot="{ open }"
    v-model="selectedStudent"
    :options="studentOptions"
    :ui-menu="{ width: 'w-40' }"
    :popper="{ placement: 'bottom-start' }"
    option-attribute="name"
    searchable
    searchable-placeholder="Search a student..."
    :search-attributes="['name']"
  >
    <UButton
      :label="selectedStudent?.name || 'Select student'"
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </USelectMenu>
</template>
