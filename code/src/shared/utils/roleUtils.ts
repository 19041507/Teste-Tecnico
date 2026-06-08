import { Role } from '@/shared/enums/role.enum'

export const SYSTEM_ADMIN_ROLES = [Role.ADMIN, Role.ADMIN_TECH] as const

export const COMPANY_BASE_ROLES = [Role.REGISTER, Role.VIEWER] as const

export const isSystemAdminRole = (role: Role) =>
  SYSTEM_ADMIN_ROLES.includes(role as (typeof SYSTEM_ADMIN_ROLES)[number])

export const isCompanyRole = (role: Role) =>
  COMPANY_BASE_ROLES.includes(role as (typeof COMPANY_BASE_ROLES)[number])
