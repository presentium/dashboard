<script setup lang="ts">
import { format, parse } from 'date-fns'
import { useApi } from '#imports'

const route = useRoute()
const toast = useToast()
const { $api } = useNuxtApp()

const { data: schoolClass, status, refresh: classRefresh } = useApi('/school-classes/{schoolClassId}', {
  path: { schoolClassId: Number.parseInt(route.params.id as string) },
})
const pending = computed(() => status.value === 'pending')

const studentQuery = ref('')
const filteredStudents = computed(() => {
  if (!studentQuery.value)
    return schoolClass.value?.students
  return schoolClass.value?.students
    .filter(student => student.name.toLowerCase().includes(studentQuery.value.toLowerCase()))
})

const isImportModalOpen = ref(false)
const studentList = ref('')

async function importStudents() {
  if (!studentList.value) {
    return
  }

  const students = studentList.value.split(/[\n,;]/)
  await $api('/school-classes/{schoolClassId}/actions/import-students', {
    method: 'POST',
    path: { schoolClassId: schoolClass.value.id },
    body: students,
    onResponseError: ({ response }) => {
      toast.add({
        title: 'Could not import the students',
        description: response._data.message,
        icon: 'i-heroicons-x-circle',
        color: 'red',
      })
    },
  }).then(() => {
    classRefresh()
    toast.add({ title: 'Students imported', icon: 'i-heroicons-check-circle' })
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
        :title="`Class ${schoolClass?.name}`"
        :loading="pending"
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
            <span v-if="schoolClass">{{ formatDow(schoolClass?.dayOfWeek) }} at {{ formatTime(schoolClass?.start as string) }} to {{ formatTime(schoolClass?.end as string) }}</span>
          </div>
        </div>

        <UDashboardSection
          title="Teacher"
          description="The teacher responsible for this class, who is in charge of collecting attendance."
          orientation="horizontal"
          class="px-4 py-6"
        >
          <div class="grid grid-cols-3 gap-4">
            <div class="text-gray-400 dark:text-gray-500">
              Name
            </div>
            <div class="col-span-2">
              {{ schoolClass?.teacher?.name }}
            </div>
          </div>
        </UDashboardSection>

        <UDashboardSection
          title="Students"
          description="Students enrolled in this class, who are expected to attend the class."
          orientation="horizontal"
          class="px-4 py-6"
        >
          <template #links>
            <UButton
              label="Import students"
              color="black"
              @click="isImportModalOpen = true"
            />
          </template>

          <UCard
            :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
            class="min-w-0"
          >
            <template #header>
              <UInput
                v-model="studentQuery"
                icon="i-heroicons-magnifying-glass"
                placeholder="Search students"
                autofocus
              />
            </template>

            <ul
              role="list"
              class="divide-y divide-gray-200 dark:divide-gray-800"
            >
              <li
                v-for="(student, index) in filteredStudents"
                :key="index"
                class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="text-sm min-w-0">
                    <p class="text-gray-900 dark:text-white font-medium truncate">
                      {{ student.name }}
                    </p>
                  </div>
                </div>
              </li>
              <li v-if="!filteredStudents || filteredStudents.length === 0">
                <div class="py-4 px-6 flex align-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                  <UIcon name="i-heroicons-circle-stack-20-solid" class="size-6" />
                  no students found
                </div>
              </li>
            </ul>
          </UCard>

          <UDashboardModal
            v-model="isImportModalOpen"
            title="Import a schedule"
            description="Import courses and classes from a calendar file"
            :ui="{ width: 'sm:max-w-md' }"
          >
            <UFormGroup label="Student list" description="Include only full names, first name first, one per line">
              <UTextarea
                v-model="studentList"
                :rows="15"
                placeholder="Insert students here"
              />
            </UFormGroup>

            <template #footer>
              <UButton
                class="ml-auto"
                color="primary"
                icon="i-heroicons-document-arrow-down"
                label="Import classes"
                type="submit"
                :disabled="!studentList.length"
                @click="importStudents"
              />
            </template>
          </UDashboardModal>
        </UDashboardSection>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
