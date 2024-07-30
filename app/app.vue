<script setup lang="ts">
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

const title = 'Presentium - Management Dashboard'
const description = 'Manage users, start workflows, create exports. From Presentium - Attendance monitoring made easy.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://repository-images.githubusercontent.com/832545372/2ad772c0-904a-440e-add5-667a6d339344',
  twitterImage: 'https://repository-images.githubusercontent.com/832545372/2ad772c0-904a-440e-add5-667a6d339344',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
