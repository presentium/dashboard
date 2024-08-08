import { getUserSessionId, requireUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.mjs'
import type { PersistentSession } from 'nuxt-oidc-auth/runtime/types/oidc.d.ts'
import { decryptToken } from 'nuxt-oidc-auth/runtime/server/utils/security.mjs'
import { createProxyEventHandler } from 'h3-proxy'
import { consola } from 'consola'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const sessionId = await getUserSessionId(event)

  if (!sessionId) {
    consola.warn('Failed to get user session ID')
    throw createError({ statusCode: 401, statusMessage: 'Not Authenticated' })
  }

  const persistentSession = await useStorage('oidc').getItem<PersistentSession>(sessionId)
  if (!persistentSession) {
    consola.warn('Failed to get persistent session')
    throw createError({ statusCode: 401, statusMessage: 'Not Authenticated' })
  }

  const { public: { apiBaseUrl }, oidcTokenKey } = useRuntimeConfig()
  const accessToken = await decryptToken(persistentSession.accessToken, oidcTokenKey)
  if (!accessToken) {
    consola.warn('Failed to decrypt access token')
    throw createError({ statusCode: 401, statusMessage: 'Not Authenticated' })
  }

  return createProxyEventHandler({
    target: apiBaseUrl,
    pathRewrite: { '^/api': '' },
    pathFilter: ['/api/**'],
    configureProxyRequest: () => ({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
    enableLogger: false,
  })(event)
})
