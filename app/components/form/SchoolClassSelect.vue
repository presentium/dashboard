<script setup lang="ts">
import { format, parse } from 'date-fns'
import type { SchoolClassViewModel } from '~/types/api'

const props = defineProps<{
  self?: boolean
  today?: boolean
}>()

const { data: schoolClasses } = useApi('/school-classes', {
  query: {
    teacher: props.self ? '@me' : undefined,
    today: props.today ? true : undefined,
  },
})

const selected = defineModel<SchoolClassViewModel>()

function formatDow(dayOfWeek: string): string {
  return `${dayOfWeek[0]}${dayOfWeek.slice(1).toLowerCase()}`
}

function formatTime(time: string): string {
  return format(parse(time, 'HH:mm:ss', new Date()), 'HH:mm')
}
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="schoolClasses"
    searchable
    searchable-placeholder="Search a class..."
    :search-attributes="['name']"
    option-attribute="name"
    placeholder="Select a school class"
  >
    <template #leading>
      <UIcon name="solar:buildings-3-line-duotone" class="w-5 h-5" />
    </template>
    <template #option="{ option: schoolClass }">
      <div class="flex flex-col">
        <div>
          <span class="font-semibold">{{ schoolClass.name }}</span>
        </div>
        <div class="flex flex-row gap-2 text-gray-500 dark:text-gray-200">
          <span class="font-semibold">{{ schoolClass.room }}</span>
          <span class="text-gray-400 dark:text-gray-600">&dash;</span>
          <span>{{ formatDow(schoolClass.dayOfWeek) }} at {{ formatTime(schoolClass.start) }} to {{ formatTime(schoolClass.end) }}</span>
        </div>
      </div>
    </template>
  </USelectMenu>
</template>
