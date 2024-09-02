<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types/api'
import HomeLeastStudent from '~/components/home/HomeLeastStudent.vue'
import HomeTopClasses from '~/components/home/HomeTopClasses.vue'

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
const period = ref<Period>('daily')
const classId = ref<number>()
const studentId = ref<string>()
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Home" />

      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ml-2.5" />
          <HomePeriodSelect v-model="period" :range="range" />
          <HomeClassesSelect v-model="classId" />
          <HomeStudentsSelect v-model="studentId" />
        </template>
      </UDashboardToolbar>

      <UDashboardPanelContent>
        <HomeChart
          :period="period"
          :range="range"
          :class-id="classId"
          :student-id="studentId"
        />

        <div class="grid lg:grid-cols-2 lg:items-start gap-8 mt-8">
          <ClientOnly>
            <HomeLeastStudent
              :period="period"
              :range="range"
              :class-id="classId"
            />
            <HomeTopClasses
              :period="period"
              :range="range"
            />
          </ClientOnly>
        </div>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>
