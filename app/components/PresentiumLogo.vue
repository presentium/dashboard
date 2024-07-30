<script setup lang="ts">
const props = defineProps<{
  hideIcon?: boolean
}>()
</script>

<template>
  <div class="flex items-center space-x-2">
    <Icon
      v-if="!props.hideIcon"
      name="solar:bookmark-square-linear"
      size="36px"
      class="text-purple-500"
    />

    <span class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 text-transparent bg-clip-text">Presentium</span>
  </div>
</template>
