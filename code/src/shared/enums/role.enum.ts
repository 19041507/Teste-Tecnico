export enum Role {
  ADMIN_TECH = 'Administrador Técnico',
  ADMIN = 'Administrador',
  MANAGER = 'Gestor',
  REGISTER = 'Cadastrante',
  VIEWER = 'Visualização',
}

export const ROLE_BADGE_CLASS: Partial<Record<Role, string>> = {
  [Role.ADMIN_TECH]: 'bg-teal-100 text-teal-800',
  [Role.ADMIN]: 'bg-purple-100 text-purple-800',
  [Role.MANAGER]: 'bg-blue-100 text-blue-800',
  [Role.REGISTER]: 'bg-lime-100 text-lime-800',
  [Role.VIEWER]: 'bg-gray-100 text-gray-800',
}
