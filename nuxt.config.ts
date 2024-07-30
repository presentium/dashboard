// https://nuxt.com/docs/api/configuration/nuxt-config
import { env } from 'node:process'

export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-oidc-auth',
    'nuxt-open-fetch',
  ],

  oidc: {
    enabled: true,
    defaultProvider: 'oidc',
    providers: {
      oidc: {
        clientId: env.AUTH_OIDC_CLIENT_ID ?? '',
        clientSecret: env.AUTH_OIDC_CLIENT_SECRET ?? '',
        authorizationUrl: env.AUTH_OIDC_PROVIDER_AUTHORIZE_URL ?? '',
        tokenUrl: env.AUTH_OIDC_PROVIDER_TOKEN_URL ?? '',
        userinfoUrl: env.AUTH_OIDC_PROVIDER_USERINFO_URL,
        logoutUrl: env.AUTH_OIDC_PROVIDER_LOGOUT_URL,
        redirectUri: `${env.NUXT_PUBLIC_SITE_URL}/auth/oidc/callback`,
        tokenRequestType: 'form-urlencoded',
        scope: ['openid', 'profile', 'roles'],
        state: true,
        nonce: true,
      },
    },
    middleware: {
      // The dashboard is only for authenticated users
      globalMiddlewareEnabled: true,
    },
  },

  openFetch: {
    clients: {
      api: {
        // NOTE: here it is intentional to path through /api, since we are using a proxy to the API server, which
        // appends the user access token to the requests for authentication.
        baseURL: `${env.NUXT_PUBLIC_SITE_URL}/api/v1`,
        schema: '../openapi/api-docs-v1.json',
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: env.API_BASE_URL,
    },
  },

  nitro: {
    storage: {
      // TODO [lh] use redis in production
      oidc: {
        driver: 'fs',
        base: './.nuxt/var/sessions',
      },
    },
  },

  ui: {
    safelistColors: ['primary', 'red', 'orange', 'green'],
  },

  colorMode: {
    disableTransition: false,
  },

  typescript: { strict: false },
  eslint: { config: { standalone: false } },
  devtools: { enabled: true },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-11',
})
