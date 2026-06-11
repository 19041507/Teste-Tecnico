/**
 * Service de User — versão MOCKADA (sem backend).
 *
 * Mantém a mesma API pública da versão original (axios), operando sobre um
 * datastore em memória (`mock-users.ts`).
 */
import {
  QueryUserDto,
  queryUserSchema,
} from '@/modules/users/types/User/User/query-user.dto'
import {
  CreateUserDto,
  createUserSchema,
} from '@/modules/users/types/User/User/create-user.dto'
import {
  UpdateUserDto,
  updateUserSchema,
} from '@/modules/users/types/User/User/update-user.dto'
import { User } from '@/modules/users/types/User/User/base-user.dto'
import { mockUsers } from '@/modules/users/data/mock-users'
import { mockCompanies } from '@/modules/companies/data/mock-companies'
import {
  delay,
  genId,
  matchesSearch,
  paginate,
  toArrayBuffer,
} from '@/shared/mocks/mock-store'

const store: User[] = [...mockUsers]

function resolveCompany(companyId?: string | null): User['company'] {
  if (!companyId) return null
  const company = mockCompanies.find((c) => c.id === companyId)
  return company ? { id: company.id, tradeName: company.tradeName } : null
}

export const getUsers = async (params: QueryUserDto, signal?: AbortSignal) => {
  void signal
  const q = queryUserSchema.parse(params)
  await delay()

  const filtered = store.filter((u) => {
    if (!matchesSearch([u.name, u.username, u.email], q.search)) return false
    if (q.username && !u.username.toLowerCase().includes(q.username.toLowerCase()))
      return false
    if (q.name && !u.name.toLowerCase().includes(q.name.toLowerCase())) return false
    if (q.email && !u.email.toLowerCase().includes(q.email.toLowerCase())) return false
    if (q.isActive !== undefined && u.isActive !== q.isActive) return false
    if (q.companyId && u.company?.id !== q.companyId) return false
    if (q.roles && q.roles.length > 0 && !q.roles.some((r) => u.roles.includes(r)))
      return false
    return true
  })

  return paginate(filtered as unknown as Record<string, unknown>[], q) as unknown as {
    data: User[]
    meta: { total: number; page: number; limit: number; totalPages: number }
  }
}

export const createUser = async (data: CreateUserDto) => {
  const valid = createUserSchema.parse(data)
  await delay()
  const now = new Date()
  const user: User = {
    id: genId('usr'),
    username: valid.username,
    name: valid.name,
    email: valid.email,
    isActive: valid.isActive,
    roles: valid.roles,
    company: resolveCompany(valid.companyId),
    createdAt: now,
    updatedAt: now,
  }
  store.unshift(user)
  return user
}

export const updateUser = async (id: string, data: UpdateUserDto) => {
  const valid = updateUserSchema.parse(data)
  await delay()
  const index = store.findIndex((u) => u.id === id)
  if (index === -1) throw { statusCode: 404, message: 'Usuário não encontrado.' }

  const current = store[index]
  const updated: User = {
    ...current,
    ...(valid.username !== undefined && { username: valid.username }),
    ...(valid.name !== undefined && { name: valid.name }),
    ...(valid.email !== undefined && { email: valid.email }),
    ...(valid.isActive !== undefined && { isActive: valid.isActive }),
    ...(valid.roles !== undefined && { roles: valid.roles }),
    ...(valid.companyId !== undefined && {
      company: resolveCompany(valid.companyId),
    }),
    updatedAt: new Date(),
  }
  store[index] = updated
  return updated
}

export const deleteUser = async (id: string) => {
  await delay()
  const index = store.findIndex((u) => u.id === id)
  if (index !== -1) store.splice(index, 1)
  return { id }
}

export const exportUsers = async () => {
  await delay()
  const header = 'id,username,name,email,isActive,roles\n'
  const rows = store
    .map(
      (u) =>
        `${u.id},${u.username},${u.name},${u.email},${u.isActive},"${u.roles.join(
          '; '
        )}"`
    )
    .join('\n')
  return toArrayBuffer(header + rows)
}
