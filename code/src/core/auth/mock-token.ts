/**
 * Geração de access token MOCKADO para rodar a aplicação SEM backend.
 *
 * O projeto apenas DECODIFICA o JWT (`getDecodedPayload` usa `jwt-decode`, sem
 * verificar assinatura), então um token forjado com claims válidas é suficiente
 * para autenticar localmente durante o teste técnico.
 *
 * Em produção, o token real é emitido pelo backend de autenticação.
 */
import { Role } from '@/shared/enums/role.enum'

function base64url(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64url')
}

export interface MockTokenClaims {
  sub?: string
  username?: string
  name?: string
  roles?: string[]
  companyId?: string | null
  /** Tempo de vida do token, em segundos (padrão: 30 dias). */
  ttlSeconds?: number
}

/** Tempo de vida padrão do token/cookie mock, em segundos. */
export const MOCK_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60

export function createMockAccessToken(claims: MockTokenClaims = {}): string {
  const now = Math.floor(Date.now() / 1000)
  const ttl = claims.ttlSeconds ?? MOCK_TOKEN_TTL_SECONDS

  const header = { alg: 'none', typ: 'JWT' }
  const payload = {
    sub: claims.sub ?? 'mock-user-001',
    username: claims.username ?? 'demo',
    name: claims.name ?? 'Usuário Demo',
    isActive: true,
    roles: claims.roles ?? [Role.ADMIN],
    companyId: claims.companyId ?? null,
    iat: now,
    exp: now + ttl,
  }

  return `${base64url(JSON.stringify(header))}.${base64url(
    JSON.stringify(payload)
  )}.mock-signature`
}
