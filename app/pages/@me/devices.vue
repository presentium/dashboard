<script setup lang="ts">
import { useApi } from '#imports'

const columns = [{
  key: 'commonName',
  label: 'Name',
}, {
  key: 'status',
  label: 'Status',
}, {
  key: 'mode',
  label: 'Mode',
}]

const { data: devices, status } = useApi('/devices', {
  query: { assigned: '@me' },
})
const pending = computed(() => status.value === 'pending')

const q = ref('')
const input = ref<{ input: HTMLInputElement }>()

const filteredDevices = computed(() => {
  if (!q.value)
    return devices.value
  return devices.value
    .filter(device => device.commonName.toLowerCase().includes(q.value.toLowerCase()))
})

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
        title="My devices"
        :badge="devices?.length ?? '0'"
      >
        <template #right>
          <UInput
            ref="input"
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filter users..."
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
        <template #commonName-data="{ row }">
          <ULink :to="`/devices/${row.id}`" inactive-class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300">
            {{ row.commonName }}
          </ULink>
        </template>

        <template #status-data="{ row }">
          <UBadge
            :label="row.connected ? 'connected' : 'disconnected'"
            :color="row.connected ? 'green' : 'red'"
            variant="subtle"
          />
        </template>

        <template #mode-data="{ row }">
          <DeviceMode :mode="row.mode" />
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
