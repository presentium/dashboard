<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps({
  studentId: {
    type: String as PropType<string>,
    required: true,
  },
})

const emit = defineEmits(['update:student-id'])

const { data: fetchedData } = useApi<StudentViewModel[]>('/students')

const selectedStudent = ref(props.studentId)

const studentOptions = computed(() => {
  return fetchedData.value
    ? fetchedData.value.map(student => ({
      label: `${student.firstName} ${student.lastName}`,
      id: student.id,
    }))
    : []
})

watch(selectedStudent, (newClassId) => {
  emit('update:student-id', newClassId.id)
})
</script>

<template>
  <USelectMenu
    v-slot="{ open }"
    v-model="selectedStudent"
    :options="studentOptions"
    :ui-menu="{ width: 'w-32', option: { base: 'capitalize' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UButton
      :label="selectedStudent?.label || 'Select Student'"
      color="gray"
      variant="ghost"
      class="capitalize"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    />
  </USelectMenu>
</template>
