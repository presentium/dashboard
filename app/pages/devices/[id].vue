<script setup lang="ts">
import { useApi } from '#imports'
import type { SchoolClassViewModel, StudentRef } from '~/types/api'

const route = useRoute()
const toast = useToast()
const { $api } = useNuxtApp()

const { data: device, status, refresh: deviceRefresh } = useApi('/devices/{deviceId}', {
  path: { deviceId: route.params.id as string },
})
const pending = computed(() => status.value === 'pending')

const isEnrollModalOpen = ref(false)
const isPresenceCheckModalOpen = ref(false)

const selectedStudent = ref<StudentRef>()
const selectedSchoolClass = ref<SchoolClassViewModel>()

async function enrollStudent() {
  if (!selectedStudent.value) {
    return
  }

  await $api('/devices/{deviceId}/actions/enroll-student', {
    method: 'POST',
    path: { deviceId: device.value.id },
    body: { student: selectedStudent.value.id },
    onResponseError: ({ response }) => {
      toast.add({
        title: 'Could not start the enrolling the student',
        description: response._data.message,
        icon: 'i-heroicons-x-circle',
        color: 'red',
      })
    },
  }).then(() => {
    deviceRefresh()
    toast.add({ title: 'Student enrolled', icon: 'i-heroicons-check-circle' })
  })

  isEnrollModalOpen.value = false
}

async function startPresenceControl() {
  if (!selectedSchoolClass.value) {
    return
  }

  await $api('/devices/{deviceId}/actions/presence-check', {
    method: 'POST',
    path: { deviceId: device.value.id },
    body: { schoolClass: selectedSchoolClass.value.id },
    onResponseError: ({ response }) => {
      toast.add({
        title: 'Could not start the presence check',
        description: response._data.message,
        icon: 'i-heroicons-x-circle',
        color: 'red',
      })
    },
  }).then(() => {
    deviceRefresh()
    toast.add({ title: 'Presence check started', icon: 'i-heroicons-check-circle' })
  })

  isPresenceCheckModalOpen.value = false
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        :title="`Device ${device?.commonName}`"
        :loading="pending"
      />

      <div class="grid grid-cols-3 gap-4 px-4 py-3">
        <div class="text-gray-400 dark:text-gray-500">
          ID
        </div>
        <div class="col-span-2">
          {{ device.id }}
        </div>

        <div class="text-gray-400 dark:text-gray-500">
          Common Name
        </div>
        <div class="col-span-2">
          {{ device.commonName }}
        </div>

        <div class="text-gray-400 dark:text-gray-500">
          Status
        </div>
        <div class="col-span-2">
          <UBadge
            :label="device.connected ? 'connected' : 'disconnected'"
            :color="device.connected ? 'green' : 'red'"
            variant="subtle"
          />
        </div>
        <div class="text-gray-400 dark:text-gray-500">
          Mode
        </div>
        <div class="col-span-2">
          <DeviceMode :mode="device.mode" />
        </div>

        <div class="text-gray-400 dark:text-gray-500">
          Loaned by
        </div>
        <div class="col-span-2">
          <span v-if="device.teacher">{{ device.teacher.name }}</span>
          <UBadge v-else color="gray" label="free" />
        </div>
      </div>

      <UDivider />

      <UDashboardPanelContent class="pb-24">
        <UDashboardSection
          title="Device mode"
          description="Send commands to the device to enroll new users or start a presence check."
          icon="i-heroicons-command-line"
          orientation="horizontal"
        >
          <div class="grid gap-6 sm:grid-cols-2">
            <a
              class="block px-6 py-8 rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group hover:cursor-pointer"
              @click="isEnrollModalOpen = true"
            >
              <div class="inline-flex items-center rounded-full p-1.5 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 ring-1 ring-gray-300 dark:ring-gray-700 mb-4 group-hover:ring-primary/50">
                <UIcon class="w-5 h-5 text-gray-900 dark:text-white group-hover:text-primary" name="i-heroicons-user-plus" />
              </div>
              <p class="font-medium text-gray-900 dark:text-white text-[15px] mb-1">Enroll student</p>
              <p class="text-sm font-normal text-gray-500 dark:text-gray-400 line-clamp-2">Ask the reader to read a card to link it to a student in the system</p>
            </a>
            <a
              class="block px-6 py-8 rounded-lg shadow-sm border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 group hover:cursor-pointer"
              @click="isPresenceCheckModalOpen = true"
            >
              <div class="inline-flex items-center rounded-full p-1.5 bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 ring-1 ring-gray-300 dark:ring-gray-700 mb-4 group-hover:ring-primary/50">
                <UIcon class="w-5 h-5 text-gray-900 dark:text-white group-hover:text-primary" name="i-heroicons-academic-cap" />
              </div>
              <p class="font-medium text-gray-900 dark:text-white text-[15px] mb-1">Start presence check</p>
              <p class="text-sm font-normal text-gray-500 dark:text-gray-400 line-clamp-2">Ask the reader to start a presence check for a new class session</p>
            </a>
          </div>
        </UDashboardSection>
      </UDashboardPanelContent>

      <UDashboardModal
        v-model="isEnrollModalOpen"
        title="Student enrollment"
        description="Link the student below to a card"
        :ui="{ width: 'sm:max-w-md' }"
      >
        <UFormGroup label="Student">
          <FormStudentSelect v-model="selectedStudent" />
        </UFormGroup>

        <template #footer>
          <UButton
            class="ml-auto"
            color="primary"
            icon="i-heroicons-paper-airplane"
            label="Start Enrollment"
            type="submit"
            :disabled="!selectedStudent"
            @click="enrollStudent"
          />
        </template>
      </UDashboardModal>
      <UDashboardModal
        v-model="isPresenceCheckModalOpen"
        title="Start class session"
        description="Create a session for one of your classes and start recording attendance"
        :ui="{ width: 'sm:max-w-md' }"
      >
        <UFormGroup label="School class" description="You may only start sessions for classes on the current day">
          <FormSchoolClassSelect v-model="selectedSchoolClass" self today />
        </UFormGroup>

        <template #footer>
          <UButton
            class="ml-auto"
            color="primary"
            icon="i-heroicons-paper-airplane"
            label="Start Presence Check"
            type="submit"
            :disabled="!selectedSchoolClass"
            @click="startPresenceControl"
          />
        </template>
      </UDashboardModal>
    </UDashboardPanel>
  </UDashboardPage>
</template>
