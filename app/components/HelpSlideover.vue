<script setup lang="ts">
const { isHelpSlideoverOpen } = useDashboard()

const links = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open',
  to: 'https://presentium.ch/docs',
  target: '_blank',
}, {
  label: 'GitHub Organisation',
  icon: 'i-simple-icons-github',
  to: 'https://github.com/presentium',
  target: '_blank',
}]
</script>

<template>
  <UDashboardSlideover v-model="isHelpSlideoverOpen">
    <template #title>
      Help & Support
    </template>
    <div class="flex flex-col gap-y-3">
      <UButton
        v-for="(link, index) in links"
        :key="index"
        color="white"
        v-bind="link"
      />
    </div>
  </UDashboardSlideover>
</template>
