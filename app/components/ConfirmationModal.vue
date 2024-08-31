<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()

const emit = defineEmits(['confirm', 'cancel'])

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>

<template>
  <UDashboardModal
    :title="title"
    :description="description"
    icon="i-heroicons-exclamation-circle"
    :ui="{
      icon: { base: 'text-red-500 dark:text-red-400' } as any,
      footer: { base: 'ml-16' } as any,
    }"
  >
    <template #footer>
      <UButton color="red" label="Confirm" @click="onConfirm" />
      <UButton color="white" label="Cancel" @click="onCancel" />
    </template>
  </UDashboardModal>
</template>
