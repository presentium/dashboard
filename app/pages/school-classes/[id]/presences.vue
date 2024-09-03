<script setup lang="ts">
import { computed, ref } from 'vue'
import { format, parse } from 'date-fns'
import { useApi, useRoute } from '#imports'
import type { PresenceViewModel } from '~/types/api'

const columns = [{
  key: 'student.name',
  label: 'Name',
}, {
  key: 'date',
  label: 'Date',
}, {
  key: 'present',
  label: 'Status',
}]

const route = useRoute()
const toast = useToast()
const { $api } = useNuxtApp()

const sort = ref({ column: 'id', direction: 'asc' as const })
const q = ref('')

const schoolClassId = Number.parseInt(route.params.id as string)

const { data: sessionDates } = useApi('/school-classes/{schoolClassId}/sessions/dates', {
  path: { schoolClassId },
})

const selectedDate = ref()

const { data: presences, status: presenceStatus } = useAsyncData<PresenceViewModel[]>('presences', async () => {
  if (!selectedDate.value) {
    return []
  }

  return await $api('/presences', {
    query: {
      schoolClassId,
      start: selectedDate.value,
      end: selectedDate.value,
    },
  })
}, {
  watch: [selectedDate],
  default: () => [],
})

const pending = computed(() => presenceStatus.value === 'pending')

const { data: schoolClass } = useApi('/school-classes/{schoolClassId}', {
  path: { schoolClassId: Number.parseInt(route.params.id as string) },
})

const filteredRows = computed(() => {
  if (!q.value)
    return presences.value
  return presences.value
    .filter(cls => cls.student.name.toLowerCase().includes(q.value.toLowerCase()))
})

function formatDow(dayOfWeek: string): string {
  return `${dayOfWeek[0]}${dayOfWeek.slice(1).toLowerCase()}`
}

function formatTime(dateTime: string, parseFormat: string, formatted: string): string {
  const parsedDate = parse(dateTime, parseFormat, new Date())
  return format(parsedDate, formatted)
}

function exportCSV(className: string) {
  const headers = columns.map(column => column.label)
  const rows = filteredRows.value.map((row) => {
    return columns.map((column) => {
      // Get the nested value using the column key
      const keys = column.key.split('.')
      let value = row
      keys.forEach((key) => {
        value = value[key]
      })
      if (column.key === 'date') {
        return formatTime(value, 'yyyy-MM-dd\'T\'HH:mm:ss', 'yyyy-MM-dd')
      }
      if (column.key === 'present') {
        return value ? 'Present' : 'Absent'
      }
      return value
    })
  })

  const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${selectedDate.value}_${className}_presences.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.add({ title: 'Presences exported', icon: 'i-heroicons-check-circle' })
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="`Attendance data for class ${schoolClass?.name}`" />
      <UDashboardPanelContent class="p-0 divide-y divide-gray-200 dark:divide-gray-800">
        <div class="grid grid-cols-3 gap-4 px-4 py-6">
          <div class="text-gray-400 dark:text-gray-500">
            Name
          </div>
          <div class="col-span-2">
            {{ schoolClass?.name }}
          </div>

          <div class="text-gray-400 dark:text-gray-500">
            Room
          </div>
          <div class="col-span-2">
            <UBadge :label="schoolClass?.room" variant="subtle" />
          </div>

          <div class="text-gray-400 dark:text-gray-500">
            Time
          </div>
          <div class="col-span-2">
            <span v-if="schoolClass">
              {{ formatDow(schoolClass?.dayOfWeek) }} at {{ formatTime(schoolClass?.start as string, 'HH:mm:ss', 'HH:mm') }} to {{ formatTime(schoolClass?.end as string, 'HH:mm:ss', 'HH:mm') }}
            </span>
          </div>
          <div class="text-gray-400 dark:text-gray-500">
            Teacher
          </div>
          <div class="col-span-2">
            {{ schoolClass?.teacher?.name }}
          </div>
        </div>
        <UDashboardToolbar>
          <template #left>
            <USelectMenu
              v-model="selectedDate"
              :options="sessionDates"
              color="primary"
              class="min-w-48"
            >
              <template #label>
                <span v-if="selectedDate">{{ formatTime(selectedDate, 'yyyy-MM-dd\'T\'HH:mm:ss', 'dd MMM yyyy \'at\' HH:mm') }}</span>
                <span v-else class="text-gray-400 dark:text-gray-600">Select a date</span>
              </template>

              <template #option="{ option }">
                {{ formatTime(option, 'yyyy-MM-dd\'T\'HH:mm:ss', 'dd MMM yyyy \'at\' HH:mm') }}
              </template>
            </USelectMenu>
          </template>
          <template #right>
            <UInput
              v-model="q"
              icon="i-heroicons-funnel"
              autocomplete="off"
              placeholder="Filter students..."
              class="hidden lg:block"
              @keydown.esc="$event.target.blur()"
            >
              <template #trailing>
                <UKbd value="/" />
              </template>
            </UInput>
            <UButton
              class="ml-auto"
              color="primary"
              label="Export"
              trailing-icon="i-heroicons-document-chart-bar"
              :disabled="!selectedDate"
              @click="exportCSV(schoolClass?.name as string)"
            />
          </template>
        </UDashboardToolbar>
        <UTable
          v-model:sort="sort"
          :rows="filteredRows"
          :columns="columns"
          :loading="pending"
          sort-mode="manual"
          class="w-full"
          :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        >
          <template #date-data="{ row }">
            {{ formatTime(row.date as string, "yyyy-MM-dd'T'HH:mm:ss", 'dd MMM yyyy') }}
          </template>
          <template #present-data="{ row }">
            <UBadge :label="row.present ? 'Present' : 'Absent'" :color="row.present ? 'green' : 'red'" variant="subtle" />
          </template>
        </UTable>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
/* Add your custom styles here if needed */
</style>
