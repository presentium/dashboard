<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types'
import HomeLeastStudent from '~/components/home/HomeLeastStudent.vue'
import HomeTopClasses from '~/components/home/HomeTopClasses.vue'

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')
const classId = ref<number>(1)
const studentId = ref<string | null>(null)
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home" />

      <UDashboardToolbar>
        <template #left>
          <!-- ~/components/home/HomeDateRangePicker.vue -->
          <HomeDateRangePicker
            v-model="range"
            class="-ml-2.5"
          />

          <!-- ~/components/home/HomePeriodSelect.vue -->
          <HomePeriodSelect
            v-model="period"
            :range="range"
          />

          <!-- ~/components/home/HomeClassesSelect.vue -->
          <HomeClassesSelect
            v-model:class-id="classId"
          />

          <!-- ~/components/home/HomeStudentsSelect.vue -->
          <HomeStudentsSelect
            v-model:student-id="studentId"
          />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <!-- ~/components/home/HomeChart.vue -->
        <HomeChart
          :period="period"
          :range="range"
          :class-id="classId"
          :student-id="studentId"
        />

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <!-- ~/components/home/HomeLeastStudent.vue -->
          <HomeLeastStudent
            :period="period"
            :range="range"
            :class-id="classId"
          />
          <!-- ~/components/home/HomeTopClasses.vue -->
          <HomeTopClasses
            :period="period"
            :range="range"
          />
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
