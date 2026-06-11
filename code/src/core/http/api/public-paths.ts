/**
 * Paths do backend que não exigem autenticação (BFF proxy).
 * Usado pela rota app/api/backend/[...path] para decidir se exige cookie.
 */

//TODO: PATH ainda não implementados no backend
const PUBLIC_EXACT_PATHS = new Set([
  'users/forgot-password',
  'users/reset-password',
])

const PUBLIC_PREFIX_PATHS = ['users/validate-password-reset-token/']

export function isPublicApiPath(path: string[]): boolean {
  const p = path.join('/')
  return (
    PUBLIC_EXACT_PATHS.has(p) ||
    PUBLIC_PREFIX_PATHS.some((prefix) => p.startsWith(prefix))
  )
}
