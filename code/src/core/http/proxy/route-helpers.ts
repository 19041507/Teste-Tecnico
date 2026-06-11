import type { NextRequest } from 'next/server'
import type { RouteConfig } from './route-config'

export function matchesRoute(path: string, routeConfig: RouteConfig): boolean {
  if (typeof routeConfig.path === 'string') {
    const base = routeConfig.path.endsWith('/')
      ? routeConfig.path.slice(0, -1)
      : routeConfig.path

    return path === base || path.startsWith(`${base}/`)
  }

  return routeConfig.path.test(path)
}

export function createRedirectUrlWithCallback(
  request: NextRequest,
  redirectPath: string
): URL {
  const redirectUrl = new URL(redirectPath, request.url)

  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search
  const currentUrl = `${pathname}${search}`

  if (pathname === redirectPath) {
    return redirectUrl
  }

  const isSafeCallback =
    currentUrl.startsWith('/') && !currentUrl.startsWith('//')

  if (isSafeCallback) {
    redirectUrl.searchParams.set('callback', currentUrl)
  }

  return redirectUrl
}
