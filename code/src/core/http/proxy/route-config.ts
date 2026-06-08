import type { AppAbilitySubjectName } from '@/core/permissions/abilities'

export interface RouteConfig {
  path: string | RegExp
  whenAuthenticated?: 'redirect' | 'next'
  subject?: AppAbilitySubjectName
}

export const publicRoutes: RouteConfig[] = [
  { path: '/signin', whenAuthenticated: 'redirect' },
  { path: '/reset-password' },
  { path: '/docs' },
  { path: '/403' },
]

// Só rotas que precisam de enriquecimento (subject, etc.)
// Rotas sem entrada aqui ainda são privadas — só não têm verificação CASL.
export const privateRouteConfigs: RouteConfig[] = [
  { path: '/companies', subject: 'Company' },
  { path: '/users', subject: 'User' },
  { path: '/vehicles', subject: 'Vehicle' },
]

export const REDIRECT_WHEN_NOT_AUTHENTICATED = '/signin'
export const REDIRECT_WHEN_UNAUTHORIZED = '/403'
