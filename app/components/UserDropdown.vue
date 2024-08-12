<script setup lang="ts">
import type { UserViewModel } from '~/types/api'

const { user } = defineProps<{
  user: UserViewModel
}>()

const avatarUrl = computed(() => user ? `https://api.multiavatar.com/${user.username}.svg` : null)
const { logout } = useOidcAuth()
const { public: { version } } = useRuntimeConfig()

const { data: versionMetadata } = useLazyApi('/metadata/version')

const { isHelpSlideoverOpen } = useDashboard()

const items = computed(() => [
  [{
    slot: 'account',
    label: '',
    disabled: true,
  }],
  [{
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    shortcuts: ['?'],
    click: () => isHelpSlideoverOpen.value = true,
  }, {
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: () => logout(),
  }],
  [{
    slot: 'version',
    label: '',
    disabled: true,
  }],
])
</script>

<template>
  <UDropdown
    mode="hover"
    :items="items"
    :ui="{ width: 'w-full', item: { disabled: 'cursor-text select-text' } }"
    :popper="{ strategy: 'absolute', placement: 'top' }"
    class="w-full"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        :label="user.displayName"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            :src="avatarUrl"
            size="2xs"
          />
        </template>

        <template #trailing>
          <UIcon
            name="i-heroicons-ellipsis-vertical"
            class="w-5 h-5 ml-auto"
          />
        </template>
      </UButton>
    </template>

    <template #version>
      <div class="text-left text-sm">
        <p>Version: <span class="font-medium">{{ version }}</span></p>
        <p v-if="versionMetadata">
          API: <span class="font-medium">{{ versionMetadata.version }}</span>
        </p>
      </div>
    </template>

    <template #account>
      <div class="text-left">
        <p>Signed in as</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ user.email }}
        </p>
      </div>
    </template>
  </UDropdown>
</template>
