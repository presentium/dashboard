<script setup lang="ts">
import type { Period, Range } from '~/types/api'

const props = defineProps<{
  period: Period
  range: Range
}>()

const { range } = toRefs(props)

const startDate = computed(() => new Date(range.value.start).toISOString().slice(0, -1))
const endDate = computed(() => new Date(range.value.end).toISOString().slice(0, -1))
const colors = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'pink']

const { data: fetchedData } = useApi('/presences', {
  query: {
    start: startDate,
    end: endDate,
  } as any,
})

interface ClassPresence {
  classId: number
  className: string
  presenceCount: number
  color: string
}

const { data } = await useAsyncData<ClassPresence[]>(async () => {
  const classPresenceMap: Record<number, { count: number, total: number, name: string }> = {}

  fetchedData.value.forEach((record) => {
    const classId = record.schoolClass.id
    const className = record.schoolClass.name

    if (!classPresenceMap[classId]) {
      classPresenceMap[classId] = { count: 0, total: 0, name: className }
    }

    classPresenceMap[classId].total += 1
    if (record.present) {
      classPresenceMap[classId].count += 1
    }
  })

  const classPresenceList = Object.entries(classPresenceMap).map(([classId, data], index) => ({
    classId: Number(classId),
    className: data.name,
    presenceCount: data.count / data.total * 100,
    color: colors[index % colors.length],
  }))

  return classPresenceList.sort((a, b) => b.presenceCount - a.presenceCount).slice(0, 10)
}, {
  watch: [() => props.period, () => props.range, fetchedData],
  default: () => [],
})
</script>

<template>
  <UDashboardCard
    title="Top classes"
    description="Classes with the highest number of presences during the selected period"
    icon="i-heroicons-globe-alt-20-solid"
  >
    <div class="flex flex-col gap-1">
      <UMeter
        v-for="classPresence in data"
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
