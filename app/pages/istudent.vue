<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types/api'
import StudentHomeChart from '~/components/home/StudentHomeChart.vue'
import StudentTopClasses from '~/components/home/StudentTopClasses.vue';

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')
const classId = ref<number>()
const studentId = ref<string>('00000000-0000-0000-0000-000000000001')
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home" />
      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ml-2.5" />
        </template>
      </UDashboardToolbar>
      <div class="grid lg:grid-cols-2 lg:items-start mt-4">
        <StudentHomeChart
          :period="period"
          :range="range"
          :class-id="classId"
          :student-id="studentId"
        />
        <StudentTopClasses
          :period="period"
          :range="range"
          :student-id="studentId"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
/* Ajoutez vos styles ici */
</style>
