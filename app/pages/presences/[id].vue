<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { format, parse } from 'date-fns'
import { useApi, useRoute } from '#imports'

const defaultColumns = [{
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
const selected = ref<PresenceViewModel[]>([])
const selectedColumns = ref(defaultColumns)
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const sort = ref({ column: 'id', direction: 'asc' as const })
const q = ref('')

const { data: sessionDates } = useApi('/sessions/dates/{schoolClassId}', {
  path: { schoolClassId: Number.parseInt(route.params.id as string) },
})

const selectedDate = ref('')

const { data: presences, status: presenceStatus } = useApi('/presences', {
  params: computed(() => ({
    schoolClassId: Number.parseInt(route.params.id as string),
    start: selectedDate.value,
    end: selectedDate.value,
  })),
})

const pending = computed(() => presenceStatus.value === 'pending')

const { data: schoolClass, refresh: classRefresh } = useApi('/school-classes/{schoolClassId}', {
  path: { schoolClassId: Number.parseInt(route.params.id as string) },
})

function onSelect(row: PresenceViewModel) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  }
  else {
    selected.value.splice(index, 1)
  }
}

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

function exportCSV() {
  const headers = selectedColumns.value.map(column => column.label) // Get column labels for CSV header
  const rows = filteredRows.value.map((row) => {
    return selectedColumns.value.map((column) => {
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

  const csvContent = [headers, ...rows]
    .map(e => e.join(','))
    .join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `presences-${selectedDate.value}-${className.value}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(selectedDate, () => {
  classRefresh()
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :title="`Presences of ${schoolClass?.name}`"
        :badge="presences?.length ?? 'waiting'"
      />
      <UDashboardPanelContent class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800">
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
          </template>
          <template #right>
            <!-- Replace HomeDateRangePicker with USelectMenu -->
            <USelectMenu
              v-model="selectedDate"
              :options="sessionDates"
              placeholder="Select a date"
              class="-ml-2.5"
            />
            <UButton
              class="ml-auto"
              color="primary"
              label="Export"
              trailing-icon="i-heroicons-arrow-up-circle"
              @click="exportCSV"
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
          @select="onSelect"
        >
          <template #date-data="{ row }">
            {{ formatTime(row.date as string, "yyyy-MM-dd'T'HH:mm:ss", 'yyyy-MM-dd') }}
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
