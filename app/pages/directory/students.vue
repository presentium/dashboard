<script setup lang="ts">
import type { StudentViewModel } from '~/types/api'

const { $api } = useNuxtApp()

const defaultColumns = [{
  key: 'name',
  label: 'Name',
  sortable: true,
}, {
  key: 'actions',
  label: 'Actions',
  sortable: false,
}]

function items(row) {
  return [
    [{
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit', row.id),
    }],
    [{
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: async () => await $api('/students/{id}', { method: 'delete', path: { id: row.id }, body: [] }),
    }],
  ]
}

const input = ref<{ input: HTMLInputElement }>()

const { data: students, pending } = useApi('/students')
const selected = ref<StudentViewModel[]>([])
const sort = ref({ column: 'id', direction: 'asc' as const })
const isNewUserModalOpen = ref(false)

function onSelect(row: StudentViewModel) {
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  }
  else {
    selected.value.splice(index, 1)
  }
}

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  },
})

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

          <UButton
            label="New student"
            trailing-icon="i-heroicons-plus"
            color="gray"
            @click="isNewUserModalOpen = true"
          />
        </template>
      </UDashboardNavbar>
      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="filteredRows"
        :loading="pending"
        :columns="defaultColumns"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        @select="onSelect"
      >
        <template #name-data="{ row }">
          <span :class="[selected.find(person => person.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton color="gray" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
