import { createSharedComposable } from '@vueuse/core'

function _useDashboard() {
  const route = useRoute()
  const router = useRouter()
  const isHelpSlideoverOpen = ref(false)
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': async () => router.push('/'),
    'g-i': async () => router.push('/inbox'),
    'g-u': async () => router.push('/users'),
    'g-s': async () => router.push('/settings'),
    '?': () => isHelpSlideoverOpen.value = true,
    'n': () => isNotificationsSlideoverOpen.value = true,
  })

  watch(() => route.fullPath, () => {
    isHelpSlideoverOpen.value = false
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isHelpSlideoverOpen,
    isNotificationsSlideoverOpen,
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
