import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
} from '@/core/auth/auth-constants'
import { setAuthCookies, clearAuthCookies } from '@/core/auth/cookie-helpers'
import { getDecodedPayload } from '@/core/http/proxy/jwt-payload'
import {
  createMockAccessToken,
  MOCK_TOKEN_TTL_SECONDS,
} from '@/core/auth/mock-token'

/**
 * Refresh MOCKADO (sem backend): re-emite o token mock com novo `exp`,
 * preservando as claims do usuário atual quando possível.
 */
export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value

    if (!refreshToken) {
      const response = NextResponse.json(
        { message: 'Não autenticado.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
      clearAuthCookies(response.cookies)
      return response
    }

    const previous = getDecodedPayload(
      cookieStore.get(ACCESS_COOKIE_NAME)?.value ?? ''
    )

    const accessToken = createMockAccessToken({
      sub: previous?.sub,
      username: previous?.username || undefined,
      name: previous?.name || undefined,
      roles: previous?.roles,
      companyId: previous?.companyId ?? null,
    })

    const response = NextResponse.json({}, { status: 200 })
    setAuthCookies(
      response.cookies,
      { accessToken, refreshToken: 'mock-refresh-token' },
      MOCK_TOKEN_TTL_SECONDS
    )

    return response
  } catch (err) {
    console.error('[api/auth/refresh]', err)
    return NextResponse.json(
      { message: 'Erro ao renovar sessão.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
