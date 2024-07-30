export default defineAppConfig({
  ui: {
    primary: 'purple',
    gray: 'zinc',
    tooltip: {
      // @ts-expect-error weird issue with DeepPartial in @nuxt/ui
      default: {
        openDelay: 500,
      },
    },
  },
})
