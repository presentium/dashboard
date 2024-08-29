<script setup lang="ts">
const defaultColumns = [{
  key: 'id',
  label: '#',
}, {
  key: 'firstName',
  label: 'Name',
  sortable: true,
}, {
  key: 'lastName',
  label: 'Last name',
  sortable: true,
}, {
  key: 'email',
  label: 'Email',
  sortable: true,
}]

const input = ref<{ input: HTMLInputElement }>()

const { data: students, pending } = await useApi<StudentViewModel[]>('/students')
const q = ref('')
const selected = ref<StudentViewModel[]>([])
const selectedColumns = ref(defaultColumns)
const sort = ref({ column: 'id', direction: 'asc' as const })
const isNewUserModalOpen = ref(false)

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

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
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        title="Students"
        :badge="students.length"
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
      <UDashboardToolbar>
        <template #right>
          <USelectMenu
            v-model="selectedColumns"
            icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns"
            multiple
            class="hidden lg:block"
          >
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>
      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="students"
        :columns="columns"
        :loading="pending"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        @select="onSelect"
      />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>

</style>
