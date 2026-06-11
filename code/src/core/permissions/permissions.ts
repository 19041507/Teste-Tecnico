import { AppAbility } from './abilities'
import { Role } from '@/shared/enums/role.enum'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

export type UserForAbility = {
  roles: string[]
  isActive: boolean
}

export const EMPTY_USER: UserForAbility = { roles: [], isActive: false }

type UserPermissions = (
  user: UserForAbility,
  builder: AbilityBuilder<AppAbility>
) => void

export const permissions: Record<Role, UserPermissions> = {
  [Role.ADMIN_TECH](user, { can }) {
    can('manage', 'all')
  },

  [Role.ADMIN](user, { can }) {
    can('manage', 'all')
  },

  [Role.MANAGER](user, { can }) {
    can('manage', 'User')
    can('manage', 'Vehicle')
  },

  [Role.REGISTER](user, { can }) {
    can('read', 'Vehicle')
  },

  [Role.VIEWER](user, { can }) {
    can('read', 'Vehicle')
  },
}

export function defineAbilityFor(user: UserForAbility | null | undefined) {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (!user?.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    builder.cannot('manage', 'all').because('Usuário sem função atribuída')
    return builder.build()
  }

  if (!user.isActive) {
    builder.cannot('manage', 'all').because('Usuário inativo')
    return builder.build()
  }

  const roleValues = Object.values(Role) as string[]
  for (const role of user.roles) {
    if (!roleValues.includes(role)) {
      continue
    }

    const definePermissions = permissions[role as Role]
    if (definePermissions) {
      definePermissions(user, builder)
    }
  }

  return builder.build()
}
