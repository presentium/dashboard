<script setup lang="ts">
const { $api } = useNuxtApp()

const defaultColumns = [{
  key: 'name',
  label: 'Name',
}, {
  key: 'actions',
  label: 'Actions',
}]

const toast = useToast()

const input = ref<{ input: HTMLInputElement }>()

const { data: students, status, refresh: studentRefresh } = useApi('/students')
const pending = computed(() => status.value === 'pending')

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  },
})

async function deleteStudent(id: string) {
  await $api('/students/{id}', { method: 'delete', path: { id }, body: [] })
  toast.add({ title: 'Student deleted', icon: 'i-heroicons-check-circle' })
  studentRefresh()
}

const q = ref('')
const filteredRows = computed(() => {
  if (!q.value) {
    return students.value
  }
  return students.value.filter((student) => {
    return Object.values(student).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Students"
        :badge="students?.length ?? 'loading'"
      >
        <template #right>
          <UInput
            ref="input"
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
      </UDashboardNavbar>
      <UTable
        :rows="filteredRows"
        :loading="pending"
        :columns="defaultColumns"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <span class="text-gray-600 dark:text-gray-400">{{ row.name }}</span>
        </template>

        <template #actions-data="{ row }">
          <UButton
            color="red"
            variant="outline"
            icon="i-heroicons-user-minus"
            label="Delete"
            @click="deleteStudent(row.id)"
          />
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
