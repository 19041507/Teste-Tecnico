import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ACCESS_COOKIE_NAME } from '@/core/auth/auth-constants'
import {
  getDecodedPayload,
  isPayloadExpired,
} from '@/core/http/proxy/jwt-payload'

export async function GET() {
  try {
    const token = (await cookies()).get(ACCESS_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Não autenticado.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const payload = getDecodedPayload(token)

    if (!payload || isPayloadExpired(payload)) {
      return NextResponse.json(
        { message: 'Sessão expirada.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: payload.sub,
      username: payload.username,
      name: payload.name,
      isActive: payload.isActive,
      roles: payload.roles,
      companyId: payload.companyId ?? null,
      issuedAt: payload.iat,
      expiresAt: payload.exp,
    })
  } catch {
    return NextResponse.json(
      { message: 'Token inválido.', code: 'UNAUTHORIZED' },
      { status: 401 }
    )
  }
}
