import { getUserSessionId, requireUserSession } from 'nuxt-oidc-auth/runtime/server/utils/session.mjs'
import type { PersistentSession } from 'nuxt-oidc-auth/runtime/types/oidc.d.ts'
import { decryptToken } from 'nuxt-oidc-auth/runtime/server/utils/security.mjs'
import { createProxyEventHandler } from 'h3-proxy'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const sessionId = await getUserSessionId(event)
  if (!sessionId) {
    throw createError({ statusCode: 401, statusMessage: 'Not Authenticated' })
  }

  const persistentSession = await useStorage('oidc').getItem<PersistentSession>(sessionId)
  if (!persistentSession) {
    throw createError({ statusCode: 401, statusMessage: 'Not Authenticated' })
  }

  const { public: { apiBaseUrl }, oidcTokenKey } = useRuntimeConfig()
  const accessToken = await decryptToken(persistentSession.accessToken, oidcTokenKey)
  if (!accessToken) {
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
    enableLogger: true,
  })(event)
})
