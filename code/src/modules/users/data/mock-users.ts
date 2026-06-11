/**
 * Usuários mockados — fonte de dados do módulo `users` (sem backend).
 *
 * Válidos contra `userSchema`
 * (src/modules/users/types/User/User/base-user.dto.ts). A relação `company`
 * referencia empresas de `src/modules/companies/data/mock-companies.ts`.
 */
import { Role } from '@/shared/enums/role.enum'
import { mockCompanies } from '@/modules/companies/data/mock-companies'
import type { User } from '../types/User/User/base-user.dto'

const FIRST = [
  'Ana',
  'Bruno',
  'Carla',
  'Diego',
  'Elaine',
  'Felipe',
  'Gabriela',
  'Henrique',
  'Isabela',
  'João',
  'Karina',
  'Lucas',
  'Mariana',
  'Nicolas',
  'Olívia',
  'Paulo',
  'Renata',
  'Sérgio',
  'Tatiana',
  'Vinícius',
  'Wagner',
  'Yasmin',
  'Rafael',
  'Beatriz',
  'Eduardo',
]

const LAST = [
  'Silva',
  'Souza',
  'Oliveira',
  'Costa',
  'Pereira',
  'Almeida',
  'Lima',
  'Gomes',
  'Ribeiro',
  'Carvalho',
]

const ROLES = [
  Role.ADMIN_TECH,
  Role.ADMIN,
  Role.MANAGER,
  Role.REGISTER,
  Role.VIEWER,
]

function pad(n: number, width = 4): string {
  return String(n).padStart(width, '0')
}

export const mockUsers: User[] = FIRST.map((first, i) => {
  const seq = i + 1
  const last = LAST[i % LAST.length]
  const name = `${first} ${last}`
  const username = `${first}.${last}`.toLowerCase().replace(/[^a-z.]/g, '')
  const company = mockCompanies[i % mockCompanies.length]
  const createdAt = new Date(2025, 1, 1 + i, 10, 0, 0)
  return {
    id: `usr-${pad(seq)}`,
    username,
    name,
    email: `${username}@motiron.com.br`,
    isActive: seq % 7 !== 0,
    roles: [ROLES[i % ROLES.length]],
    company: { id: company.id, tradeName: company.tradeName },
    createdAt,
    updatedAt: createdAt,
  }
})
