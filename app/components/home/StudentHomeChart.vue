<script setup lang="ts">
import { eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, format, isSameDay } from 'date-fns'
import { VisAxis, VisBulletLegend, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import { FitMode, StackedBar } from '@unovis/ts'
import type { Period, Range } from '~/types/api'

const props = defineProps<{
  period: Period
  range: Range
  classId?: number
  studentId?: string
}>()
const { classId: schoolClassId, studentId, range } = toRefs(props)

const startDate = computed(() => new Date(range.value.start).toISOString().slice(0, -1))
const endDate = computed(() => new Date(range.value.end).toISOString().slice(0, -1))
const attendanceData: [] = [
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 1,
      name: 'PDG-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-20T00:00:00',
    present: true,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 2,
      name: 'PDG-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-21T00:00:00',
    present: true,
  },
  {
    course: {
      id: 2,
      name: 'PRG1',
    },
    schoolClass: {
      id: 3,
      name: 'PRG1-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-22T00:00:00',
    present: false,
  },
  {
    course: {
      id: 2,
      name: 'PRG1',
    },
    schoolClass: {
      id: 4,
      name: 'PRG1-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-23T00:00:00',
    present: false,
  },
  {
    course: {
      id: 3,
      name: 'ASD',
    },
    schoolClass: {
      id: 5,
      name: 'ASD-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-24T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 1,
      name: 'PDG-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-24T00:00:00',
    present: true,
  },
  {
    course: {
      id: 4,
      name: 'PRG2',
    },
    schoolClass: {
      id: 8,
      name: 'PRG2-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-24T00:00:00',
    present: false,
  },
  {
    course: {
      id: 3,
      name: 'ASD',
    },
    schoolClass: {
      id: 6,
      name: 'ASD-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-25T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 1,
      name: 'PDG-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-25T00:00:00',
    present: true,
  },
  {
    course: {
      id: 4,
      name: 'PRG2',
    },
    schoolClass: {
      id: 7,
      name: 'PRG2-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-26T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 1,
      name: 'PDG-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-26T00:00:00',
    present: true,
  },
  {
    course: {
      id: 4,
      name: 'PRG2',
    },
    schoolClass: {
      id: 7,
      name: 'PRG2-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-27T00:00:00',
    present: false,
  },
  {
    course: {
      id: 5,
      name: 'ARO',
    },
    schoolClass: {
      id: 9,
      name: 'ARO-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-27T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 1,
      name: 'PDG-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-27T00:00:00',
    present: true,
  },
  {
    course: {
      id: 3,
      name: 'ASD',
    },
    schoolClass: {
      id: 6,
      name: 'ASD-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-28T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 2,
      name: 'PDG-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-28T00:00:00',
    present: false,
  },
  {
    course: {
      id: 5,
      name: 'ARO',
    },
    schoolClass: {
      id: 10,
      name: 'ARO-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-28T00:00:00',
    present: false,
  },
  {
    course: {
      id: 2,
      name: 'PRG1',
    },
    schoolClass: {
      id: 3,
      name: 'PRG1-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-29T00:00:00',
    present: false,
  },
  {
    course: {
      id: 4,
      name: 'PRG2',
    },
    schoolClass: {
      id: 8,
      name: 'PRG2-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-29T00:00:00',
    present: false,
  },
  {
    course: {
      id: 3,
      name: 'ASD',
    },
    schoolClass: {
      id: 5,
      name: 'ASD-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-29T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 1,
      name: 'PDG-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-30T00:00:00',
    present: false,
  },
  {
    course: {
      id: 1,
      name: 'PDG',
    },
    schoolClass: {
      id: 2,
      name: 'PDG-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-30T00:00:00',
    present: false,
  },
  {
    course: {
      id: 2,
      name: 'PRG1',
    },
    schoolClass: {
      id: 4,
      name: 'PRG1-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-30T00:00:00',
    present: false,
  },
  {
    course: {
      id: 5,
      name: 'ARO',
    },
    schoolClass: {
      id: 9,
      name: 'ARO-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-30T00:00:00',
    present: false,
  },
  {
    course: {
      id: 2,
      name: 'PRG1',
    },
    schoolClass: {
      id: 4,
      name: 'PRG1-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-31T00:00:00',
    present: false,
  },
  {
    course: {
      id: 5,
      name: 'ARO',
    },
    schoolClass: {
      id: 10,
      name: 'ARO-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-31T00:00:00',
    present: false,
  },
  {
    course: {
      id: 4,
      name: 'PRG2',
    },
    schoolClass: {
      id: 8,
      name: 'PRG2-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-31T00:00:00',
    present: false,
  },
  {
    course: {
      id: 3,
      name: 'ASD',
    },
    schoolClass: {
      id: 5,
      name: 'ASD-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-08-31T00:00:00',
    present: false,
  },
  {
    course: {
      id: 5,
      name: 'ARO',
    },
    schoolClass: {
      id: 9,
      name: 'ARO-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-09-01T00:00:00',
    present: false,
  },
  {
    course: {
      id: 3,
      name: 'ASD',
    },
    schoolClass: {
      id: 6,
      name: 'ASD-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-09-01T00:00:00',
    present: false,
  },
  {
    course: {
      id: 4,
      name: 'PRG2',
    },
    schoolClass: {
      id: 7,
      name: 'PRG2-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-09-02T00:00:00',
    present: false,
  },
  {
    course: {
      id: 5,
      name: 'ARO',
    },
    schoolClass: {
      id: 10,
      name: 'ARO-A-L1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-09-02T00:00:00',
    present: false,
  },
  {
    course: {
      id: 2,
      name: 'PRG1',
    },
    schoolClass: {
      id: 3,
      name: 'PRG1-A-C1',
    },
    student: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Alice Smith',
    },
    date: '2024-09-02T00:00:00',
    present: false,
  },
]

const data = attendanceData.reduce((acc, d) => {
  const existing = acc.find(item => item.date === d.date)
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
      date: d.date,
      present: d.present ? 1 : 0,
      absent: d.present ? 0 : 1,
      presentCourses: d.present ? [d.course.name] : [],
      absentCourses: d.present ? [] : [d.course.name],
    })
  }
  return acc
}, [] as Array<{ date: string, present: number, absent: number, presentCourses: string[], absentCourses: string[] }>)

const isSmallScreen = window?.innerWidth < 768

const x = (d: any) => new Date(d.date)
const y = [d => d.present / (d.present + d.absent), d => d.absent / (d.present + d.absent)]
const tickFormat = (date: Date) => format(date, 'yyyy-MM-dd')

function tooltipTemplate(d: any): string {
  const date = format(new Date(d.date), 'yyyy-MM-dd')
  const presentCourses = d.presentCourses || []
  const absentCourses = d.absentCourses || []
  return `
    <div style="font-size: 12px">
      <div style="color: #666; text-align: center">${date}</div>
      <div><b>Présent (${presentCourses.length}) : </b> ${presentCourses.join(', ')}</div>
      <div><b>Absent (${absentCourses.length}) : </b> ${absentCourses.join(', ')}</div>
    </div>
  `
}
</script>

<template>
  <UDashboardPanelContent>
    <VisBulletLegend :items="['Present', 'Absent'].map(name => ({ name }))" />
    <VisXYContainer :height="600" :scale-by-domain="true">
      <VisStackedBar :data="data" :x="x" :y="y" x-scale-type="band" />
      <VisTooltip :triggers="{ [StackedBar.selectors.bar]: tooltipTemplate }" />
      <VisAxis type="x" :tick-format="tickFormat" />
      <VisAxis
        type="y"
        :tick-format="(val) => `${val * 100}%`"
        :tick-text-width="isSmallScreen ? 75 : null"
        :tick-text-fit-mode="FitMode.Trim"
        :label="isSmallScreen ? null : 'Percentage of Attendance/Absences'"
        :num-ticks="5"
        :grid-line="false"
      />
    </VisXYContainer>
  </UDashboardPanelContent>
</template>

<style scoped>

</style>
