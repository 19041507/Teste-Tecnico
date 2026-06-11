import { NextResponse, type NextRequest, type ProxyConfig } from 'next/server'
import { ACCESS_COOKIE_NAME } from '@/core/auth/auth-constants'
import { defineAbilityFor } from '@/core/permissions/permissions'
import {
  createRedirectUrlWithCallback,
  getDecodedPayload,
  isPayloadExpired,
  matchesRoute,
  privateRouteConfigs,
  publicRoutes,
  REDIRECT_WHEN_NOT_AUTHENTICATED,
  REDIRECT_WHEN_UNAUTHORIZED,
} from '@/core/http/proxy'
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value
  const payload = token ? getDecodedPayload(token) : null

  // Token is expired when absent, malformed, or past its exp claim.
  // With maxAge tied to the refresh token lifetime, a present-but-expired cookie
  // signals a recoverable session — the client interceptor will refresh it.
  const isExpired = !payload || isPayloadExpired(payload)
  const hasValidAccess = Boolean(payload?.sub) && !isExpired

  // Stale access (cookie present, JWT expired) or refresh token present both
  // indicate a session that may still be recoverable client-side.
  const hasRecoverableSession = Boolean(payload?.sub)
  const publicRoute = publicRoutes.find((route) => matchesRoute(path, route))
  const privateRoute = privateRouteConfigs.find((route) =>
    matchesRoute(path, route)
  )

  // Public route — never requires authentication
  if (publicRoute) {
    if (publicRoute.whenAuthenticated === 'redirect' && hasRecoverableSession) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // No recoverable session at all — redirect to login
  if (!hasRecoverableSession) {
    return NextResponse.redirect(
      new URL(
        createRedirectUrlWithCallback(request, REDIRECT_WHEN_NOT_AUTHENTICATED),
        request.url
      )
    )
  }

  // Stale access token or refresh-only: pass through for client-side recovery.
  // CASL is skipped — authorizing against a stale payload is unsafe.
  if (!hasValidAccess) {
    return NextResponse.next()
  }

  // Rota privada — verificação CASL
  if (privateRoute?.subject && payload) {
    const ability = defineAbilityFor(payload)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!ability.can('read', privateRoute.subject as any)) {
      return NextResponse.redirect(
        new URL(REDIRECT_WHEN_UNAUTHORIZED, request.url)
      )
    }
  }

  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
