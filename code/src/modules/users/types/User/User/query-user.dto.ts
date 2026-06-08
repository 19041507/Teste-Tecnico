import { Role } from '@/shared/enums/role.enum'
import { z } from 'zod'

export const queryUserSchema = z.object({
  search: z.string().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  isActive: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional(),
  roles: z.array(z.nativeEnum(Role)).optional(),
  companyId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  orderBy: z
    .enum([
      'username',
      'name',
      'email',
      'isActive',
      'companyId',
      'createdAt',
      'updatedAt',
    ])
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

export type QueryUserDto = z.infer<typeof queryUserSchema>
