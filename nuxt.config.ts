// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

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
        clientId: process.env.AUTH_OIDC_CLIENT_ID,
        clientSecret: process.env.AUTH_OIDC_CLIENT_SECRET,
        authorizationUrl: process.env.AUTH_OIDC_PROVIDER_AUTHORIZE_URL,
        tokenUrl: process.env.AUTH_OIDC_PROVIDER_TOKEN_URL,
        userinfoUrl: process.env.AUTH_OIDC_PROVIDER_USERINFO_URL,
        logoutUrl: process.env.AUTH_OIDC_PROVIDER_LOGOUT_URL,
        redirectUri: `${process.env.NUXT_PUBLIC_SITE_URL}/auth/oidc/callback`,
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
        baseURL: `${process.env.NUXT_PUBLIC_SITE_URL}/api/v1`,
        schema: '../openapi/api-docs-v1.json',
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
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
    icons: ['heroicons', 'simple-icons', 'solar'],
    safelistColors: ['primary', 'red', 'orange', 'green'],
  },

  colorMode: {
    disableTransition: true,
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true },
  },

  devtools: {
    enabled: true,
  },

  typescript: {
    strict: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-07-11',
})
