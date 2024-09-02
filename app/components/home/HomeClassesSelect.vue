<script setup lang="ts">
import type { SchoolClassViewModel } from '~/types/api'

const { data: schoolClasses } = useApi('/school-classes')
const defaultOption = { id: undefined, name: 'All classes' }
const classOptions = computed(() => [defaultOption, ...(schoolClasses?.value ?? [])])

const classId = defineModel<number>()
const selectedClass = ref<SchoolClassViewModel>(defaultOption)
watchEffect(() => {
  classId.value = selectedClass.value?.id
})
</script>

<template>
  <USelectMenu
    v-slot="{ open }"
    v-model="selectedClass"
    :options="classOptions"
    :ui-menu="{ width: 'w-32' }"
    :popper="{ placement: 'bottom-start' }"
    option-attribute="name"
    searchable
    searchable-placeholder="Search a class..."
    :search-attributes="['name']"
  >
    <UButton
      :label="selectedClass?.name || 'Select class'"
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </USelectMenu>
</template>
