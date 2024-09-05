<script setup lang="ts">
import type { Period, Range } from '~/types/api'

const props = defineProps<{
  period: Period
  range: Range
  classId?: number
}>()

const { classId: schoolClassId, range } = toRefs(props)

const startDate = computed(() => new Date(range.value.start).toISOString().slice(0, -1))
const endDate = computed(() => new Date(range.value.end).toISOString().slice(0, -1))

const { data: fetchedData } = useApi('/presences', {
  query: {
    schoolClassId,
    start: startDate,
    end: endDate,
  } as any,
})
const { data } = await useAsyncData<StudentPresence[]>(async () => {
  const studentPresenceMap = {}
  fetchedData.value.forEach((record) => {
    const studentId = record.student.id
    const studentName = record.student.name
    if (!studentPresenceMap[studentId]) {
      studentPresenceMap[studentId] = { count: 0, total: 0, name: studentName }
    }
    studentPresenceMap[studentId].total += 1
    if (record.present) {
      studentPresenceMap[studentId].count += 1
    }
  })
  const studentPresenceList = Object.entries(studentPresenceMap).map(([studentId, data]) => ({
    studentId,
    name: data.name,
    presencePercentage: ((data.count / data.total) * 100).toFixed(2),
  }))
  return studentPresenceList.sort((a, b) => a.presencePercentage - b.presencePercentage).slice(0, 10)
}, {
  watch: [() => props.period, () => props.range, fetchedData],
  default: () => [],
})
</script>

<template>
  <UDashboardCard
    title="Least presence"
    description="Students with the least presence during the selected period"
    icon="i-heroicons-chart-bar-20-solid"
  >
    <NuxtLink
      v-for="student in data"
      :key="student.studentId"
      class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    >
      <div class="text-sm flex-1">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ student.name }}
          </p>
        </div>
      </div>

      <p class="text-gray-900 dark:text-white font-medium text-lg">
        {{ student.presencePercentage }}%
      </p>
    </NuxtLink>
  </UDashboardCard>
</template>
