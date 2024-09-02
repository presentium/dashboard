<script setup lang="ts">
import { format, parse } from 'date-fns'
import { useApi } from '#imports'

const columns = [{
  key: 'name',
  label: 'Name',
}, {
  key: 'time',
  label: 'Time',
}, {
  key: 'room',
  label: 'Room',
}, {
  key: 'teacher',
  label: 'Teacher',
}]

const { data: classes, status } = useApi('/school-classes')
const pending = computed(() => status.value === 'pending')

const q = ref('')
const input = ref<{ input: HTMLInputElement }>()

const filteredDevices = computed(() => {
  if (!q.value)
    return classes.value
  return classes.value
    .filter(cls => cls.name.toLowerCase().includes(q.value.toLowerCase()))
})

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  },
})

function formatDow(dayOfWeek: string): string {
  return `${dayOfWeek[0]}${dayOfWeek.slice(1).toLowerCase()}`
}

function formatTime(time: string): string {
  return format(parse(time, 'HH:mm:ss', new Date()), 'HH:mm')
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Classes"
        :badge="classes?.length ?? '0'"
      >
        <template #right>
          <UInput
            ref="input"
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filter classes..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
        </template>
      </UDashboardNavbar>

      <UTable
        :rows="filteredDevices"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <ULink :to="`/presences/${row.id}`" inactive-class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
            {{ row.name }}
          </ULink>
        </template>

        <template #teacher-data="{ row }">
          <span>{{ row.teacher.name }}</span>
        </template>

        <template #time-data="{ row }">
          <span>{{ formatDow(row.dayOfWeek) }} at {{ formatTime(row.start) }} to {{ formatTime(row.end) }}</span>
        </template>

        <template #room-data="{ row }">
          <UBadge :label="row.room" variant="subtle" />
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
