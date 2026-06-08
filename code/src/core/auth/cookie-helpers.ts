import {
  ACCESS_COOKIE_NAME,
  ACCESS_COOKIE_MAX_AGE_FALLBACK,
  REFRESH_COOKIE_NAME,
  REFRESH_COOKIE_PATH,
} from '@/core/auth/auth-constants'

interface CookieJar {
  set(
    name: string,
    value: string,
    options?: {
      httpOnly?: boolean
      secure?: boolean
      sameSite?: 'strict' | 'lax' | 'none'
      path?: string
      maxAge?: number
    }
  ): void
}

export function setAuthCookies(
  jar: CookieJar,
  tokens: { accessToken: string; refreshToken?: string },
  refreshExpiresIn?: number
): void {
  const isProduction = process.env.NODE_ENV === 'production'

  jar.set(ACCESS_COOKIE_NAME, tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: refreshExpiresIn ?? ACCESS_COOKIE_MAX_AGE_FALLBACK,
  })

  if (tokens.refreshToken !== undefined) {
    jar.set(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: REFRESH_COOKIE_PATH,
      ...(refreshExpiresIn !== undefined && { maxAge: refreshExpiresIn }),
    })
  }
}

export function clearAuthCookies(jar: CookieJar): void {
  jar.set(ACCESS_COOKIE_NAME, '', { maxAge: 0, path: '/' })
  jar.set(REFRESH_COOKIE_NAME, '', { maxAge: 0, path: REFRESH_COOKIE_PATH })
}
