<script setup lang="ts">
import { eachDayOfInterval, format, isSameDay } from 'date-fns'
import { VisAxis, VisBulletLegend, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import { FitMode, GroupedBar } from '@unovis/ts'
import type { Period, Range } from '~/types/api'

const props = defineProps<{
  period: Period
  range: Range
  classId?: number
}>()
const { range } = toRefs(props)

const startDate = computed(() => new Date(range.value.start).toISOString().slice(0, -1))
const endDate = computed(() => new Date(range.value.end).toISOString().slice(0, -1))
const { data: attendanceData } = useApi('/presences', {
  query: {
    schoolClassId: props.classId,
    studentId: '@me',
    start: startDate,
    end: endDate,
  } as any,
})

const { data } = useAsyncData('filteredAttendanceData', async () => {
  return attendanceData.value.reduce((acc, d) => {
    const existing = acc.find(item => isSameDay(new Date(item.date), new Date(d.date)))
    if (existing) {
      existing.present += d.present ? 1 : 0
      existing.absent += d.present ? 0 : 1
      existing.presentCourses = existing.presentCourses || []
      existing.absentCourses = existing.absentCourses || []
      if (d.present) {
        existing.presentCourses.push(d.course.name)
      }
      else {
        existing.absentCourses.push(d.course.name)
      }
    }
    else {
      acc.push({
        date: format(new Date(d.date), 'yyyy-MM-dd'),
        present: d.present ? 1 : 0,
        absent: d.present ? 0 : 1,
        presentCourses: d.present ? [d.course.name] : [],
        absentCourses: d.present ? [] : [d.course.name],
      })
    }
    return acc
  }, eachDayOfInterval({
    start: new Date(startDate.value),
    end: new Date(endDate.value),
  }).map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    present: 0,
    absent: 0,
    presentCourses: [],
    absentCourses: [],
  })) as Array<{ date: string, present: number, absent: number, presentCourses: string[], absentCourses: string[] }>)
}, {
  watch: [startDate, endDate, attendanceData],
  default: () => [],
})

const cardRef = ref<HTMLElement | null>(null)
const { width } = useElementSize(cardRef)

const x = (d: any) => new Date(d.date)
const y = [d => d.present, d => d.absent]
const tickFormat = (date: Date) => format(date, 'dd MMM yyyy')

function tooltipTemplate(d: any): string {
  const date = format(new Date(d.date), 'dd MMM yyyy')
  const presentCourses = d.presentCourses || []
  const absentCourses = d.absentCourses || []
  return `
    <div style="font-size: 12px">
      <div style="color: #666; text-align: center">${date}</div>
      <div><b>Present (${presentCourses.length}) : </b> ${presentCourses.join(', ')}</div>
      <div><b>Absent (${absentCourses.length}) : </b> ${absentCourses.join(', ')}</div>
    </div>
  `
}

watchEffect(() => {
  console.log(data.value)
})
</script>

<template>
  <div ref="cardRef">
    <VisBulletLegend :items="['Present', 'Absent'].map(name => ({ name }))" />
    <VisXYContainer :data="data">
      <VisGroupedBar :x="x" :y="y" :bar-min-height="0" />
      <VisTooltip :triggers="{ [GroupedBar.selectors.bar]: tooltipTemplate }" />
      <VisAxis type="x" :tick-format="tickFormat" />
      <VisAxis
        type="y"
        :tick-format="(val) => `${val}`"
        :tick-text-width="width < 768 ? 75 : null"
        :tick-text-fit-mode="FitMode.Trim"
        :label="width < 768 ? null : 'Absence vs Attendance'"
        :grid-line="false"
      />
    </VisXYContainer>
  </div>
</template>

<style scoped>

</style>
