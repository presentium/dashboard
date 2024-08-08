// https://nuxt.com/docs/api/configuration/nuxt-config
import { env } from 'node:process'
import { execSync } from 'node:child_process'
import { version } from './package.json'

function getPublicURL(): string {
  if (env.CF_PAGES_URL) {
    return env.CF_PAGES_URL
  }

  return env.NUXT_PUBLIC_SITE_URL
}

function getRevision(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  }
  catch (e) {
    console.error('Unexpected error fetching revision', e)
    return 'unknown'
  }
}

function getVersion(): string {
  if (!version) {
    return getRevision()
  }

  return version
}

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
        openIdConfiguration: {
          issuer: env.AUTH_OIDC_PROVIDER_ISSUER_URL,
          jwks_uri: env.AUTH_OIDC_PROVIDER_JWKS_URL,
        },
        redirectUri: `${getPublicURL()}/auth/oidc/callback`,
        tokenRequestType: env.AUTH_OIDC_PROVIDER_TOKEN_REQUEST_TYPE as ('form' | 'json' | 'form-urlencoded') ?? 'form',
        scope: ['openid', 'profile', 'email', 'roles', 'offline_access'],
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
        baseURL: `${getPublicURL()}/api/v1`,
        schema: '../openapi/api-docs-v1.json',
      },
    },
  },

  runtimeConfig: {
    oidcTokenKey: env.NUXT_OIDC_TOKEN_KEY,
    // Keys in public are exposed to the client side
    public: {
      apiBaseUrl: env.API_BASE_URL,
      version: getRevision(),
    },
  },

  nitro: {
    devStorage: {
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

  // Env-specific overrides

  $development: {
    runtimeConfig: {
      public: {
        version: 'dev',
      },
    },
  },

  $production: {
    runtimeConfig: {
      public: {
        version: getVersion(),
      },
    },
  },
})
