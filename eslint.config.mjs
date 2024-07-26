// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    type: 'app',
    vue: true,
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
  }),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'ts/no-use-before-define': 'warn',
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    },
  },
)
