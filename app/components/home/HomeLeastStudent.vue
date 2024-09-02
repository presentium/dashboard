<script setup lang="ts">
import type { Period, Range } from '~/types'

const props = defineProps({
  period: {
    type: String as PropType<Period>,
    required: true,
  },
  range: {
    type: Object as PropType<Range>,
    required: true,
  },
  classId: {
    type: Number as PropType<number>,
    required: true,
  },
})

const startDate = computed(() => new Date(props.range.start).toISOString().slice(0, -1))
const endDate = computed(() => new Date(props.range.end).toISOString().slice(0, -1))

const { data: fetchedData } = useApi<PresenceViewModel[]>('/presences', {
  params: computed(() => ({
    startDate: startDate.value,
    endDate: endDate.value,
    classId: props.classId,
  })),
})

interface StudentPresencePercentage {
  studentId: string
  firstName: string
  lastName: string
  email: string
  presencePercentage: number
}

const { data } = await useAsyncData<StudentPresencePercentage[]>(async () => {
  const studentPresenceMap: Record<string, number> = {}
  const uniqueDates = new Set<string>()

  fetchedData.value.forEach((record) => {
    const student = record.student
    const studentId = student.id
    const date = new Date(record.date).toISOString().slice(0, 10)

    uniqueDates.add(date)

    if (!studentPresenceMap[studentId]) {
      studentPresenceMap[studentId] = 0
    }

    if (record.present) {
      studentPresenceMap[studentId] += 1
    }
  })

  const totalClasses = uniqueDates.size

  const studentPresencePercentages = Object.entries(studentPresenceMap).map(([studentId, presenceCount]) => {
    const studentRecord = fetchedData.value.find(record => record.student.id === studentId)
    const presencePercentage = totalClasses > 0 ? (presenceCount / totalClasses) * 100 : 0

    return {
      studentId,
      firstName: studentRecord?.student.firstName || '',
      lastName: studentRecord?.student.lastName || '',
      email: studentRecord?.student.email || '',
      presencePercentage: presencePercentage.toFixed(1),
    }
  })

  return studentPresencePercentages.sort((a, b) => a.presencePercentage - b.presencePercentage).slice(0, 5)
}, {
  watch: [() => props.period, () => props.range, () => props.classId],
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
      v-for="(student, index) in data"
      :key="student.studentId"
      class="px-3 py-2 -mx-2 last:-mb-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    >
      <UAvatar
        :alt="`${student.firstName} ${student.lastName}`"
        :src="`https://i.pravatar.cc/128?u=${index}`"
        size="md"
      />

      <div class="text-sm flex-1">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ student.firstName }} {{ student.lastName }}
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            {{ student.email }}
          </p>
        </div>
      </div>

      <p class="text-gray-900 dark:text-white font-medium text-lg">
        {{ student.presencePercentage }}%
      </p>
    </NuxtLink>
  </UDashboardCard>
</template>
