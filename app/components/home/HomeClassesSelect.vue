<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  classId: {
    type: Number as PropType<number>,
    required: true,
    default: 1,
  },
})

const emit = defineEmits(['update:class-id'])

const { data: fetchedData } = useApi<SchoolClassViewModel[]>('/classes')

const selectedClass = ref(props.classId)

const classOptions = computed(() => {
  return fetchedData.value
    ? fetchedData.value.map(schoolClass => ({
      label: schoolClass.name,
      id: schoolClass.id,
    }))
    : []
})

watch(selectedClass, (newClassId) => {
  emit('update:class-id', newClassId.id)
})
</script>

<template>
  <USelectMenu
    v-slot="{ open }"
    v-model="selectedClass"
    :options="classOptions"
    :ui-menu="{ width: 'w-32', option: { base: 'capitalize' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      :label="selectedClass?.label || 'Select Class'"
      color="gray"
      variant="ghost"
      class="capitalize"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </USelectMenu>
</template>
