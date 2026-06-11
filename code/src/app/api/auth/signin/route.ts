import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookies } from '@/core/auth/cookie-helpers'
import {
  createMockAccessToken,
  MOCK_TOKEN_TTL_SECONDS,
} from '@/core/auth/mock-token'

/**
 * Login MOCKADO (sem backend) para o teste técnico.
 *
 * Aceita QUALQUER credencial: basta informar um usuário e uma senha. O usuário
 * autenticado recebe o papel de Administrador (acesso total aos módulos).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const username =
      typeof body?.username === 'string' && body.username.trim()
        ? body.username.trim()
        : 'demo'

    const accessToken = createMockAccessToken({
      sub: `mock-${username}`,
      username,
      name: username,
    })

    const response = NextResponse.json({}, { status: 200 })
    setAuthCookies(
      response.cookies,
      { accessToken, refreshToken: 'mock-refresh-token' },
      MOCK_TOKEN_TTL_SECONDS
    )

    return response
  } catch (err) {
    console.error('[api/auth/signin]', err)
    return NextResponse.json(
      { message: 'Erro ao autenticar.', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
