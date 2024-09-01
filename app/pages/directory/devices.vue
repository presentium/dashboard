<script setup lang="ts">
import { useApi } from '#imports'
import type { DeviceViewModel, TeacherRef } from '~/types/api'

const columns = [{
  key: 'commonName',
  label: 'Name',
}, {
  key: 'teacher',
  label: 'Loaner',
}, {
  key: 'status',
  label: 'Status',
}, {
  key: 'mode',
  label: 'Mode',
}, {
  key: 'actions',
  label: 'Actions',
}]

const toast = useToast()
const { $api } = useNuxtApp()

const { data: devices, status, refresh: deviceRefresh } = useApi('/devices')
const pending = computed(() => status.value === 'pending')

const q = ref('')
const input = ref<{ input: HTMLInputElement }>()

const isAssignModalOpen = ref(false)
const selectedDevice = ref<DeviceViewModel>()
const selectedTeacher = ref<TeacherRef>()

const filteredDevices = computed(() => {
  if (!q.value)
    return devices.value
  return devices.value
    .filter(device => device.commonName.toLowerCase().includes(q.value.toLowerCase()))
})

function openAssignModal(device: DeviceViewModel) {
  selectedDevice.value = device
  isAssignModalOpen.value = true
}

async function assignDevice() {
  if (!selectedTeacher.value) {
    return
  }

  await $api('/devices/{deviceId}/actions/assign', {
    method: 'POST',
    path: { deviceId: selectedDevice.value.id },
    body: { teacher: selectedTeacher.value.id },
  })

  deviceRefresh()
  toast.add({ title: 'Device assigned', icon: 'i-heroicons-check-circle' })
  isAssignModalOpen.value = false
}

async function unassignDevice(device: DeviceViewModel) {
  useConfirm({
    title: 'Unassign device',
    description: 'Are you sure you want to unassign this device?',
    async onConfirm() {
      await $api('/devices/{deviceId}/actions/unassign', {
        method: 'POST',
        path: { deviceId: device.id },
      })

      deviceRefresh()
      toast.add({ title: 'Device unassigned', icon: 'i-heroicons-check-circle' })
    },
  })
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
        title="Reader devices"
        :badge="devices?.length ?? '0'"
      >
        <template #right>
          <UInput
            ref="input"
            v-model="q"
            icon="i-heroicons-funnel"
            autocomplete="off"
            placeholder="Filter devices..."
            class="hidden lg:block"
            @keydown.esc="$event.target.blur()"
          >
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>
        </template>
      </UDashboardNavbar>

      <UDashboardModal
        v-model="isAssignModalOpen"
        title="Device assignment"
        description="Assign this device to a teacher"
        :ui="{ width: 'sm:max-w-md' }"
      >
        <UFormGroup label="Teacher">
          <FormTeacherSelect v-model="selectedTeacher" />
        </UFormGroup>

        <template #footer>
          <UButton
            class="ml-auto"
            color="primary"
            icon="i-heroicons-user-plus"
            label="Assign"
            type="submit"
            :disabled="!selectedTeacher"
            @click="assignDevice()"
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
        <template #commonName-data="{ row }">
          <span class="text-gray-900 dark:text-white font-medium">{{ row.commonName }}</span>
        </template>

        <template #teacher-data="{ row }">
          <span v-if="row.teacher">{{ row.teacher.name }}</span>
          <UBadge v-else color="gray" label="free" />
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

        <template #actions-data="{ row }">
          <UButton
            v-if="!row.teacher"
            color="primary"
            icon="i-heroicons-user-plus"
            @click="openAssignModal(row)"
          >
            Assign
          </UButton>
          <UButton
            v-else
            color="red"
            variant="outline"
            icon="i-heroicons-user-minus"
            @click="unassignDevice(row)"
          >
            Unassign
          </UButton>
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
