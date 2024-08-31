import { createSharedComposable } from '@vueuse/core'

function _useDashboard() {
  const route = useRoute()
  const isHelpSlideoverOpen = ref(false)

  defineShortcuts({
    '?': () => isHelpSlideoverOpen.value = true,
  })

  watch(() => route.fullPath, () => {
    isHelpSlideoverOpen.value = false
  })

  return {
    isHelpSlideoverOpen,
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
