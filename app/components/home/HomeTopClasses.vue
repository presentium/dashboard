<script setup lang="ts">
import { computed } from 'vue'
import type { Period } from '~/types'

const props = defineProps({
  period: {
    type: String as PropType<Period>,
    required: true,
  },
  range: {
    type: Object as PropType<Range>,
    required: true,
  },
})

const startDate = computed(() => new Date(props.range.start).toISOString().slice(0, -1))
const endDate = computed(() => new Date(props.range.end).toISOString().slice(0, -1))
const colors = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'pink']

const { data: fetchedData } = useApi<PresenceViewModel[]>('/presences', {
  params: computed(() => ({
    startDate: startDate.value,
    endDate: endDate.value,
  })),
})

interface ClassPresence {
  classId: number
  className: string
  presenceCount: number
  color: string
}

const { data } = await useAsyncData<ClassPresence[]>(async () => {
  const classPresenceMap: Record<number, { count: number, name: string }> = {}

  fetchedData.value.forEach((record) => {
    const classId = record.schoolClass.id
    const className = record.schoolClass.name

    if (!classPresenceMap[classId]) {
      classPresenceMap[classId] = { count: 0, name: className }
    }

    if (record.present) {
      classPresenceMap[classId].count += 1
    }
  })

  const classPresenceList = Object.entries(classPresenceMap).map(([classId, data], index) => ({
    classId: Number(classId),
    className: data.name,
    presenceCount: data.count,
    color: colors[index % colors.length],
  }))

  return classPresenceList.sort((a, b) => b.presenceCount - a.presenceCount).slice(0, 10)
}, {
  watch: [() => props.period, () => props.range],
  default: () => [],
})
</script>

<template>
  <UDashboardCard
    title="Top classes"
    description="Classes with the highest number of presences during the selected period"
    icon="i-heroicons-globe-alt-20-solid"
  >
    <div class="space-y-2">
      <UMeter
        v-for="(classPresence) in data"
        :key="classPresence.classId"
        :value="classPresence.presenceCount"
        :label="classPresence.className"
        :color="classPresence.color"
        size="lg"
        class="flex-row-reverse items-center"
        :ui="{ label: { base: 'flex-shrink-0 w-24' }, indicator: { container: '!w-auto' }, meter: { base: 'flex-1' } }"
        indicator
      />
    </div>
  </UDashboardCard>
</template>
