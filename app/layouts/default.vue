<script setup lang="ts">
import type { DashboardSidebarLink } from '#ui-pro/types'

const { isHelpSlideoverOpen } = useDashboard()

const { data: user, status: userStatus } = await useApi('/auth/@me')
const { student, teacher, admin } = useRole()

const links = computed((): DashboardSidebarLink[] => {
  const res: DashboardSidebarLink[] = [{
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/',
  }]

  if (student.value && !teacher.value) {
    res.push({
      label: 'My classes',
      to: '/@me/classes',
      icon: 'i-heroicons-academic-cap',
    })
  }

  if (teacher.value) {
    res.push(
      {
        label: 'Personal space',
        icon: 'i-heroicons-academic-cap',
        children: [{
          label: 'My classes',
          to: '/@me/classes',
        }, {
          label: 'My devices',
          to: '/@me/devices',
        }],
      },
    )

    if (!admin.value) {
      res.push({
        label: 'Management',
        icon: 'i-heroicons-adjustments-horizontal',
        children: [{
          label: 'Classes',
          to: '/directory/classes',
        }, {
          label: 'Students',
          to: '/directory/students',
        }],
      })
    }
  }

  if (admin.value) {
    res.push({
      label: 'Management',
      icon: 'i-heroicons-adjustments-horizontal',
      children: [{
        label: 'Classes',
        to: '/directory/classes',
      }, {
        label: 'Students',
        to: '/directory/students',
      }, {
        label: 'Teachers',
        to: '/directory/teachers',
      }, {
        label: 'Devices',
        to: '/directory/devices',
      }],
    })
  }

  return res
})

const footerLinks = [{
  label: 'Help & Support',
  icon: 'i-heroicons-question-mark-circle',
  click: () => isHelpSlideoverOpen.value = true,
}]
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar
        class="!border-transparent"
        :ui="{ left: 'flex-1' }"
      >
        <template #left>
          <PresentiumLogo />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <UDashboardSidebarLinks :links="links" />

        <div class="flex-1" />

        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <ClientOnly>
            <UserDropdown
              v-if="userStatus === 'success'"
              :user="user"
            />
            <USkeleton
              v-else
              class="h-6 w-full"
            />
          </ClientOnly>
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />

    <ClientOnly>
      <LazyUDashboardSearch />
    </ClientOnly>
  </UDashboardLayout>
</template>
