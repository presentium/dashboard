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

const toast = useToast()
const { $api } = useNuxtApp()

const { data: classes, status, refresh: classesRefresh } = useApi('/school-classes')
const pending = computed(() => status.value === 'pending')

const q = ref('')
const input = ref<{ input: HTMLInputElement }>()

const isImportModalOpen = ref(false)
const selectedFile = ref<string>()
const fileInput = ref<{ input: HTMLInputElement }>()

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

async function importClasses() {
  const file = fileInput.value.input.files?.[0]
  if (!selectedFile.value || !file) {
    return
  }

  const formData = new FormData()
  formData.set('calendar', file)

  await $api('/courses/actions/import', {
    method: 'POST',
    body: formData as any,
    onResponseError: ({ response }) => {
      toast.add({
        title: 'Could not import the classes',
        description: response._data.message,
        icon: 'i-heroicons-x-circle',
        color: 'red',
      })
    },
  }).then(() => {
    classesRefresh()
    toast.add({ title: 'Classes imported', icon: 'i-heroicons-check-circle' })
  })

  isImportModalOpen.value = false
}

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
          <UButton
            color="black"
            icon="i-heroicons-plus"
            label="Import classes"
            @click="isImportModalOpen = true"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardModal
        v-model="isImportModalOpen"
        title="Import a schedule"
        description="Import courses and classes from a calendar file"
        :ui="{ width: 'sm:max-w-md' }"
      >
        <UFormGroup label="Calendar file" description="Import the iCal export from Gaps to quickly insert all courses and classes, you'll need to link the students to the imported class in their respective pages.">
          <UInput ref="fileInput" v-model="selectedFile" type="file" icon="i-heroicons-folder" accept=".ics" />
        </UFormGroup>

        <template #footer>
          <UButton
            class="ml-auto"
            color="primary"
            icon="i-heroicons-document-arrow-down"
            label="Import classes"
            type="submit"
            :disabled="!selectedFile"
            @click="importClasses"
          />
        </template>
      </UDashboardModal>

      <UTable
        :rows="filteredDevices"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <ULink :to="`/school-classes/${row.id}`" inactive-class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
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
